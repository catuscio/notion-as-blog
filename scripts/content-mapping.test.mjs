import assert from "node:assert/strict";
import test from "node:test";

import { mapNotionPageToContent } from "../src/lib/notion/mapNotionPage.ts";
import { loadOptionalAuthors } from "../src/lib/notion/optionalAuthors.ts";

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

test("defaults only absent workflow fields", () => {
  const page = notionPage({
    Name: property("title", [{ plain_text: "Fallbacks", type: "text", text: { content: "Fallbacks", link: null }, annotations: {} }]),
  });

  const content = mapNotionPageToContent(page);

  assert.equal(content.slug, "11111111222233334444555555555555");
  assert.equal(content.status, "Draft");
  assert.equal(content.type, "Post");
});

test("rejects non-empty unknown status and type values", () => {
  const invalidStatus = notionPage({
    title: property("title", [{ plain_text: "Invalid", type: "text", text: { content: "Invalid", link: null }, annotations: {} }]),
    status: property("select", { id: "unknown", name: "Publc", color: "default" }),
  });
  assert.throws(
    () => mapNotionPageToContent(invalidStatus),
    /page 11111111-2222-3333-4444-555555555555: invalid status "Publc"/,
  );

  const invalidType = notionPage({
    title: property("title", [{ plain_text: "Invalid", type: "text", text: { content: "Invalid", link: null }, annotations: {} }]),
    type: property("select", { id: "unknown", name: "Article", color: "default" }),
  });
  assert.throws(
    () => mapNotionPageToContent(invalidType),
    /page 11111111-2222-3333-4444-555555555555: invalid type "Article"/,
  );
});

test("rejects incomplete publicly visible posts", () => {
  const page = notionPage({
    title: property("title", [{ plain_text: "Incomplete", type: "text", text: { content: "Incomplete", link: null }, annotations: {} }]),
    status: property("select", { id: "public", name: "Public", color: "green" }),
    type: property("select", { id: "post", name: "Post", color: "blue" }),
  });

  assert.throws(
    () => mapNotionPageToContent(page),
    /page 11111111-2222-3333-4444-555555555555: public Post is missing date, category/,
  );
});

for (const status of ["Public", "PublicOnDetail"]) {
  test(`rejects a titleless ${status} Page`, () => {
    const page = notionPage({
      status: property("select", { id: status.toLowerCase(), name: status, color: "green" }),
      type: property("select", { id: "page", name: "Page", color: "blue" }),
    });

    assert.throws(
      () => mapNotionPageToContent(page),
      new RegExp(`page 11111111-2222-3333-4444-555555555555: public Page is missing title`),
    );
  });
}

test("optional author loading degrades without changing strict loader semantics", async () => {
  const failure = new Error("Authors unavailable");
  const strictLoader = async () => { throw failure; };
  const logs = [];

  await assert.rejects(strictLoader, failure);
  assert.deepEqual(
    await loadOptionalAuthors(strictLoader, (message, error) => logs.push({ message, error })),
    [],
  );
  assert.deepEqual(logs, [{
    message: "[notion/authors] Optional author enrichment unavailable:",
    error: failure,
  }]);
});
