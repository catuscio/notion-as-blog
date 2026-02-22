import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { Post } from "@/types";
import {
  getRichTextPlain,
  getSelectValue,
  getMultiSelectValues,
  getDateValue,
  getPeopleNames,
  getPeopleIds,
  getProp,
} from "./propertyHelpers";

export function getPageProperties(
  page: PageObjectResponse
): Post {
  const props = page.properties;
  const get = (name: string) => getProp(props, name);

  const titleProp = get("title") ?? get("Name");
  const title = getRichTextPlain(titleProp);

  const slugProp = get("slug");
  const slug = getRichTextPlain(slugProp) || page.id.replace(/-/g, "");

  const VALID_STATUSES: Post["status"][] = ["Public", "PublicOnDetail", "Draft", "Private"];
  const VALID_TYPES: Post["type"][] = ["Post", "Page"];

  const rawStatus = getSelectValue(get("status"));
  const status: Post["status"] = VALID_STATUSES.includes(rawStatus as Post["status"])
    ? (rawStatus as Post["status"])
    : "Draft";

  const rawType = getSelectValue(get("type"));
  const type: Post["type"] = VALID_TYPES.includes(rawType as Post["type"])
    ? (rawType as Post["type"])
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
    page.cover?.type === "file" ? page.cover.file.url :
    page.cover?.type === "external" ? page.cover.external.url : "";

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
    blurDataURL: "",
    fullWidth: false,
    pinned,
  };
}
