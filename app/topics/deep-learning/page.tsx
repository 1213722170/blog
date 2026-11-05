import type { Metadata } from "next";
import Link from "next/link";
import { getDeepLearningPosts } from "@/lib/posts";
import { deepLearning } from "@/lib/site";
import { formatDate } from "@/lib/utils";
export const metadata: Metadata = { title: deepLearning.title, description: deepLearning.description };
export default function DeepLearningPage() {
  const posts = getDeepLearningPosts();
  const minutes = posts.reduce((sum, post) => sum + post.readingMinutes, 0);
  return <div className="topic-page">
    <Link href="/" className="back-link">← 返回首页</Link>
    <header className="page-heading topic-heading"><p className="eyebrow">A LEARNING COLLECTION / 01</p><h1>{deepLearning.title}</h1><p>{deepLearning.description}</p><div className="collection-meta"><span>{posts.length} 篇笔记</span><span>约 {minutes} 分钟</span><span className="updating"><span className="status-dot" />持续更新</span></div></header>
    <div className="topic-layout">
      <aside className="collection-intro"><span className="eyebrow">ABOUT THIS COLLECTION</span><h2>从第一步，<br />慢慢理解。</h2><p>按学习顺序整理的课程笔记。可以从头开始，也可以从感兴趣的问题读起。</p>{posts[0] && <Link href={"/posts/" + posts[0].slug} className="text-link">从第一篇开始 →</Link>}<div className="collection-rule" /><p className="small-note">笔记保留了学习当时的思路与疑问，欢迎一起思考。</p></aside>
      <section aria-label="专题文章目录" className="lesson-list">
        <div className="lesson-list-heading"><h2>阅读目录</h2><span>按学习顺序</span></div>
        {posts.map((post, index) => <article key={post.slug} className="lesson-row"><span className="lesson-index">{String(index + 1).padStart(2, "0")}</span><div><h3><Link href={"/posts/" + post.slug}>{post.title}</Link></h3><p>{post.description || "课程学习与思考记录"}</p><div className="lesson-meta"><time dateTime={post.date}>{formatDate(post.date)}</time><span>约 {post.readingMinutes} 分钟</span></div></div><Link className="lesson-arrow" href={"/posts/" + post.slug} aria-label={"阅读" + post.title}>↗</Link></article>)}
      </section>
    </div>
  </div>;
}
