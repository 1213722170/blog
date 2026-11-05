const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { getGalleryImages, saveGalleryImage, deleteGalleryImage, restoreGalleryImage } = require("../lib/gallery-store.cjs");

const png = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=";
const payload = { mimeType: "image/png", dataUrl: "data:image/png;base64," + png, fileName: "喜欢的画面.png" };

function workspace(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "blog-gallery-test-"));
  t.after(() => {
    assert.equal(path.dirname(path.resolve(root)), path.resolve(os.tmpdir()));
    assert.ok(path.basename(root).startsWith("blog-gallery-test-"));
    fs.rmSync(root, { recursive: true, force: true });
  });
  return root;
}

test("gallery persists uploaded images and titles; duplicate uploads stay unique", (t) => {
  const root = workspace(t);
  assert.deepEqual(getGalleryImages(root), []);
  const first = saveGalleryImage(payload, root);
  assert.equal(first.length, 1);
  assert.equal(first[0].title, "喜欢的画面");
  assert.ok(fs.existsSync(path.join(root, "public/images/gallery", first[0].fileName)));
  assert.deepEqual(getGalleryImages(root), first);
  assert.equal(saveGalleryImage(payload, root).length, 1);
});

test("gallery also discovers copied images and encodes filenames in URLs", (t) => {
  const root = workspace(t);
  const dir = path.join(root, "public/images/gallery");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "我的风景 2.PNG"), Buffer.from(png, "base64"));
  fs.writeFileSync(path.join(dir, "README.md"), "ignored");
  const images = getGalleryImages(root);
  assert.equal(images.length, 1);
  assert.equal(images[0].title, "我的风景 2");
  assert.equal(images[0].src, "/images/gallery/" + encodeURIComponent("我的风景 2.PNG"));
});

test("gallery rejects non-image data and limits writes to its image directory", (t) => {
  const root = workspace(t);
  assert.throws(() => saveGalleryImage({ ...payload, mimeType: "image/svg+xml" }, root));
  assert.throws(() => saveGalleryImage({ ...payload, dataUrl: "data:image/png;base64," + Buffer.from("not an image").toString("base64") }, root));
  const images = saveGalleryImage({ ...payload, fileName: "../../escape.png" }, root);
  assert.equal(images[0].title, "escape");
  assert.match(images[0].fileName, /^[a-f0-9]{24}\.png$/);
  assert.equal(fs.existsSync(path.join(root, "escape.png")), false);
});

test("removing a picture hides it and its public metadata; undo restores the original", (t) => {
  const root = workspace(t);
  const original = saveGalleryImage(payload, root);
  const removed = deleteGalleryImage(original[0].fileName, root);
  assert.deepEqual(removed.images, []);
  assert.deepEqual(getGalleryImages(root), []);
  const metadataFile = path.join(root, "public/images/gallery/metadata.json");
  assert.deepEqual(JSON.parse(fs.readFileSync(metadataFile, "utf8")), {});
  const recoveryFile = path.join(root, ".gallery-trash", removed.undoId, original[0].fileName);
  assert.deepEqual(fs.readFileSync(recoveryFile), Buffer.from(png, "base64"));
  assert.deepEqual(restoreGalleryImage(removed.undoId, root).images, original);
  assert.equal(fs.existsSync(path.dirname(recoveryFile)), false);
});

test("pictures copied into the folder can also be removed and restored", (t) => {
  const root = workspace(t);
  const dir = path.join(root, "public/images/gallery");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "我的收藏.png"), Buffer.from(png, "base64"));
  const removed = deleteGalleryImage("我的收藏.png", root);
  assert.equal(removed.images.length, 0);
  assert.equal(restoreGalleryImage(removed.undoId, root).images[0].title, "我的收藏");
});

test("removal and undo reject traversal and never replace a newer image", (t) => {
  const root = workspace(t);
  const original = saveGalleryImage(payload, root);
  assert.throws(() => deleteGalleryImage("../outside.png", root));
  assert.throws(() => deleteGalleryImage("..\\outside.png", root));
  assert.throws(() => restoreGalleryImage("../../outside", root));
  assert.throws(() => deleteGalleryImage("missing.png", root));
  const removed = deleteGalleryImage(original[0].fileName, root);
  const target = path.join(root, "public/images/gallery", original[0].fileName);
  fs.writeFileSync(target, "a newer file");
  assert.throws(() => restoreGalleryImage(removed.undoId, root), /同名图片/);
  assert.equal(fs.readFileSync(target, "utf8"), "a newer file");
  assert.ok(fs.existsSync(path.join(root, ".gallery-trash", removed.undoId, original[0].fileName)));
});
