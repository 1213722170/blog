"use client";
import Link from "next/link";
import { useState } from "react";
import type { PostSummary } from "@/lib/posts";
export function ArchiveBrowser({ posts }: { posts: PostSummary[] }) {
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("");
  const tags = Array.from(new Set(posts.flatMap((post) => post.tags))).filter((value) => value !== "笔记");
  const filtered = posts.filter((post) => (!tag || post.tags.includes(tag)) && (post.title + " " + post.description + " " + post.tags.join(" ")).toLowerCase().includes(query.trim().toLowerCase()));
  const years = Array.from(new Set(filtered.map((post) => post.date.slice(0, 4))));
  return <>
    <div className="archive-controls"><div className="tag-filters" aria-label="按标签筛选"><button className={!tag ? "selected" : ""} aria-pressed={!tag} onClick={() => setTag("")}>全部</button>{tags.map((value) => <button key={value} className={tag === value ? "selected" : ""} aria-pressed={tag === value} onClick={() => setTag(value)}>{value}</button>)}</div><label className="archive-search"><svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5" /><path d="m13 13 4 4" /></svg><span className="sr-only">搜索文章</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索标题、内容简介…" /></label></div>
    <p className="archive-result" role="status">{query || tag ? "找到 " + filtered.length + " 篇文章" : "每一次记录，都是向前的一小步。"}</p>
    {years.map((year) => <section className="archive-year" key={year} aria-labelledby={"year-" + year}><div className="archive-year-label"><h2 id={"year-" + year}>{year}</h2><span>{filtered.filter((post) => post.date.startsWith(year)).length} 篇</span></div><div className="archive-entries">{filtered.filter((post) => post.date.startsWith(year)).map((post) => <article key={post.slug} className="archive-entry"><time dateTime={post.date}>{post.date.slice(5).replace("-", ".")}</time><h3><Link href={"/posts/" + post.slug}>{post.title}</Link></h3><span className="archive-entry-tag">{post.tags[0] || "记录"}</span><span aria-hidden="true" className="archive-entry-arrow">↗</span></article>)}</div></section>)}
    {!filtered.length && <div className="empty-state"><h2>还没有找到这篇文字</h2><p>试试其他关键词，或者看看全部文章。</p><button className="outlined-link" onClick={() => { setQuery(""); setTag(""); }}>清除筛选</button></div>}
  </>;
}
