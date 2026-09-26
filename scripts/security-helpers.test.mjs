import test from "node:test";
import assert from "node:assert/strict";
import { pathToFileURL } from "node:url";
import { join } from "node:path";

const root = process.cwd();
const { safeLinkHref, safeResourceUrl, safeSameOriginPath, youtubeEmbedUrl } = await import(
  pathToFileURL(join(root, "src/lib/security/url.ts")).href
);
const { resolvePublicUrl } = await import(
  pathToFileURL(join(root, "src/lib/security/serverFetch.ts")).href
);

const siteUrl = "https://blog.gyuminlab.co.kr";

test("safeSameOriginPath accepts internal and same-origin URLs", () => {
  assert.equal(safeSameOriginPath("/post?a=1#top", siteUrl), "/post?a=1#top");
  assert.equal(safeSameOriginPath(`${siteUrl}/post?a=1#top`, siteUrl), "/post?a=1#top");
});

test("safeSameOriginPath rejects protocol-relative and cross-origin URLs", () => {
  assert.equal(safeSameOriginPath("//evil.example/a", siteUrl), null);
  assert.equal(safeSameOriginPath("https://evil.example/a", siteUrl), null);
});

test("safeLinkHref rejects scriptable protocols", () => {
  assert.equal(safeLinkHref("javascript:alert(1)"), null);
  assert.equal(safeLinkHref("data:text/html,hello"), null);
  assert.equal(safeLinkHref("https://example.com/a"), "https://example.com/a");
});

test("safeResourceUrl only accepts http resources or same-origin paths", () => {
  assert.equal(safeResourceUrl("/file.pdf", siteUrl), "/file.pdf");
  assert.equal(safeResourceUrl("https://example.com/file.pdf", siteUrl), "https://example.com/file.pdf");
  assert.equal(safeResourceUrl("mailto:test@example.com", siteUrl), null);
});

test("youtubeEmbedUrl normalizes supported YouTube URLs", () => {
  assert.equal(
    youtubeEmbedUrl("https://youtu.be/dQw4w9WgXcQ"),
    "https://www.youtube.com/embed/dQw4w9WgXcQ"
  );
  assert.equal(youtubeEmbedUrl("https://example.com/watch?v=dQw4w9WgXcQ"), null);
});

test("resolvePublicUrl blocks local and private targets before fetch", async () => {
  assert.equal(await resolvePublicUrl("http://localhost:3000"), null);
  assert.equal(await resolvePublicUrl("http://127.0.0.1"), null);
  assert.equal(await resolvePublicUrl("http://169.254.169.254/latest/meta-data"), null);
  assert.equal(await resolvePublicUrl("file:///etc/passwd"), null);
});

const { renderEquationHtml } = await import(
  pathToFileURL(join(root, "src/lib/security/equation.ts")).href
);

test("equations render normal math and escape HTML when malformed nesting exhausts the parser", () => {
  assert.match(renderEquationHtml("x^2", false), /class="katex"/);
  const expression = "{".repeat(10000) + '<img src=x onerror="window.__audit=1">' + "}".repeat(10000);
  const html = renderEquationHtml(expression, true);
  assert.ok(!html.includes("<img"));
  assert.ok(html.includes("&lt;img"));
  assert.ok(html.includes("&quot;"));
});
