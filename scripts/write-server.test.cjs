const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const os = require("node:os");
const path = require("node:path");
const net = require("node:net");
const { spawn } = require("node:child_process");
const { once } = require("node:events");

test("article deletion preserves a recovery copy and rejects unsafe or missing targets", { timeout: 15000 }, async (t) => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "blog-write-test-"));
  let child;
  t.after(async () => {
    if (child && child.exitCode === null) {
      const exited = once(child, "exit");
      child.kill();
      await exited;
    }
    assert.equal(path.dirname(path.resolve(root)), path.resolve(os.tmpdir()));
    assert.ok(path.basename(root).startsWith("blog-write-test-"));
    await fs.rm(root, { recursive: true, force: true });
  });
  const reservation = net.createServer();
  reservation.listen(0, "127.0.0.1");
  await once(reservation, "listening");
  const port = reservation.address().port;
  await new Promise((resolve) => reservation.close(resolve));
  child = spawn(process.execPath, [path.join(__dirname, "write-server.mjs")], {
    cwd: root, env: { ...process.env, BLOG_WRITE_PORT: String(port) }, windowsHide: true,
  });
  await Promise.race([
    once(child.stdout, "data"),
    once(child, "exit").then(() => { throw new Error("Write server exited before startup"); }),
    once(child, "error").then(([error]) => { throw error; }),
  ]);
  const request = (route, body, origin = "http://localhost:3000") => fetch(`http://127.0.0.1:${port}${route}`, {
    method: "POST", headers: { "Content-Type": "application/json", Origin: origin }, body: JSON.stringify(body),
  });
  const post = { slug: "delete-test", title: "删除测试", date: "2026-11-05", content: "保留原文", tags: [] };
  assert.equal((await request("/save-post", post)).status, 200);
  const original = await fs.readFile(path.join(root, "posts/delete-test.md"), "utf8");
  assert.equal((await request("/delete-post", { slug: post.slug }, "https://example.com")).status, 403);
  assert.equal((await request("/delete-post", { slug: "../outside" })).status, 400);
  assert.equal(await fs.readFile(path.join(root, "posts/delete-test.md"), "utf8"), original);
  const removed = await request("/delete-post", { slug: post.slug });
  assert.equal(removed.status, 200);
  const result = await removed.json();
  assert.match(result.recoveryPath, /^\.posts-trash\/delete-test-[a-f0-9-]+\.md$/);
  assert.equal(await fs.readFile(path.join(root, result.recoveryPath), "utf8"), original);
  await assert.rejects(fs.access(path.join(root, "posts/delete-test.md")));
  assert.deepEqual(await (await fetch(`http://127.0.0.1:${port}/posts`)).json(), { posts: [] });
  assert.equal((await request("/delete-post", { slug: post.slug })).status, 404);
});
