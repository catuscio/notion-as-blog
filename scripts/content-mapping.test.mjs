import assert from "node:assert/strict";
import test from "node:test";

import { mapNotionPageToContent } from "../src/lib/notion/mapNotionPage.ts";

function property(type, value) {
  return { id: type, type, [type]: value };
}

function notionPage(properties) {
  return {
    object: "page",
    id: "11111111-2222-3333-4444-555555555555",
    created_time: "2026-01-01T00:00:00.000Z",
    last_edited_time: "2026-01-02T00:00:00.000Z",
    created_by: { object: "user", id: "user" },
    last_edited_by: { object: "user", id: "user" },
    cover: null,
    icon: null,
    parent: { type: "workspace", workspace: true },
    archived: false,
    in_trash: false,
    properties,
    url: "https://www.notion.so/example",
    public_url: null,
  };
}

test("maps a valid Notion row to the content contract", () => {
  const page = notionPage({
    title: property("title", [{ plain_text: "Hello", type: "text", text: { content: "Hello", link: null }, annotations: {} }]),
    slug: property("rich_text", [{ plain_text: "hello", type: "text", text: { content: "hello", link: null }, annotations: {} }]),
    status: property("select", { id: "public", name: "Public", color: "green" }),
    type: property("select", { id: "post", name: "Post", color: "blue" }),
    date: property("date", { start: "2026-01-01", end: null, time_zone: null }),
    tags: property("multi_select", [{ id: "ts", name: "TypeScript", color: "blue" }]),
    category: property("select", { id: "dev", name: "Development", color: "blue" }),
    author: property("people", [{ id: "author-1", name: "Ada" }]),
    pinned: property("checkbox", true),
  });

  const content = mapNotionPageToContent(page);

  assert.equal(content.title, "Hello");
  assert.equal(content.slug, "hello");
  assert.equal(content.status, "Public");
  assert.equal(content.type, "Post");
  assert.deepEqual(content.tags, ["TypeScript"]);
  assert.equal(content.category, "Development");
  assert.equal(content.author, "Ada");
  assert.deepEqual(content.authorIds, ["author-1"]);
  assert.equal(content.pinned, true);
});

test("keeps documented and fail-closed defaults for optional type and invalid status", () => {
  const page = notionPage({
    Name: property("title", [{ plain_text: "Fallbacks", type: "text", text: { content: "Fallbacks", link: null }, annotations: {} }]),
    status: property("select", { id: "unknown", name: "Unknown", color: "default" }),
  });

  const content = mapNotionPageToContent(page);

  assert.equal(content.slug, "11111111222233334444555555555555");
  assert.equal(content.status, "Draft");
  assert.equal(content.type, "Post");
});
