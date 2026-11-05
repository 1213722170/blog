import Link from "next/link";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { ArticleTools } from "@/components/ArticleTools";
import { getAllPosts, getDeepLearningPosts, getPostBySlug } from "@/lib/posts";
import { deepLearning } from "@/lib/site";
import { formatDate } from "@/lib/utils";
import { notFound } from "next/navigation";

// Static export already limits routes to generateStaticParams; dynamicParams=false
// triggers a misleading missing-function error in Next 14's development server.
export function generateStaticParams() { return getAllPosts().map((post) => ({ slug: post.slug })); }
export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  return post ? { title: post.title, description: post.description || post.title } : {};
}
export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();
  const isSeries = post.series === deepLearning.id;
  const series = isSeries ? getDeepLearningPosts() : [];
  const index = series.findIndex((entry) => entry.slug === post.slug);
  const previous = series[index - 1];
  const next = series[index + 1];
  return <div className="article-page">
    <Link href={isSeries ? deepLearning.href : "/archives"} className="back-link">← {isSeries ? "深度学习专题" : "全部文章"}</Link>
    <header className="article-header">
      <p className="eyebrow">{isSeries ? "DEEP LEARNING / " + String(index + 1).padStart(2, "0") : "NOTES & THOUGHTS"}</p>
      <h1 id="article-title">{post.title}</h1>
      {post.description && <p className="article-description">{post.description}</p>}
      <div className="article-meta"><time dateTime={post.date}>{formatDate(post.date)}</time><span className="meta-dot">·</span><span>约 {post.readingMinutes} 分钟</span>{post.tags.map((tag) => <span className="article-tag" key={tag}>{tag}</span>)}</div>
    </header>
    <div className="article-layout">
      <div className="article-content">
        {isSeries && <div className="series-banner"><Link href={deepLearning.href}>深度学习笔记 <span aria-hidden="true">↗</span></Link><span>第 {index + 1} / {series.length} 篇</span></div>}
        <div id="article-body"><MarkdownRenderer content={post.content} /></div>
        <div className="article-end"><span aria-hidden="true">✳</span><p>写到这里，留待下次继续。</p></div>
        {isSeries ? <nav className="series-pagination" aria-label="专题文章导航">
          {previous ? <Link href={"/posts/" + previous.slug}><span>← 上一篇</span><strong>{previous.title}</strong></Link> : <Link href={deepLearning.href}><span>← 专题目录</span><strong>从这里开始学习</strong></Link>}
          {next ? <Link href={"/posts/" + next.slug}><span>下一篇 →</span><strong>{next.title}</strong></Link> : <Link href={deepLearning.href}><span>已读到最新一篇 ✓</span><strong>回到专题目录</strong></Link>}
        </nav> : <Link href="/archives" className="text-link">继续翻阅其他文章 →</Link>}
      </div>
      <ArticleTools slug={post.slug} />
    </div>
  </div>;
}
