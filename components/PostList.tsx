import Link from "next/link";
import type { PostSummary } from "@/lib/posts";
import { deepLearning } from "@/lib/site";
export function PostList({ posts }: { posts: PostSummary[] }) {
  return <div className="post-list">{posts.map((post) => <article key={post.slug} className="post-row">
    <time dateTime={post.date} className="post-row-date">{post.date.replace(/-/g, ".")}</time>
    <div className="post-row-content"><div className="post-row-meta"><span>{post.series === deepLearning.id ? "学习笔记" : post.tags[0] || "随手记录"}</span><span className="meta-dot">·</span><span>约 {post.readingMinutes} 分钟</span></div>
    <h3><Link href={"/posts/" + post.slug}>{post.title}</Link></h3>{post.description && <p>{post.description}</p>}</div>
    <Link className="post-row-arrow" href={"/posts/" + post.slug} aria-label={"阅读" + post.title}><span aria-hidden="true">↗</span></Link>
  </article>)}</div>;
}
