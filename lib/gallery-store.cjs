const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const extensions = /\.(?:png|jpe?g|webp|gif|avif)$/i;
const mimeExtensions = new Map([
  ["image/png", ".png"], ["image/jpeg", ".jpg"], ["image/webp", ".webp"],
  ["image/gif", ".gif"], ["image/avif", ".avif"],
]);

function directory(root) {
  return path.join(root, "public", "images", "gallery");
}

function metadata(root) {
  const file = path.join(directory(root), "metadata.json");
  if (!fs.existsSync(file)) return {};
  const value = JSON.parse(fs.readFileSync(file, "utf8"));
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("图片信息文件必须是一个 JSON 对象。");
  }
  return value;
}

function writeMetadata(root, value) {
  const dir = directory(root);
  const temp = path.join(dir, "metadata.json.tmp");
  fs.writeFileSync(temp, JSON.stringify(value, null, 2) + "\n");
  fs.renameSync(temp, path.join(dir, "metadata.json"));
}

/** Check resolved paths before moving any file on Windows. */
function inside(parent, fileName) {
  const base = path.resolve(parent);
  const target = path.resolve(base, fileName);
  if (target === base || !target.startsWith(base + path.sep)) throw new Error("图片路径无效。");
  return target;
}

function imageName(value) {
  if (typeof value !== "string" || /[\\/\0]/.test(value) || !extensions.test(value)) {
    throw new Error("图片文件名无效。");
  }
  return value;
}

function getGalleryImages(root = process.cwd()) {
  const dir = directory(root);
  if (!fs.existsSync(dir)) return [];
  const details = metadata(root);
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && extensions.test(entry.name))
    .map(({ name }) => ({
      fileName: name,
      src: "/images/gallery/" + encodeURIComponent(name),
      title: typeof details[name]?.title === "string" ? details[name].title : path.parse(name).name,
      addedAt: typeof details[name]?.addedAt === "string" ? details[name].addedAt : "",
    }))
    .sort((a, b) => b.addedAt.localeCompare(a.addedAt) || a.fileName.localeCompare(b.fileName, "zh-CN", { numeric: true }));
}

function matchesImage(buffer, mime) {
  if (mime === "image/png") return buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  if (mime === "image/jpeg") return buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255;
  if (mime === "image/gif") return /^GIF8[79]a$/.test(buffer.toString("ascii", 0, 6));
  if (mime === "image/webp") return buffer.toString("ascii", 0, 4) === "RIFF" && buffer.toString("ascii", 8, 12) === "WEBP";
  if (mime === "image/avif") return buffer.toString("ascii", 4, 8) === "ftyp" && /avif|avis/.test(buffer.toString("ascii", 8, 40));
  return false;
}

function saveGalleryImage(payload, root = process.cwd()) {
  const mime = String(payload.mimeType || "");
  const extension = mimeExtensions.get(mime);
  if (!extension) throw new Error("请选择 PNG、JPG、WebP、GIF 或 AVIF 图片。");
  const match = String(payload.dataUrl || "").match(/^data:([^;]+);base64,([a-z\d+/=\r\n]+)$/i);
  if (!match || match[1] !== mime) throw new Error("图片数据无效。");
  const buffer = Buffer.from(match[2], "base64");
  if (!buffer.length || buffer.length > 10 * 1024 * 1024) throw new Error("每张图片请控制在 10 MB 以内。");
  if (!matchesImage(buffer, mime)) throw new Error("图片内容与文件类型不一致。");

  const dir = directory(root);
  fs.mkdirSync(dir, { recursive: true });
  const fileName = crypto.createHash("sha256").update(buffer).digest("hex").slice(0, 24) + extension;
  const target = path.join(dir, fileName);
  const details = metadata(root);
  if (!fs.existsSync(target)) fs.writeFileSync(target, buffer, { flag: "wx" });
  if (!Object.hasOwn(details, fileName)) {
    const original = String(payload.fileName || "未命名图片").split(/[\\/]/).pop();
    details[fileName] = {
      title: path.parse(original).name.trim().slice(0, 160) || "未命名图片",
      addedAt: new Date().toISOString(),
    };
    // Synchronous updates prevent concurrent local requests from losing metadata.
    writeMetadata(root, details);
  }
  return getGalleryImages(root);
}

function deleteGalleryImage(value, root = process.cwd()) {
  const name = imageName(value);
  const source = inside(directory(root), name);
  if (!fs.existsSync(source) || !fs.lstatSync(source).isFile()) throw new Error("这张图片已不存在，请刷新页面。");
  const details = metadata(root);
  const undoId = crypto.randomUUID();
  const trash = inside(path.join(root, ".gallery-trash"), undoId);
  const target = inside(trash, name);
  const record = { fileName: name, details: details[name] || null };
  fs.mkdirSync(trash, { recursive: true });
  fs.writeFileSync(path.join(trash, "record.json"), JSON.stringify(record));
  fs.renameSync(source, target);
  delete details[name];
  try {
    writeMetadata(root, details);
  } catch (error) {
    // Keep the image visible if its metadata cannot be updated.
    fs.renameSync(target, source);
    throw error;
  }
  return { images: getGalleryImages(root), undoId };
}

function restoreGalleryImage(undoId, root = process.cwd()) {
  if (typeof undoId !== "string" || !/^[a-f\d]{8}(?:-[a-f\d]{4}){3}-[a-f\d]{12}$/i.test(undoId)) {
    throw new Error("撤销记录无效。");
  }
  const trash = inside(path.join(root, ".gallery-trash"), undoId);
  const recordFile = path.join(trash, "record.json");
  if (!fs.existsSync(recordFile)) throw new Error("找不到这次删除的记录。");
  const record = JSON.parse(fs.readFileSync(recordFile, "utf8"));
  const name = imageName(record.fileName);
  const source = inside(trash, name);
  const target = inside(directory(root), name);
  if (!fs.existsSync(source)) throw new Error("这张图片已恢复。");
  if (fs.existsSync(target)) throw new Error("图片集中已有同名图片，已保留两份文件，请勿重复恢复。");
  const details = metadata(root);
  if (record.details) details[name] = record.details;
  fs.mkdirSync(directory(root), { recursive: true });
  fs.renameSync(source, target);
  try {
    writeMetadata(root, details);
  } catch (error) {
    fs.renameSync(target, source);
    throw error;
  }
  fs.unlinkSync(recordFile);
  fs.rmdirSync(trash);
  return { images: getGalleryImages(root) };
}

module.exports = { getGalleryImages, saveGalleryImage, deleteGalleryImage, restoreGalleryImage };
