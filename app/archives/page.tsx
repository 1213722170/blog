import type { Metadata } from "next";
import { getAllPosts, summarizePost } from "@/lib/posts";
import { ArchiveBrowser } from "@/components/ArchiveBrowser";
export const metadata: Metadata = { title: "文章归档", description: "按时间翻阅刘澈的全部文章、学习笔记与生活随感。" };
export default function ArchivesPage() {
  const posts = getAllPosts();
  return <div className="archive-page"><header className="page-heading"><p className="eyebrow">THE WRITING ARCHIVE</p><h1>文字的足迹</h1><p>一些学习，一些思考。<br />把散落的记录，按时间好好收在这里。</p><span className="archive-total">共 {posts.length} 篇文章 · {new Set(posts.map((post) => post.date.slice(0, 4))).size} 个年份</span></header><ArchiveBrowser posts={posts.map(summarizePost)} /></div>;
}
