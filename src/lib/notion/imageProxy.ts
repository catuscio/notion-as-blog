import { createHmac, timingSafeEqual } from "node:crypto";
import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { getProp, type PropertyValue } from "./propertyHelpers";

export const NOTION_IMAGE_API_PATH = "/api/notion-image";

const SIGNATURE_PARAM = "sig";
const SIGNED_KEYS = ["blockId", "cover", "pageId", "property"] as const;
const ALLOWED_NOTION_FILE_HOSTS = new Set([
  "www.notion.so",
  "notion.so",
  "prod-files-secure.s3.us-west-2.amazonaws.com",
  "s3.us-west-2.amazonaws.com",
  "s3-us-west-2.amazonaws.com",
]);

type SignedKey = (typeof SIGNED_KEYS)[number];
type ImageReference = Partial<Record<SignedKey, string>>;

type NotionFileValue = {
  type?: string;
  file?: { url?: string };
  external?: { url?: string };
};

function signingSecret() {
  return process.env.NOTION_IMAGE_SIGNING_SECRET || process.env.NOTION_API_KEY || "";
}

function canonicalPayload(reference: ImageReference) {
  return SIGNED_KEYS
    .map((key) => `${key}=${reference[key] || ""}`)
    .join("&");
}

function signImageReference(reference: ImageReference) {
  const secret = signingSecret();
  if (!secret) return "";
  return createHmac("sha256", secret).update(canonicalPayload(reference)).digest("base64url");
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return leftBuffer.length === rightBuffer.length && timingSafeEqual(leftBuffer, rightBuffer);
}

function referenceFromSearchParams(searchParams: URLSearchParams): ImageReference {
  return Object.fromEntries(
    SIGNED_KEYS.map((key) => [key, searchParams.get(key) || ""])
  ) as ImageReference;
}

export function signedNotionImagePath(reference: ImageReference) {
  const params = new URLSearchParams();
  for (const key of SIGNED_KEYS) {
    const value = reference[key];
    if (value) params.set(key, value);
  }

  const signature = signImageReference(reference);
  if (signature) params.set(SIGNATURE_PARAM, signature);

  return `${NOTION_IMAGE_API_PATH}?${params.toString()}`;
}

export function hasValidNotionImageSignature(searchParams: URLSearchParams) {
  const expectedSignature = signImageReference(referenceFromSearchParams(searchParams));
  const suppliedSignature = searchParams.get(SIGNATURE_PARAM) || "";

  return Boolean(expectedSignature && suppliedSignature && safeEqual(suppliedSignature, expectedSignature));
}

export function isAllowedNotionFileUrl(url: string) {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && ALLOWED_NOTION_FILE_HOSTS.has(parsed.hostname);
  } catch {
    return false;
  }
}

function notionFileUrl(file: NotionFileValue | null | undefined) {
  if (!file) return "";
  if (file.type === "file") return file.file?.url || "";
  if (file.type === "external") return file.external?.url || "";
  return "";
}

export function stableImageFileUrl(
  value: PropertyValue | undefined,
  pageId: string,
  propertyName: string
) {
  if (!value || value.type !== "files") return "";
  const file = value.files[0];
  if (!file) return "";
  if (file.type === "external") return file.external.url;
  if (file.type === "file") return signedNotionImagePath({ pageId, property: propertyName });
  return "";
}

export function stablePageCover(page: PageObjectResponse) {
  if (!page.cover) return "";
  if (page.cover.type === "external") return page.cover.external.url;
  return signedNotionImagePath({ pageId: page.id, cover: "1" });
}

export function stableBlockFileUrl(file: NotionFileValue | undefined, blockId: string) {
  if (!file) return "";
  if (file.type === "external") return file.external?.url || "";
  if (file.type === "file") return signedNotionImagePath({ blockId });
  return "";
}

function propertyFileUrl(page: PageObjectResponse, propertyName: string) {
  const value = getProp(page.properties, propertyName);
  if (!value || value.type !== "files") return "";
  const file = value.files[0] as NotionFileValue | undefined;
  return notionFileUrl(file);
}

function pageCoverUrl(page: PageObjectResponse) {
  return notionFileUrl(page.cover as NotionFileValue | null);
}

function blockFileUrl(block: unknown) {
  if (typeof block !== "object" || block === null || !("type" in block)) return "";
  const type = (block as { type?: unknown }).type;
  if (typeof type !== "string") return "";
  if (!["image", "file", "video", "audio", "pdf"].includes(type)) return "";
  return notionFileUrl((block as Record<string, unknown>)[type] as NotionFileValue | undefined);
}

export async function resolveNotionImageUrl(searchParams: URLSearchParams) {
  const { notionClient } = await import("./client");
  const blockId = searchParams.get("blockId") || "";
  const pageId = searchParams.get("pageId") || "";
  const propertyName = searchParams.get("property") || "";
  const wantsCover = searchParams.get("cover") === "1";

  if (blockId) {
    const block = await notionClient.blocks.retrieve({ block_id: blockId });
    return blockFileUrl(block);
  }

  if (pageId) {
    const page = await notionClient.pages.retrieve({ page_id: pageId });
    if (!("properties" in page)) return "";
    return wantsCover ? pageCoverUrl(page) : propertyFileUrl(page, propertyName);
  }

  return "";
}

function proxySearchParams(url: string) {
  try {
    const parsed = new URL(url, "https://notion-as-blog.local");
    if (parsed.pathname !== NOTION_IMAGE_API_PATH) return null;
    return parsed.searchParams;
  } catch {
    return null;
  }
}

/**
 * Resolve a stable Notion image proxy URL, fetch its current signed Notion file,
 * resize it, and return an embeddable PNG data URL for OG image generation.
 */
export async function readNotionImageResizedAsBase64(
  url: string,
  width: number,
  height: number,
): Promise<string | null> {
  const searchParams = proxySearchParams(url);
  if (!searchParams || !hasValidNotionImageSignature(searchParams)) return null;

  try {
    const resolvedUrl = await resolveNotionImageUrl(searchParams);
    if (!resolvedUrl || !isAllowedNotionFileUrl(resolvedUrl)) return null;

    const response = await fetch(resolvedUrl);
    if (!response.ok) return null;

    const sharp = (await import("sharp")).default;
    const buffer = await sharp(Buffer.from(await response.arrayBuffer()))
      .resize(width, height, { fit: "cover" })
      .toFormat("png")
      .toBuffer();
    return `data:image/png;base64,${buffer.toString("base64")}`;
  } catch {
    return null;
  }
}
