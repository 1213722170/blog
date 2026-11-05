import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { PostList } from "@/components/PostList";
import { LearningSketch } from "@/components/LearningSketch";
export default function Home() {
  const posts = getAllPosts();
  return <div className="home-page">
    <section className="home-hero"><div className="hero-copy">
      <p className="eyebrow"><span className="status-dot" /> A PERSONAL NOTEBOOK</p>
      <h1>把学到的，<br />慢慢<span className="ink-accent">写下来。</span></h1>
      <p className="hero-description">你好，我是刘澈。<br />这里存放学习中的探索、未解的疑问，<br className="desktop-break" />以及一些生活里的思考。</p>
      <Link href="/archives" className="text-link hero-link">翻开我的笔记 <span aria-hidden="true">↗</span></Link>
    </div><LearningSketch /></section>
    <section className="recent-section" aria-labelledby="recent-heading">
      <div className="section-heading"><div><p className="eyebrow">RECENT WRITING</p><h2 id="recent-heading">最近写下的</h2></div><Link href="/archives" className="text-link">全部 {posts.length} 篇 <span aria-hidden="true">↗</span></Link></div>
      <PostList posts={posts.slice(0, 6)} /><Link href="/archives" className="all-writing-link">去归档里继续翻翻 <span aria-hidden="true">→</span></Link>
    </section>
    <aside className="home-note"><span className="note-symbol" aria-hidden="true">“</span><p>学习的痕迹，值得被好好保存。</p><span className="eyebrow">ONE NOTE AT A TIME</span></aside>
  </div>;
}
