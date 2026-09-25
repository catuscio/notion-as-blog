import test from "node:test";
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { join } from "node:path";

const root = process.cwd();
const {
  getListedPostsByDate,
  isDetailAccessible,
  isListed,
  selectDetailAccessiblePages,
  selectDetailAccessiblePosts,
  selectListedPages,
} = await import(
  pathToFileURL(join(root, "src/lib/notion/contentQueries.ts")).href
);
const { createSingleFlight } = await import(
  pathToFileURL(join(root, "src/lib/singleFlight.ts")).href
);
const { getContentRobots } = await import(
  pathToFileURL(join(root, "src/lib/contentMetadata.ts")).href
);

function content(status, type = "Post", overrides = {}) {
  return {
    id: `${type}-${status}`,
    title: `${type} ${status}`,
    slug: `${type.toLowerCase()}-${status.toLowerCase()}`,
    status,
    type,
    date: "2026-01-01",
    lastEditedTime: "2026-01-01T00:00:00.000Z",
    tags: [],
    category: null,
    series: null,
    author: "",
    authorIds: [],
    summary: "",
    thumbnail: "",
    fullWidth: false,
    pinned: false,
    ...overrides,
  };
}

const visibilityCases = [
  ["Public", true, true],
  ["PublicOnDetail", false, true],
  ["Draft", false, false],
  ["Private", false, false],
];

for (const type of ["Post", "Page"]) {
  for (const [status, listed, detailAccessible] of visibilityCases) {
    test(`${type} ${status} has the expected visibility`, () => {
      const item = content(status, type);
      assert.equal(isListed(item), listed);
      assert.equal(isDetailAccessible(item), detailAccessible);
    });
  }
}

test("listed post selection excludes unlisted posts and all Page content", () => {
  const posts = [
    content("PublicOnDetail", "Post", { date: "2026-03-01" }),
    content("Public", "Page", { date: "2026-04-01" }),
    content("Public", "Post", { id: "older", date: "2026-01-01" }),
    content("Public", "Post", { id: "newer", date: "2026-02-01" }),
  ];

  assert.deepEqual(
    getListedPostsByDate(posts).map((post) => post.id),
    ["newer", "older"],
  );
});

test("detail and page selectors enforce status and content type together", () => {
  const items = [
    content("Public", "Post"),
    content("PublicOnDetail", "Post"),
    content("Draft", "Post"),
    content("Private", "Post"),
    content("Public", "Page"),
    content("PublicOnDetail", "Page"),
    content("Draft", "Page"),
    content("Private", "Page"),
  ];

  assert.deepEqual(
    selectDetailAccessiblePosts(items).map((item) => item.status),
    ["Public", "PublicOnDetail"],
  );
  assert.deepEqual(
    selectListedPages(items).map((item) => item.status),
    ["Public"],
  );
  assert.deepEqual(
    selectDetailAccessiblePages(items).map((item) => item.status),
    ["Public", "PublicOnDetail"],
  );
});

test("only a public About page is eligible for navigation", () => {
  const aboutPages = visibilityCases.map(([status]) =>
    content(status, "Page", { slug: "about" })
  );

  assert.deepEqual(
    selectListedPages(aboutPages).map((item) => item.status),
    ["Public"],
  );
});

test("unlisted content receives consistent noindex directives", () => {
  assert.equal(getContentRobots("Public"), undefined);
  assert.equal(getContentRobots("Draft"), undefined);
  assert.equal(getContentRobots("Private"), undefined);
  assert.deepEqual(getContentRobots("PublicOnDetail"), {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  });
});

test("single-flight coalesces concurrent cold loads and resets afterward", async () => {
  let calls = 0;
  let release;
  const gate = new Promise((resolve) => {
    release = resolve;
  });
  const load = createSingleFlight(async () => {
    calls += 1;
    await gate;
    return calls;
  });

  const first = load();
  const second = load();
  assert.equal(first, second);
  assert.equal(calls, 1);

  release();
  assert.deepEqual(await Promise.all([first, second]), [1, 1]);
  assert.equal(await load(), 2);
});

test("single-flight resets after a failed load", async () => {
  let calls = 0;
  const load = createSingleFlight(async () => {
    calls += 1;
    if (calls === 1) throw new Error("expected failure");
    return calls;
  });

  await assert.rejects(load(), /expected failure/);
  assert.equal(await load(), 2);
});
