import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import type { TPost } from "@/types";
import {
  getRichTextPlain,
  getSelectValue,
  getMultiSelectValues,
  getDateValue,
  getPeopleNames,
  getFileUrl,
  getProp,
} from "./propertyHelpers";

export function getPageProperties(
  page: PageObjectResponse
): TPost {
  const props = page.properties;
  const get = (name: string) => getProp(props, name);

  const titleProp = get("title") ?? get("Name");
  const title = getRichTextPlain(titleProp);

  const slugProp = get("slug");
  const slug = getRichTextPlain(slugProp) || page.id.replace(/-/g, "");

  const status = getSelectValue(get("status")) || "Draft";
  const type = getSelectValue(get("type")) || "Post";
  const date = getDateValue(get("date"));
  const tags = getMultiSelectValues(get("tags"));
  const category = getSelectValue(get("category"));
  const series = getRichTextPlain(get("series"));

  const authorProp = get("author");
  const author = getPeopleNames(authorProp) || getRichTextPlain(authorProp);

  const summary = getRichTextPlain(get("summary"));
  const thumbnail = getFileUrl(get("thumbnail"));

  const pinnedProp = get("pinned");
  const pinned =
    pinnedProp?.type === "checkbox" ? pinnedProp.checkbox : false;

  return {
    id: page.id,
    title,
    slug,
    status: (status as TPost["status"]) || "Draft",
    type: (type as TPost["type"]) || "Post",
    date,
    tags,
    category,
    series,
    author,
    summary,
    thumbnail,
    fullWidth: false,
    pinned,
  };
}
