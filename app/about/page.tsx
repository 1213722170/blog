import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "关于我",
  description: "认识刘澈，以及这本记录学习、思考与生活的个人笔记。",
};

const technologies = [
  { label: "框架", name: "Next.js 14", detail: "App Router" },
  { label: "语言", name: "TypeScript", detail: "让代码更清晰" },
  { label: "样式", name: "Tailwind CSS", detail: "勾勒页面的样子" },
  { label: "内容", name: "Markdown", detail: "专注写下的文字" },
  { label: "代码高亮", name: "Highlight.js", detail: "让笔记更易读" },
];

export default function AboutPage() {
  return (
    <div className="about-page">
      <header className="page-heading">
        <p className="eyebrow"><span className="status-dot" /> BEHIND THE NOTEBOOK</p>
        <h1>你好，我是<span className="ink-accent">{site.author}</span>。</h1>
        <p>欢迎来到我的个人博客。</p>
      </header>

      <div className="about-layout">
        <div className="about-main">
          <section className="about-section" aria-labelledby="about-blog-heading">
            <div className="about-section-heading">
              <span className="about-section-number" aria-hidden="true">01</span>
              <div>
                <p className="eyebrow">A PLACE TO KEEP LEARNING</p>
                <h2 id="about-blog-heading">关于这个博客</h2>
              </div>
            </div>
            <div className="about-copy">
              <p>  这个博客于2025年秋由 AI 帮助搭建，当时的我对技术一窍不通，还好有Qoder和kiro。虽然说是叫博客，但是实际上成为了存放笔记的地方。本身就对技术不太感兴趣，莫名其妙的选择了计算机，奇奇怪怪的跟随着社团同学的脚步搭博客，不知为何就成了这个样。唯一令我满意的是把六年前游玩体会摘了上来。</p>
              <Link href="/archives" className="text-link">翻翻我的学习笔记 <span aria-hidden="true">↗</span></Link>
            </div>
          </section>

          <section className="about-section" aria-labelledby="about-stack-heading">
            <div className="about-section-heading">
              <span className="about-section-number" aria-hidden="true">02</span>
              <div>
                <p className="eyebrow">MADE WITH</p>
                <h2 id="about-stack-heading">文字背后的小工具</h2>
              </div>
            </div>
            <p className="about-stack-intro">搭起这个小站的技术栈。</p>
            <dl className="about-stack">
              {technologies.map(({ label, name, detail }) => (
                <div className="about-stack-row" key={name}>
                  <dt>{label}</dt>
                  <dd><span>{name}</span><span className="about-stack-detail">{detail}</span></dd>
                </div>
              ))}
            </dl>
          </section>
        </div>

        <aside className="about-contact" aria-labelledby="about-contact-heading">
          <p className="eyebrow">A SMALL HELLO</p>
          <h2 id="about-contact-heading">保持联系</h2>
          <p className="about-contact-copy">关于笔记的交流，或是随意聊聊，<br />都欢迎来打个招呼。</p>
          <div className="about-contact-links">
            <a href="mailto:1213722171@qq.com" className="about-contact-link">
              <span><span className="about-contact-label">EMAIL</span><span className="about-contact-value">1213722171@qq.com</span></span>
              <span aria-hidden="true">↗</span>
            </a>
            <a href="https://github.com/1213722170" target="_blank" rel="noopener noreferrer" className="about-contact-link" aria-label="GitHub：1213722170（在新标签页打开）">
              <span><span className="about-contact-label">GITHUB</span><span className="about-contact-value">github.com/1213722170</span></span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="about-signature"><span aria-hidden="true">澈</span><p>学习 / 思考 / 记录</p></div>
        </aside>
      </div>

      <div className="about-closing">
        <span className="status-dot" aria-hidden="true" />
        <p>感谢你来翻一翻，欢迎下次再见。</p>
        <Link href="/" className="text-link">回到首页 <span aria-hidden="true">↗</span></Link>
      </div>
    </div>
  );
}
