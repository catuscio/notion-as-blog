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

export function mapNotionPageToContent(
  page: PageObjectResponse
): ContentItem {
  const props = page.properties;
  const get = (name: string) => getProp(props, name);

  const titleProp = get("title") ?? get("Name");
  const title = getRichTextPlain(titleProp);

  const slugProp = get("slug");
  const slug = getRichTextPlain(slugProp) || page.id.replace(/-/g, "");

  const VALID_STATUSES: ContentItem["status"][] = ["Public", "PublicOnDetail", "Draft", "Private"];
  const VALID_TYPES: ContentItem["type"][] = ["Post", "Page"];

  const rawStatus = getSelectValue(get("status"));
  const status: ContentItem["status"] = VALID_STATUSES.includes(rawStatus as ContentItem["status"])
    ? (rawStatus as ContentItem["status"])
    : "Draft";

  const rawType = getSelectValue(get("type"));
  const type: ContentItem["type"] = VALID_TYPES.includes(rawType as ContentItem["type"])
    ? (rawType as ContentItem["type"])
    : "Post";
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
