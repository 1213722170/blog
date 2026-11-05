import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { normalizeDate } from "./utils";
import { deepLearning } from "./site";
const postsDirectory = path.join(process.cwd(), "posts");
export interface Post {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  content: string;
  series?: string;
  seriesOrder?: number;
  readingMinutes: number;
}
export type PostSummary = Omit<Post, "content">;
function readPost(slug: string): Post {
  const { data, content } = matter(fs.readFileSync(path.join(postsDirectory, slug + ".md"), "utf8"));
  const text = content.replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/<[^>]+>/g, "");
  const chinese = (text.match(/[\u3400-\u9fff]/g) || []).length;
  const words = (text.match(/[a-z\d]+/gi) || []).length;
  const images = (content.match(/!\[/g) || []).length;
  try {
    return {
      slug, title: data.title || slug, date: normalizeDate(data.date),
      description: data.description || "",
      tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
      content,
      series: typeof data.series === "string" ? data.series : undefined,
      seriesOrder: typeof data.seriesOrder === "number" ? data.seriesOrder : undefined,
      readingMinutes: Math.max(1, Math.ceil(chinese / 400 + words / 220 + images * 0.2)),
    };
  } catch (error) { throw new Error(slug + ".md: " + (error as Error).message); }
}
export function getAllPosts(): Post[] {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs.readdirSync(postsDirectory).filter((name) => name.endsWith(".md"))
    .map((name) => name.slice(0, -3))
    .filter((slug) => !matter(fs.readFileSync(path.join(postsDirectory, slug + ".md"), "utf8")).data.draft)
    .map(readPost)
    .sort((a, b) => Date.parse(b.date + "T00:00:00Z") - Date.parse(a.date + "T00:00:00Z") || a.slug.localeCompare(b.slug));
}
export function getPostBySlug(slug: string): Post | null {
  if (!/^[a-z\d][a-z\d-]*$/i.test(slug) || !fs.existsSync(path.join(postsDirectory, slug + ".md"))) return null;
  const { data } = matter(fs.readFileSync(path.join(postsDirectory, slug + ".md"), "utf8"));
  return data.draft ? null : readPost(slug);
}
export function getDeepLearningPosts(): Post[] {
  return getAllPosts().filter((post) => post.series === deepLearning.id)
    .sort((a, b) => (a.seriesOrder ?? Infinity) - (b.seriesOrder ?? Infinity) || a.date.localeCompare(b.date));
}
export function summarizePost(post: Post): PostSummary {
  const { content, ...summary } = post;
  return summary;
}
