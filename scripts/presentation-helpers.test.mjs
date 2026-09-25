import assert from "node:assert/strict";
import test from "node:test";

import { getPaginationItems } from "../src/lib/pagination.ts";
import { createListingMetadata } from "../src/lib/listingMetadata.ts";
import { brand } from "../src/config/brand.ts";
import { toSearchResult } from "../src/lib/searchContract.ts";
import { searchPosts } from "../src/lib/searchPosts.ts";

test("pagination shows every page for short ranges", () => {
  assert.deepEqual(getPaginationItems(3, 5), [1, 2, 3, 4, 5]);
});

test("pagination keeps adjacent pages and collapses distant ranges", () => {
  assert.deepEqual(getPaginationItems(1, 10), [1, 2, "ellipsis", 10]);
  assert.deepEqual(getPaginationItems(5, 10), [1, "ellipsis", 4, 5, 6, "ellipsis", 10]);
  assert.deepEqual(getPaginationItems(10, 10), [1, "ellipsis", 9, 10]);
});

test("listing metadata shares canonical and social fields without changing page title", () => {
  const metadata = createListingMetadata({
    title: "Development",
    socialTitle: `Development — ${brand.name}`,
    description: "Development posts",
    url: `${brand.url}/category/development`,
    robots: { index: false, follow: true },
  });

  assert.equal(metadata.title, "Development");
  assert.equal(metadata.alternates.canonical, `${brand.url}/category/development`);
  assert.equal(metadata.openGraph.title, `Development — ${brand.name}`);
  assert.equal(metadata.twitter.title, `Development — ${brand.name}`);
  assert.deepEqual(metadata.robots, { index: false, follow: true });
});

test("search responses expose only the public dropdown contract", () => {
  const result = toSearchResult({
    id: "private-notion-id",
    slug: "hello",
    title: "Hello",
    summary: "Summary",
    thumbnail: "",
    category: "Development",
    tags: ["TypeScript"],
    status: "Public",
    type: "Post",
    date: "2026-01-01",
    lastEditedTime: "2026-01-02",
    series: null,
    author: "Ada",
    authorIds: ["private-person-id"],
    fullWidth: false,
    pinned: false,
  });

  assert.deepEqual(result, {
    slug: "hello",
    title: "Hello",
    summary: "Summary",
    thumbnail: "",
    category: "Development",
    tags: ["TypeScript"],
  });
  assert.equal("id" in result, false);
  assert.equal("authorIds" in result, false);
});

test("search normalizes full-width text and matches words across fields", () => {
  const posts = [
    { title: "ＮｅｘｔＪＳ", summary: "", category: "Development", series: "Guide", author: "Ada", slug: "nextjs-guide", tags: [] },
    { title: "Other", summary: "", category: "Design", series: null, author: "Bea", slug: "other", tags: [] },
  ];

  assert.deepEqual(searchPosts(posts, "  nextjs   GUIDE "), [posts[0]]);
  assert.deepEqual(searchPosts(posts, "   "), posts);
});
