import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { ContentItem } from "@/types";
import {
  getRichTextPlain,
  getSelectValue,
  getMultiSelectValues,
  getDateValue,
  getPeopleNames,
  getPeopleIds,
  getProp,
} from "./propertyHelpers";
import { stableImageFileUrl, stablePageCover } from "./imageProxy";

const VALID_STATUSES: ContentItem["status"][] = [
  "Public",
  "PublicOnDetail",
  "Draft",
  "Private",
];
const VALID_TYPES: ContentItem["type"][] = ["Post", "Page"];

function parseEnum<T extends string>(
  pageId: string,
  field: string,
  value: string,
  validValues: readonly T[],
  defaultValue: T,
): T {
  if (!value) return defaultValue;
  if (validValues.includes(value as T)) return value as T;
  throw new Error(`Notion content mapping error for page ${pageId}: invalid ${field} "${value}"`);
}

export function mapNotionPageToContent(
  page: PageObjectResponse
): ContentItem {
  const props = page.properties;
  const get = (name: string) => getProp(props, name);

  const titleProp = get("title") ?? get("Name");
  const title = getRichTextPlain(titleProp);

  const slugProp = get("slug");
  const slug = getRichTextPlain(slugProp) || page.id.replace(/-/g, "");

  const rawStatus = getSelectValue(get("status"));
  const status = parseEnum(page.id, "status", rawStatus, VALID_STATUSES, "Draft");

  const rawType = getSelectValue(get("type"));
  const type = parseEnum(page.id, "type", rawType, VALID_TYPES, "Post");
  const date = getDateValue(get("date"));
  const tags = getMultiSelectValues(get("tags"));
  const category = getSelectValue(get("category")) || null;
  const series = getSelectValue(get("series")) || null;

  const authorProp = get("author");
  const author = getPeopleNames(authorProp) || getRichTextPlain(authorProp);
  const authorIds = getPeopleIds(authorProp);

  const summary = getRichTextPlain(get("summary"));
  const thumbnail =
    stableImageFileUrl(get("thumbnail"), page.id, "thumbnail") ||
    stableImageFileUrl(get("image"), page.id, "image") ||
    stableImageFileUrl(get("cover"), page.id, "cover") ||
    stablePageCover(page);

  const pinnedProp = get("pinned");
  const pinned =
    pinnedProp?.type === "checkbox" ? pinnedProp.checkbox : false;

  if (type === "Post" && (status === "Public" || status === "PublicOnDetail")) {
    const missingFields = [
      !title && "title",
      !date && "date",
      !category && "category",
    ].filter(Boolean);
    if (missingFields.length > 0) {
      throw new Error(
        `Notion content mapping error for page ${page.id}: public Post is missing ${missingFields.join(", ")}`,
      );
    }
  }

  return {
    id: page.id,
    title,
    slug,
    status,
    type,
    date,
    lastEditedTime: page.last_edited_time,
    tags,
    category,
    series,
    author,
    authorIds,
    summary,
    thumbnail,
    fullWidth: false,
    pinned,
  };
}
