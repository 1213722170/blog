import crypto from "node:crypto";
import { createServer } from "node:http";
import { access, mkdir, readFile, readdir, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";
import galleryStore from "../lib/gallery-store.cjs";

const PORT = Number(process.env.BLOG_WRITE_PORT || 4317);
const MAX_BODY_BYTES = 25 * 1024 * 1024;
const rootDir = process.cwd();
const postsDir = path.join(rootDir, "posts");
const postImagesDir = path.join(rootDir, "public", "images", "posts");
const allowedImageTypes = new Map([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
  ["image/gif", "gif"],
]);

function setCors(response) {
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function send(response, status, body, contentType = "text/plain; charset=utf-8") {
  setCors(response);
  response.statusCode = status;
  response.setHeader("Content-Type", contentType);
  response.end(body);
}

function sendJson(response, status, payload) {
  send(response, status, JSON.stringify(payload), "application/json; charset=utf-8");
}

function readJson(request) {
  return new Promise((resolve, reject) => {
    let body = "";
    let bytes = 0;

    request.on("data", (chunk) => {
      bytes += chunk.length;
      if (bytes > MAX_BODY_BYTES) {
        reject(new Error("Request body is too large."));
        request.destroy();
        return;
      }
      body += chunk;
    });

    request.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        reject(new Error("Invalid JSON."));
      }
    });

    request.on("error", reject);
  });
}

function sanitizeSlug(slug) {
  const normalized = String(slug || "").trim().toLowerCase();
  if (!/^[a-z0-9][a-z0-9-]{0,79}$/.test(normalized)) {
    throw new Error("Invalid slug. Use lowercase letters, numbers, and hyphens.");
  }
  return normalized;
}

function sanitizeBaseName(fileName) {
  const parsed = path.parse(String(fileName || "image"));
  const safeBase =
    parsed.name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "image";

  return safeBase;
}

function assertInside(parent, target) {
  const relative = path.relative(parent, target);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error("Invalid target path.");
  }
}

function yamlString(value) {
  return JSON.stringify(String(value || "").replace(/\r?\n/g, " ").trim());
}

function normalizeTags(tags) {
  if (!Array.isArray(tags)) return [];
  return tags
    .map((tag) => String(tag || "").trim())
    .filter(Boolean)
    .slice(0, 20);
}

function normalizeDate(value) {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value.toISOString().slice(0, 10);
  }

  const text = String(value || "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    return text;
  }

  const parsed = new Date(text);
  if (!Number.isNaN(parsed.getTime())) {
    return parsed.toISOString().slice(0, 10);
  }

  return new Date().toISOString().slice(0, 10);
}

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

function postPathForSlug(slug) {
  const targetPath = path.join(postsDir, `${sanitizeSlug(slug)}.md`);
  assertInside(postsDir, targetPath);
  return targetPath;
}

async function readPost(slug) {
  const normalizedSlug = sanitizeSlug(slug);
  const targetPath = postPathForSlug(normalizedSlug);
  const fileContents = await readFile(targetPath, "utf8");
  const { data, content } = matter(fileContents);

  return {
    slug: normalizedSlug,
    title: String(data.title || normalizedSlug),
    date: normalizeDate(data.date),
    description: String(data.description || ""),
    tags: normalizeTags(data.tags),
    content,
  };
}

async function handleListPosts(_request, response) {
  if (!(await fileExists(postsDir))) {
    sendJson(response, 200, { posts: [] });
    return;
  }

  const fileNames = await readdir(postsDir);
  const posts = await Promise.all(
    fileNames
      .filter((fileName) => fileName.endsWith(".md"))
      .map((fileName) => readPost(fileName.replace(/\.md$/, ""))),
  );

  posts.sort((a, b) => (a.date > b.date ? -1 : 1));
  sendJson(response, 200, {
    posts: posts.map(({ content: _content, ...post }) => post),
  });
}

async function handleGetPost(slug, response) {
  const post = await readPost(slug);
  sendJson(response, 200, post);
}

async function handleUploadImage(request, response) {
  const payload = await readJson(request);
  const slug = sanitizeSlug(payload.slug);
  const mimeType = String(payload.mimeType || "");
  const extension = allowedImageTypes.get(mimeType);

  if (!extension) {
    throw new Error("Only PNG, JPEG, WebP, and GIF images are supported.");
  }

  const dataUrl = String(payload.dataUrl || "");
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match || match[1] !== mimeType) {
    throw new Error("Invalid image data.");
  }

  const imageBuffer = Buffer.from(match[2], "base64");
  if (imageBuffer.length === 0) {
    throw new Error("Image is empty.");
  }

  const imageDir = path.join(postImagesDir, slug);
  assertInside(postImagesDir, imageDir);
  await mkdir(imageDir, { recursive: true });

  const safeBase = sanitizeBaseName(payload.fileName);
  const uniqueSuffix = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}`;
  const fileName = `${safeBase}-${uniqueSuffix}.${extension}`;
  const targetPath = path.join(imageDir, fileName);
  assertInside(imageDir, targetPath);

  await writeFile(targetPath, imageBuffer);

  sendJson(response, 200, {
    path: `/images/posts/${slug}/${fileName}`,
  });
}

async function handleSavePost(request, response) {
  const payload = await readJson(request);
  const title = String(payload.title || "").trim();
  const date = String(payload.date || "").trim();
  const description = String(payload.description || "").trim();
  const slug = sanitizeSlug(payload.slug);
  const tags = normalizeTags(payload.tags);
  const content = String(payload.content || "").trim();
  const overwrite = Boolean(payload.overwrite);

  if (!title) {
    throw new Error("Title is required.");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new Error("Date must be YYYY-MM-DD.");
  }

  await mkdir(postsDir, { recursive: true });

  const targetPath = postPathForSlug(slug);
  const exists = await fileExists(targetPath);
  if (exists && !overwrite) {
    send(response, 409, "Post already exists.");
    return;
  }

  // Keep collection order and other front matter when editing existing notes.
  const previousData = exists ? matter(await readFile(targetPath, "utf8")).data : {};
  const markdown = matter.stringify(`\n${content}\n`, {
    ...previousData, title, date, description, tags,
  });

  await writeFile(targetPath, markdown, "utf8");

  sendJson(response, 200, {
    path: `posts/${slug}.md`,
    overwritten: exists,
  });
}

async function handleDeletePost(request, response) {
  const origin = request.headers.origin;
  if (origin) {
    const source = new URL(origin);
    if (!["http:", "https:"].includes(source.protocol) || !["localhost", "127.0.0.1", "[::1]"].includes(source.hostname)) {
      send(response, 403, "文章删除仅支持本地管理。");
      return;
    }
  }
  const payload = await readJson(request);
  const slug = sanitizeSlug(payload.slug);
  const sourcePath = postPathForSlug(slug);
  const trashDir = path.resolve(rootDir, ".posts-trash");
  assertInside(rootDir, trashDir);
  const targetPath = path.join(trashDir, `${slug}-${crypto.randomUUID()}.md`);
  assertInside(trashDir, targetPath);
  await mkdir(trashDir, { recursive: true });
  try {
    await rename(sourcePath, targetPath);
  } catch (error) {
    if (error.code === "ENOENT") {
      send(response, 404, "文章不存在或已被删除。");
      return;
    }
    throw error;
  }
  sendJson(response, 200, { slug, recoveryPath: `.posts-trash/${path.basename(targetPath)}` });
}

async function route(request, response) {
  setCors(response);

  if (request.method === "OPTIONS") {
    response.statusCode = 204;
    response.end();
    return;
  }

  const url = new URL(request.url || "/", `http://${request.headers.host}`);
  const parts = url.pathname.split("/").filter(Boolean);

  try {
    if (request.method === "GET" && url.pathname === "/gallery") {
      sendJson(response, 200, { images: galleryStore.getGalleryImages(rootDir) });
      return;
    }

    if (request.method === "POST" && ["/upload-gallery", "/delete-gallery", "/restore-gallery"].includes(url.pathname)) {
      const origin = request.headers.origin;
      if (origin) {
        const source = new URL(origin);
        if (!["http:", "https:"].includes(source.protocol) || !["localhost", "127.0.0.1", "[::1]"].includes(source.hostname)) {
          send(response, 403, "图片修改仅支持本地管理。");
          return;
        }
      }
      const payload = await readJson(request);
      const result = url.pathname === "/delete-gallery"
        ? galleryStore.deleteGalleryImage(payload.fileName, rootDir)
        : url.pathname === "/restore-gallery"
          ? galleryStore.restoreGalleryImage(payload.undoId, rootDir)
          : { images: galleryStore.saveGalleryImage(payload, rootDir) };
      sendJson(response, 200, result);
      return;
    }

    if (request.method === "GET" && url.pathname === "/health") {
      sendJson(response, 200, { ok: true });
      return;
    }

    if (request.method === "GET" && url.pathname === "/posts") {
      await handleListPosts(request, response);
      return;
    }

    if (request.method === "GET" && parts[0] === "posts" && parts[1]) {
      await handleGetPost(decodeURIComponent(parts[1]), response);
      return;
    }

    if (request.method === "POST" && url.pathname === "/upload-image") {
      await handleUploadImage(request, response);
      return;
    }

    if (request.method === "POST" && url.pathname === "/save-post") {
      await handleSavePost(request, response);
      return;
    }

    if (request.method === "POST" && url.pathname === "/delete-post") {
      await handleDeletePost(request, response);
      return;
    }

    send(response, 404, "Not found.");
  } catch (error) {
    send(response, 400, error instanceof Error ? error.message : "Request failed.");
  }
}

createServer((request, response) => {
  void route(request, response);
}).listen(PORT, "127.0.0.1", () => {
  console.log(`Blog write server running at http://localhost:${PORT}`);
});
