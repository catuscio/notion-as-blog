import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export type Properties = PageObjectResponse["properties"];
export type PropertyValue = Properties[string];

export function getRichTextPlain(prop: PropertyValue | undefined): string {
  if (!prop) return "";
  if (prop.type === "rich_text") {
    return prop.rich_text.map((t) => t.plain_text).join("");
  }
  if (prop.type === "title") {
    return prop.title.map((t) => t.plain_text).join("");
  }
  return "";
}

export function getSelectValue(prop: PropertyValue | undefined): string {
  if (!prop) return "";
  if (prop.type === "select" && prop.select) {
    return prop.select.name;
  }
  return "";
}

export function getMultiSelectValues(prop: PropertyValue | undefined): string[] {
  if (!prop) return [];
  if (prop.type === "multi_select") {
    return prop.multi_select.map((s) => s.name);
  }
  return [];
}

export function getDateValue(prop: PropertyValue | undefined): string {
  if (!prop) return "";
  if (prop.type === "date" && prop.date) {
    return prop.date.start;
  }
  return "";
}

export function getPeopleNames(prop: PropertyValue | undefined): string {
  if (!prop) return "";
  if (prop.type === "people") {
    return prop.people
      .map((p) => ("name" in p && p.name ? p.name : ""))
      .filter(Boolean)
      .join(", ");
  }
  return "";
}

export function getFileUrl(prop: PropertyValue | undefined): string {
  if (!prop) return "";
  if (prop.type === "files" && prop.files.length > 0) {
    const file = prop.files[0];
    if (file.type === "file") return file.file.url;
    if (file.type === "external") return file.external.url;
  }
  return "";
}

export function getUrl(prop: PropertyValue | undefined): string {
  if (!prop) return "";
  if (prop.type === "url" && prop.url) return prop.url;
  if (prop.type === "rich_text") {
    return prop.rich_text.map((t) => t.plain_text).join("");
  }
  return "";
}

export function getProp(
  props: Properties,
  name: string
): PropertyValue | undefined {
  if (props[name]) return props[name];
  const lower = name.toLowerCase();
  for (const key of Object.keys(props)) {
    if (key.toLowerCase() === lower) return props[key];
  }
  return undefined;
}
