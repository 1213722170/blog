const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const ts = require("typescript");

// Exercise the same TypeScript modules used by Next without adding a test runtime.
require.extensions[".ts"] = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true },
  });
  module._compile(outputText, filename);
};
const { normalizeDate, getAssetPath } = require("../lib/utils.ts");
const { getAllPosts, getDeepLearningPosts, getPostBySlug } = require("../lib/posts.ts");

test("legacy dates normalize consistently; invalid or missing dates fail", () => {
  assert.equal(normalizeDate("2026-2-8"), "2026-02-08");
  assert.equal(normalizeDate("2024-2-29"), "2024-02-29");
  assert.equal(normalizeDate(new Date("2026-02-08T00:00:00Z")), "2026-02-08");
  for (const value of ["2026-02-29", "2026-13-01", "2026-04-31", "", undefined]) assert.throws(() => normalizeDate(value));
});
test("all published posts have stable dates and sort by actual time", () => {
  const posts = getAllPosts();
  assert.ok(posts.length > 0);
  for (let i = 0; i < posts.length; i++) {
    assert.match(posts[i].date, /^\d{4}-\d{2}-\d{2}$/);
    if (i) assert.ok(Date.parse(posts[i - 1].date) >= Date.parse(posts[i].date));
    assert.equal(getPostBySlug(posts[i].slug).slug, posts[i].slug);
  }
  assert.ok(posts.findIndex((p) => p.slug === "prompt") < posts.findIndex((p) => p.slug === "reinforcelearning1"));
  assert.equal(getPostBySlug("../../package"), null);
  assert.equal(getPostBySlug("not-a-real-post"), null);
});
test("deep learning follows explicit course order and preserves old slugs", () => {
  const posts = getDeepLearningPosts();
  assert.deepEqual(posts.map((p) => p.slug), ["deeplearning1", "deeplearning2", "deeplearning3", "deeplearningweek2", "deeplearning4", "deeplearning5", "deeplearning6", "deeplearning7", "deeplearning8", "deeplearning9"]);
  assert.equal(new Set(posts.map((p) => p.seriesOrder)).size, posts.length);
});
test("asset URLs use the same explicit base on the server and browser", () => {
  const previous = process.env.NEXT_PUBLIC_BASE_PATH;
  try {
    for (const base of ["", "/blog"]) {
      process.env.NEXT_PUBLIC_BASE_PATH = base;
      assert.equal(getAssetPath("/images/test.png"), base + "/images/test.png");
      assert.equal(getAssetPath("music/test.mp3"), base + "/music/test.mp3");
      assert.equal(getAssetPath("https://example.com/a.png"), "https://example.com/a.png");
      assert.equal(getAssetPath("//example.com/a.png"), "//example.com/a.png");
      if (base) assert.equal(getAssetPath("/blog/images/test.png"), "/blog/images/test.png");
    }
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_BASE_PATH;
    else process.env.NEXT_PUBLIC_BASE_PATH = previous;
  }
});
test("Next static export supports both root and GitHub Pages builds", () => {
  const previous = process.env.NEXT_PUBLIC_BASE_PATH;
  try {
    for (const [input, expected] of [["", ""], ["/blog/", "/blog"]]) {
      process.env.NEXT_PUBLIC_BASE_PATH = input;
      delete require.cache[require.resolve("../next.config.js")];
      const config = require("../next.config.js");
      assert.equal(config.basePath, expected);
      assert.equal(config.env.NEXT_PUBLIC_BASE_PATH, expected);
      assert.equal(config.output, "export");
      assert.equal(config.trailingSlash, true);
    }
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_BASE_PATH;
    else process.env.NEXT_PUBLIC_BASE_PATH = previous;
  }
});

test("development and production never share generated chunks", () => {
  const previous = process.env.NODE_ENV;
  try {
    process.env.NODE_ENV = "development";
    delete require.cache[require.resolve("../next.config.js")];
    const dev = require("../next.config.js");
    process.env.NODE_ENV = "production";
    delete require.cache[require.resolve("../next.config.js")];
    const prod = require("../next.config.js");
    assert.equal(dev.distDir, ".next-dev");
    assert.equal(prod.distDir, ".next");
    assert.notEqual(dev.distDir, prod.distDir);
  } finally {
    if (previous === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = previous;
  }
});
