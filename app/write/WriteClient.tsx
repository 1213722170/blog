"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";

const WRITE_SERVER_URL =
  process.env.NEXT_PUBLIC_BLOG_WRITE_SERVER || "http://localhost:4317";

type PreviewMode = "preview" | "markdown" | "document";

interface SavePayload {
  title: string;
  slug: string;
  date: string;
  description: string;
  tags: string[];
  content: string;
  overwrite?: boolean;
}

interface UploadResponse {
  path: string;
}

interface ExistingPostSummary {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
}

interface ExistingPost extends ExistingPostSummary {
  content: string;
}

function getTodayIso() {
  const now = new Date();
  now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
  return now.toISOString().slice(0, 10);
}

function fallbackSlug() {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, "");
  const time = now.toTimeString().slice(0, 8).replace(/:/g, "");
  return `post-${date}-${time}`;
}

function slugify(value: string) {
  const slug = value
    .trim()
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

  return slug || fallbackSlug();
}

function parseTags(value: string) {
  return value
    .split(/[,，]/)
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function yamlString(value: string) {
  return JSON.stringify(value.replace(/\r?\n/g, " ").trim());
}

function buildMarkdownDocument(payload: SavePayload) {
  const tags = JSON.stringify(payload.tags);
  const content = payload.content.trim();

  return `---\ntitle: ${yamlString(payload.title)}\ndate: ${yamlString(
    payload.date,
  )}\ndescription: ${yamlString(payload.description)}\ntags: ${tags}\n---\n\n${content}\n`;
}

function textContent(node: Node) {
  return node.textContent?.replace(/\u00a0/g, " ") || "";
}

function childrenToMarkdown(node: Node): string {
  return Array.from(node.childNodes).map(nodeToMarkdown).join("");
}

function listToMarkdown(node: HTMLElement, ordered: boolean) {
  const items = Array.from(node.children).filter(
    (child) => child.tagName.toLowerCase() === "li",
  );

  return `${items
    .map((item, index) => {
      const marker = ordered ? `${index + 1}.` : "-";
      return `${marker} ${childrenToMarkdown(item).trim()}`;
    })
    .join("\n")}\n\n`;
}

function nodeToMarkdown(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return textContent(node);
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return "";
  }

  const element = node as HTMLElement;
  const tag = element.tagName.toLowerCase();
  const content = childrenToMarkdown(element);
  const trimmed = content.trim();

  switch (tag) {
    case "h1":
      return `# ${trimmed}\n\n`;
    case "h2":
      return `## ${trimmed}\n\n`;
    case "h3":
      return `### ${trimmed}\n\n`;
    case "h4":
      return `#### ${trimmed}\n\n`;
    case "h5":
      return `##### ${trimmed}\n\n`;
    case "h6":
      return `###### ${trimmed}\n\n`;
    case "p":
    case "div":
      return trimmed ? `${trimmed}\n\n` : "\n";
    case "br":
      return "\n";
    case "strong":
    case "b":
      return trimmed ? `**${trimmed}**` : "";
    case "em":
    case "i":
      return trimmed ? `*${trimmed}*` : "";
    case "code":
      return trimmed ? `\`${trimmed.replace(/`/g, "\\`")}\`` : "";
    case "pre": {
      const language = element.getAttribute("data-code-lang") || "";
      return `\`\`\`${language}\n${textContent(element).trim()}\n\`\`\`\n\n`;
    }
    case "blockquote":
      return `${trimmed
        .split("\n")
        .map((line) => `> ${line}`)
        .join("\n")}\n\n`;
    case "ul":
      return listToMarkdown(element, false);
    case "ol":
      return listToMarkdown(element, true);
    case "li":
      return `${trimmed}\n`;
    case "a": {
      const href = element.getAttribute("href") || "";
      return href ? `[${trimmed || href}](${href})` : trimmed;
    }
    case "img": {
      const src = element.getAttribute("src") || "";
      const alt = element.getAttribute("alt") || "";
      return src ? `![${alt}](${src})` : "";
    }
    case "figure":
      return `${trimmed}\n\n`;
    default:
      return content;
  }
}

function htmlToMarkdown(html: string) {
  const doc = new DOMParser().parseFromString(`<main>${html}</main>`, "text/html");
  const root = doc.querySelector("main");

  if (!root) return "";

  return Array.from(root.childNodes)
    .map(nodeToMarkdown)
    .join("")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttribute(value: string) {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

function inlineMarkdownToHtml(value: string) {
  return escapeHtml(value)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, src) => {
      return `<img src="${escapeAttribute(src)}" alt="${escapeAttribute(alt)}" />`;
    })
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, href) => {
      return `<a href="${escapeAttribute(href)}">${label}</a>`;
    })
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
}

function flushParagraph(paragraph: string[], output: string[]) {
  if (paragraph.length === 0) return;
  output.push(`<p>${inlineMarkdownToHtml(paragraph.join(" "))}</p>`);
  paragraph.length = 0;
}

function flushList(
  list: { type: "ul" | "ol"; items: string[] } | null,
  output: string[],
) {
  if (!list) return null;

  const items = list.items
    .map((item) => `<li>${inlineMarkdownToHtml(item)}</li>`)
    .join("");
  output.push(`<${list.type}>${items}</${list.type}>`);

  return null;
}

function markdownToEditorHtml(markdown: string) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");
  const output: string[] = [];
  const paragraph: string[] = [];
  let list: { type: "ul" | "ol"; items: string[] } | null = null;
  let codeLanguage = "";
  let codeLines: string[] | null = null;

  for (const line of lines) {
    const fenceMatch = line.match(/^```(\S*)\s*$/);
    if (fenceMatch) {
      if (codeLines) {
        output.push(
          `<pre data-code-lang="${escapeAttribute(codeLanguage)}"><code>${escapeHtml(
            codeLines.join("\n"),
          )}</code></pre>`,
        );
        codeLines = null;
        codeLanguage = "";
      } else {
        flushParagraph(paragraph, output);
        list = flushList(list, output);
        codeLanguage = fenceMatch[1] || "";
        codeLines = [];
      }
      continue;
    }

    if (codeLines) {
      codeLines.push(line);
      continue;
    }

    if (!line.trim()) {
      flushParagraph(paragraph, output);
      list = flushList(list, output);
      continue;
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      flushParagraph(paragraph, output);
      list = flushList(list, output);
      output.push(
        `<h${headingMatch[1].length}>${inlineMarkdownToHtml(
          headingMatch[2],
        )}</h${headingMatch[1].length}>`,
      );
      continue;
    }

    const imageMatch = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
    if (imageMatch) {
      flushParagraph(paragraph, output);
      list = flushList(list, output);
      output.push(
        `<p><img src="${escapeAttribute(imageMatch[2])}" alt="${escapeAttribute(
          imageMatch[1],
        )}" /></p>`,
      );
      continue;
    }

    const unorderedMatch = line.match(/^\s*[-*+]\s+(.+)$/);
    if (unorderedMatch) {
      flushParagraph(paragraph, output);
      if (!list || list.type !== "ul") {
        list = flushList(list, output);
        list = { type: "ul", items: [] };
      }
      list.items.push(unorderedMatch[1]);
      continue;
    }

    const orderedMatch = line.match(/^\s*\d+\.\s+(.+)$/);
    if (orderedMatch) {
      flushParagraph(paragraph, output);
      if (!list || list.type !== "ol") {
        list = flushList(list, output);
        list = { type: "ol", items: [] };
      }
      list.items.push(orderedMatch[1]);
      continue;
    }

    const quoteMatch = line.match(/^\s*>\s?(.*)$/);
    if (quoteMatch) {
      flushParagraph(paragraph, output);
      list = flushList(list, output);
      output.push(`<blockquote>${inlineMarkdownToHtml(quoteMatch[1])}</blockquote>`);
      continue;
    }

    list = flushList(list, output);
    paragraph.push(line);
  }

  if (codeLines) {
    output.push(
      `<pre data-code-lang="${escapeAttribute(codeLanguage)}"><code>${escapeHtml(
        codeLines.join("\n"),
      )}</code></pre>`,
    );
  }
  flushParagraph(paragraph, output);
  flushList(list, output);

  return output.join("") || "<p><br></p>";
}

function fileToDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function isValidSlug(value: string) {
  return /^[a-z0-9][a-z0-9-]{0,79}$/.test(value);
}

export function WriteClient() {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const savedRangeRef = useRef<Range | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState(() => fallbackSlug());
  const [slugTouched, setSlugTouched] = useState(false);
  const [date, setDate] = useState(() => getTodayIso());
  const [description, setDescription] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("preview");
  const [status, setStatus] = useState("");
  const [isLocalSession, setIsLocalSession] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [existingPosts, setExistingPosts] = useState<ExistingPostSummary[]>([]);
  const [selectedPostSlug, setSelectedPostSlug] = useState("");
  const [loadedSlug, setLoadedSlug] = useState("");
  const [isLoadingPosts, setIsLoadingPosts] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(false);

  const tags = useMemo(() => parseTags(tagsInput), [tagsInput]);

  const markdownDocument = useMemo(
    () =>
      buildMarkdownDocument({
        title: title || "未命名文章",
        slug,
        date,
        description,
        tags,
        content: markdown,
      }),
    [date, description, markdown, slug, tags, title],
  );

  useEffect(() => {
    const hostname = window.location.hostname;
    const local =
      hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1";
    setIsLocalSession(local);

    if (local) {
      void loadPostList();
    }
  }, []);

  function setEditorFromMarkdown(value: string) {
    if (!editorRef.current) return;
    editorRef.current.innerHTML = markdownToEditorHtml(value);
    savedRangeRef.current = null;
  }

  function updateMarkdownFromEditor() {
    if (!editorRef.current) return;
    setMarkdown(htmlToMarkdown(editorRef.current.innerHTML));
  }

  function rememberSelection() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    if (editorRef.current?.contains(range.commonAncestorContainer)) {
      savedRangeRef.current = range;
    }
  }

  function restoreSelection() {
    const selection = window.getSelection();
    const range = savedRangeRef.current;

    if (!selection || !range) return;

    selection.removeAllRanges();
    selection.addRange(range);
  }

  function focusEditor() {
    editorRef.current?.focus();
    restoreSelection();
  }

  function runCommand(command: string, value?: string) {
    focusEditor();
    document.execCommand(command, false, value);
    requestAnimationFrame(updateMarkdownFromEditor);
  }

  function formatBlock(tag: string) {
    runCommand("formatBlock", tag);
  }

  function createLink() {
    const url = window.prompt("链接地址");
    if (!url) return;
    runCommand("createLink", url);
  }

  function insertHtml(html: string) {
    focusEditor();
    document.execCommand("insertHTML", false, html);
    rememberSelection();
    requestAnimationFrame(updateMarkdownFromEditor);
  }

  async function loadPostList() {
    setIsLoadingPosts(true);

    try {
      const response = await fetch(`${WRITE_SERVER_URL}/posts`, {
        cache: "no-store",
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "读取文章列表失败");
      }

      const result = (await response.json()) as { posts: ExistingPostSummary[] };
      const posts = result.posts || [];
      setExistingPosts(posts);
      setSelectedPostSlug((current) => posts.some((post) => post.slug === current) ? current : posts[0]?.slug || "");
    } catch (error) {
      setStatus(
        error instanceof Error
          ? `${error.message}。确认已运行 npm.cmd run write-server。`
          : "读取文章列表失败。",
      );
    } finally {
      setIsLoadingPosts(false);
    }
  }

  async function loadExistingPost(targetSlug: string) {
    if (!targetSlug) return;

    setIsLoadingPost(true);
    setStatus("正在打开文章...");

    try {
      const response = await fetch(
        `${WRITE_SERVER_URL}/posts/${encodeURIComponent(targetSlug)}`,
        { cache: "no-store" },
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "打开文章失败");
      }

      const post = (await response.json()) as ExistingPost;
      setTitle(post.title || post.slug);
      setSlug(post.slug);
      setSlugTouched(true);
      setDate(post.date || getTodayIso());
      setDescription(post.description || "");
      setTagsInput((post.tags || []).join(", "));
      setMarkdown(post.content || "");
      setEditorFromMarkdown(post.content || "");
      setLoadedSlug(post.slug);
      setPreviewMode("preview");
      setStatus(`正在编辑：posts/${post.slug}.md`);
    } catch (error) {
      setStatus(
        error instanceof Error
          ? `${error.message}。确认已运行 npm.cmd run write-server。`
          : "打开文章失败。",
      );
    } finally {
      setIsLoadingPost(false);
    }
  }

  function createNewPost() {
    const nextSlug = fallbackSlug();
    setTitle("");
    setSlug(nextSlug);
    setSlugTouched(false);
    setDate(getTodayIso());
    setDescription("");
    setTagsInput("");
    setMarkdown("");
    setEditorFromMarkdown("");
    setLoadedSlug("");
    setPreviewMode("preview");
    setStatus("已切换到新文章。");
  }

  function handleMarkdownSourceChange(value: string) {
    setMarkdown(value);
    setEditorFromMarkdown(value);
  }

  async function deletePost() {
    if (!isLocalSession || !loadedSlug || isDeleting || isSaving || isUploading || isLoadingPost || isLoadingPosts) return;
    const targetSlug = loadedSlug;
    if (!window.confirm(`确定删除当前文章「${targetSlug}」吗？未保存的修改也会清空。已保存的原文会移入本地回收目录。`)) return;

    setIsDeleting(true);
    setStatus("正在删除文章...");
    try {
      const response = await fetch(`${WRITE_SERVER_URL}/delete-post`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: targetSlug }),
      });
      if (!response.ok) throw new Error((await response.text()) || "删除失败");
      const result = (await response.json()) as { recoveryPath: string };
      setExistingPosts((posts) => posts.filter((post) => post.slug !== targetSlug));
      setSelectedPostSlug((current) => current === targetSlug ? "" : current);
      createNewPost();
      setStatus(`已删除文章。原文保存在 ${result.recoveryPath}。重新部署后线上同步更新。`);
      await loadPostList();
    } catch (error) {
      setStatus(error instanceof Error ? `删除失败：${error.message}。确认已运行 npm.cmd run write-server。` : "删除失败，请重试。");
    } finally {
      setIsDeleting(false);
    }
  }

  async function uploadImage(file: File): Promise<UploadResponse> {
    const dataUrl = await fileToDataUrl(file);
    const response = await fetch(`${WRITE_SERVER_URL}/upload-image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        slug: slug.trim(),
        fileName: file.name,
        mimeType: file.type,
        dataUrl,
      }),
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || "图片上传失败");
    }

    return response.json();
  }

  async function handleFiles(files: File[]) {
    if (isDeleting) return;
    const images = files.filter((file) => file.type.startsWith("image/"));

    if (images.length === 0) return;
    if (!isLocalSession) {
      setStatus("写作保存只支持本地 localhost。");
      return;
    }
    if (!isValidSlug(slug.trim())) {
      setStatus("先填写有效 slug，只能使用小写字母、数字和连字符。");
      return;
    }

    setIsUploading(true);
    setStatus("正在保存图片...");

    try {
      for (const image of images) {
        const uploaded = await uploadImage(image);
        const alt = image.name.replace(/\.[^.]+$/, "");
        insertHtml(
          `<p><img src="${escapeAttribute(uploaded.path)}" alt="${escapeAttribute(
            alt,
          )}" /></p><p><br></p>`,
        );
      }

      setStatus(`已插入 ${images.length} 张图片。`);
    } catch (error) {
      setStatus(
        error instanceof Error
          ? `${error.message}。确认已运行 npm.cmd run write-server。`
          : "图片上传失败。",
      );
    } finally {
      setIsUploading(false);
    }
  }

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!slugTouched) {
      setSlug(slugify(value));
    }
  }

  function handleSlugChange(value: string) {
    setSlugTouched(true);
    setSlug(value.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-"));
  }

  async function savePost(overwrite = false) {
    if (isDeleting) return;
    const normalizedSlug = slug.trim();

    if (!isLocalSession) {
      setStatus("写作保存只支持本地 localhost。");
      return;
    }
    if (!title.trim()) {
      setStatus("先填写标题。");
      return;
    }
    if (!isValidSlug(normalizedSlug)) {
      setStatus("slug 只能使用小写字母、数字和连字符。");
      return;
    }
    if (!date) {
      setStatus("先填写日期。");
      return;
    }

    setIsSaving(true);
    setStatus("正在保存文章...");

    const shouldOverwrite = overwrite || loadedSlug === normalizedSlug;
    const payload: SavePayload = {
      title: title.trim(),
      slug: normalizedSlug,
      date,
      description: description.trim(),
      tags,
      content: markdown.trim(),
      overwrite: shouldOverwrite,
    };

    try {
      const response = await fetch(`${WRITE_SERVER_URL}/save-post`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.status === 409 && !shouldOverwrite) {
        const shouldConfirmOverwrite = window.confirm("同名文章已存在，是否覆盖？");
        if (shouldConfirmOverwrite) {
          await savePost(true);
        } else {
          setStatus("已取消保存。");
        }
        return;
      }

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "保存失败");
      }

      const result = (await response.json()) as { path: string; overwritten: boolean };
      setLoadedSlug(normalizedSlug);
      setSlugTouched(true);
      setStatus(`${result.overwritten ? "已覆盖" : "已保存"}：${result.path}`);
      void loadPostList();
    } catch (error) {
      setStatus(
        error instanceof Error
          ? `${error.message}。确认已运行 npm.cmd run write-server。`
          : "文章保存失败。",
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-sky-700 dark:text-sky-300">
            写博客
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            {loadedSlug ? `正在编辑 posts/${loadedSlug}.md` : "新文章"}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => void deletePost()}
            disabled={!loadedSlug || !isLocalSession || isDeleting || isSaving || isUploading || isLoadingPost || isLoadingPosts}
            title={loadedSlug ? "删除当前打开的文章" : "请先打开已有文章"}
            className="inline-flex items-center justify-center rounded-lg border border-red-300 px-5 py-3 text-sm font-semibold text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-950/40"
          >
            {isDeleting ? "删除中..." : "删除文章"}
          </button>
          <button
            type="button"
            onClick={() => savePost(false)}
            disabled={isDeleting || isSaving || isUploading || isLoadingPost || !isLocalSession}
            className="inline-flex items-center justify-center rounded-lg bg-sky-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isSaving ? "保存中..." : loadedSlug === slug ? "保存修改" : "保存文章"}
          </button>
        </div>
      </div>

      {!isLocalSession && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-200">
          写入文件只在 localhost 可用。
        </div>
      )}

      <section className="rounded-lg border border-sky-200 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/70">
        <div className="flex flex-col gap-3 md:flex-row md:items-end">
          <label className="min-w-0 flex-1 space-y-2">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              打开已有文章
            </span>
            <select
              value={selectedPostSlug}
              onChange={(event) => setSelectedPostSlug(event.target.value)}
              disabled={isDeleting || isLoadingPosts || existingPosts.length === 0}
              className="w-full rounded-lg border border-sky-200 bg-white/80 px-3 py-2 text-gray-900 outline-none focus:border-sky-500 disabled:bg-gray-100 dark:border-slate-700 dark:bg-slate-900/80 dark:text-gray-100 dark:disabled:bg-slate-800"
            >
              {existingPosts.length === 0 ? (
                <option value="">暂无文章</option>
              ) : (
                existingPosts.map((post) => (
                  <option key={post.slug} value={post.slug}>
                    {post.date} - {post.title || post.slug}
                  </option>
                ))
              )}
            </select>
          </label>

          <button
            type="button"
            onClick={() => loadExistingPost(selectedPostSlug)}
            disabled={isDeleting || !selectedPostSlug || isLoadingPost || isLoadingPosts}
            className="rounded-lg border border-sky-300 bg-white px-4 py-2 text-sm font-medium text-sky-700 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-sky-700 dark:bg-slate-900 dark:text-sky-300 dark:hover:bg-slate-800"
          >
            {isLoadingPost ? "打开中..." : "打开"}
          </button>

          <button
            type="button"
            onClick={() => loadPostList()}
            disabled={isDeleting || isLoadingPosts}
            className="rounded-lg border border-sky-300 bg-white px-4 py-2 text-sm font-medium text-sky-700 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-sky-700 dark:bg-slate-900 dark:text-sky-300 dark:hover:bg-slate-800"
          >
            {isLoadingPosts ? "刷新中..." : "刷新"}
          </button>

          <button
            type="button"
            onClick={createNewPost}
            disabled={isDeleting}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-900 dark:text-gray-200 dark:hover:bg-slate-800"
          >
            新建
          </button>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            标题
          </span>
          <input
            value={title}
            onChange={(event) => handleTitleChange(event.target.value)}
            className="w-full rounded-lg border border-sky-200 bg-white/80 px-3 py-2 text-gray-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900/80 dark:text-gray-100"
            placeholder="文章标题"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            slug
          </span>
          <input
            value={slug}
            onChange={(event) => handleSlugChange(event.target.value)}
            className="w-full rounded-lg border border-sky-200 bg-white/80 px-3 py-2 font-mono text-sm text-gray-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900/80 dark:text-gray-100"
            placeholder="my-first-post"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            日期
          </span>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="w-full rounded-lg border border-sky-200 bg-white/80 px-3 py-2 text-gray-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900/80 dark:text-gray-100"
          />
        </label>

        <label className="space-y-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            标签
          </span>
          <input
            value={tagsInput}
            onChange={(event) => setTagsInput(event.target.value)}
            className="w-full rounded-lg border border-sky-200 bg-white/80 px-3 py-2 text-gray-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900/80 dark:text-gray-100"
            placeholder="AI, 学习笔记"
          />
        </label>

        <label className="space-y-2 md:col-span-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            描述
          </span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="min-h-20 w-full resize-y rounded-lg border border-sky-200 bg-white/80 px-3 py-2 text-gray-900 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900/80 dark:text-gray-100"
            placeholder="首页文章摘要"
          />
        </label>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
        <section className="overflow-hidden rounded-lg border border-sky-200 bg-white/70 dark:border-slate-700 dark:bg-slate-900/70">
          <div className="flex flex-wrap items-center gap-2 border-b border-sky-100 bg-sky-50/70 p-3 dark:border-slate-700 dark:bg-slate-800/70">
            <ToolbarButton label="H1" onClick={() => formatBlock("h1")} />
            <ToolbarButton label="H2" onClick={() => formatBlock("h2")} />
            <ToolbarButton label="H3" onClick={() => formatBlock("h3")} />
            <ToolbarButton label="P" onClick={() => formatBlock("p")} />
            <span className="mx-1 h-6 w-px bg-sky-200 dark:bg-slate-600" />
            <ToolbarButton label="B" onClick={() => runCommand("bold")} strong />
            <ToolbarButton label="I" onClick={() => runCommand("italic")} italic />
            <ToolbarButton label="''" onClick={() => formatBlock("pre")} />
            <span className="mx-1 h-6 w-px bg-sky-200 dark:bg-slate-600" />
            <ToolbarButton label="•" onClick={() => runCommand("insertUnorderedList")} />
            <ToolbarButton label="1." onClick={() => runCommand("insertOrderedList")} />
            <ToolbarButton label=">" onClick={() => formatBlock("blockquote")} />
            <ToolbarButton label="↗" onClick={createLink} />
            <ToolbarButton
              label="+图"
              onClick={() => {
                rememberSelection();
                fileInputRef.current?.click();
              }}
              disabled={isUploading}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(event) => {
                void handleFiles(Array.from(event.target.files || []));
                event.target.value = "";
              }}
            />
          </div>

          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            className="writer-editor min-h-[520px] max-h-[72vh] overflow-y-auto bg-white px-5 py-5 text-gray-900 outline-none dark:bg-slate-950 dark:text-gray-100"
            onInput={updateMarkdownFromEditor}
            onFocus={rememberSelection}
            onKeyUp={rememberSelection}
            onMouseUp={rememberSelection}
            onPaste={(event) => {
              const files = Array.from(event.clipboardData.items)
                .filter((item) => item.kind === "file")
                .map((item) => item.getAsFile())
                .filter((file): file is File => Boolean(file));

              if (files.some((file) => file.type.startsWith("image/"))) {
                event.preventDefault();
                void handleFiles(files);
                return;
              }

              window.setTimeout(updateMarkdownFromEditor, 0);
            }}
            onDrop={(event) => {
              const files = Array.from(event.dataTransfer.files);
              if (!files.some((file) => file.type.startsWith("image/"))) return;

              event.preventDefault();
              rememberSelection();
              void handleFiles(files);
            }}
            onDragOver={(event) => event.preventDefault()}
          >
            <p>
              <br />
            </p>
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border border-sky-200 bg-white/70 dark:border-slate-700 dark:bg-slate-900/70">
          <div className="flex items-center justify-between gap-3 border-b border-sky-100 bg-sky-50/70 p-3 dark:border-slate-700 dark:bg-slate-800/70">
            <div className="inline-flex rounded-lg border border-sky-200 bg-white p-1 dark:border-slate-600 dark:bg-slate-900">
              <PreviewButton
                active={previewMode === "preview"}
                label="预览"
                onClick={() => setPreviewMode("preview")}
              />
              <PreviewButton
                active={previewMode === "markdown"}
                label="Markdown"
                onClick={() => setPreviewMode("markdown")}
              />
              <PreviewButton
                active={previewMode === "document"}
                label=".md"
                onClick={() => setPreviewMode("document")}
              />
            </div>
            <span className="shrink-0 text-xs text-gray-500 dark:text-gray-400">
              {markdown.length} 字符
            </span>
          </div>

          {previewMode === "preview" && (
            <div className="max-h-[72vh] min-h-[520px] overflow-y-auto bg-white px-5 py-5 dark:bg-slate-950">
              <MarkdownRenderer content={markdown} />
            </div>
          )}

          {previewMode === "markdown" && (
            <textarea
              value={markdown}
              onChange={(event) => handleMarkdownSourceChange(event.target.value)}
              className="min-h-[520px] max-h-[72vh] w-full resize-none overflow-y-auto bg-white p-5 font-mono text-sm leading-6 text-gray-900 outline-none dark:bg-slate-950 dark:text-gray-100"
            />
          )}

          {previewMode === "document" && (
            <textarea
              readOnly
              value={markdownDocument}
              className="min-h-[520px] max-h-[72vh] w-full resize-none overflow-y-auto bg-white p-5 font-mono text-sm leading-6 text-gray-900 outline-none dark:bg-slate-950 dark:text-gray-100"
            />
          )}
        </section>
      </div>

      {status && (
        <div role="status" className="rounded-lg border border-sky-200 bg-sky-50 px-4 py-3 text-sm text-sky-800 dark:border-slate-700 dark:bg-slate-900 dark:text-sky-200">
          {status}
        </div>
      )}
    </section>
  );
}

interface ToolbarButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  strong?: boolean;
  italic?: boolean;
}

function ToolbarButton({
  label,
  onClick,
  disabled = false,
  strong = false,
  italic = false,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex h-9 min-w-9 items-center justify-center rounded-md border border-sky-200 bg-white px-2 text-sm text-gray-700 hover:border-sky-400 hover:text-sky-700 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-600 dark:bg-slate-900 dark:text-gray-200 dark:hover:border-sky-500 dark:hover:text-sky-300 ${
        strong ? "font-bold" : ""
      } ${italic ? "italic" : ""}`}
    >
      {label}
    </button>
  );
}

interface PreviewButtonProps {
  active: boolean;
  label: string;
  onClick: () => void;
}

function PreviewButton({ active, label, onClick }: PreviewButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-md px-3 py-1.5 text-sm font-medium ${
        active
          ? "bg-sky-600 text-white"
          : "text-gray-600 hover:text-sky-700 dark:text-gray-300 dark:hover:text-sky-300"
      }`}
    >
      {label}
    </button>
  );
}
