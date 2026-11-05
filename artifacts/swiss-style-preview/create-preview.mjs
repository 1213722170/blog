import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const directory=path.dirname(fileURLToPath(import.meta.url));
const source=await fs.readFile(path.join(directory,'../color-previews/01-moss-green.html'),'utf8');
const posts=[...source.matchAll(/<article class="post-row">([\s\S]*?)<\/article>/g)].map(([,row])=>({
  date:row.match(/<time[^>]*>(.*?)<\/time>/)[1],
  title:row.match(/<h3><a[^>]*>(.*?)<\/a><\/h3>/)[1],
  href:row.match(/<h3><a href="([^"]+)"/)[1],
  category:row.match(/<div class="post-row-meta"><span>(.*?)<\/span>/)[1],
  description:row.match(/<\/h3><p>(.*?)<\/p>/)?.[1]??'',
}));
const html=`<!doctype html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>刘澈的博客 — Swiss Style</title>
<style>
:root{--black:#171717;--paper:#F3F0E8;--red:#DA291C;--gutter:24px;--columns:repeat(12,minmax(0,1fr));--font:Helvetica,"Neue Haas Grotesk",Inter,Arial,"Microsoft YaHei",sans-serif;color-scheme:light}
*{box-sizing:border-box}
body{margin:0;background:var(--paper);color:var(--black);font-family:var(--font);font-weight:400;-webkit-font-smoothing:antialiased;font-size:13px;text-align:left}
h1,h2,h3,p{margin:0;font-weight:400}
a{color:inherit;text-decoration:none}
button,input{font-family:inherit}
.grid{display:grid;grid-template-columns:var(--columns);column-gap:var(--gutter)}
.page{width:calc(100% - 96px);max-width:1344px;margin:0 auto}
.small{font-size:11px;line-height:1.6}
.caps{font-size:10px;line-height:1.5;letter-spacing:.055em}
.site-header{padding:26px 0 25px;align-items:start;border-bottom:1px solid var(--black)}
.brand{grid-column:1/5;font-size:20px;font-weight:700;line-height:1.25;letter-spacing:-.035em}
.brand span{display:block;margin-top:5px;font-size:10px;line-height:1.3;letter-spacing:.035em;font-weight:400}
.site-nav{grid-column:7/13;display:grid;grid-template-columns:repeat(6,minmax(0,1fr));column-gap:var(--gutter)}
.site-nav a{font-size:12px;line-height:1.3;display:block;padding-top:2px}
.site-nav a span{display:block;font-size:9px;margin-top:6px}
.site-nav a:first-child{color:var(--red);font-weight:700}
.site-nav a:last-child{grid-column:6}
.hero{grid-template-rows:auto auto auto;row-gap:0;padding-top:22px;padding-bottom:68px}
.hero-label{grid-column:1/7;grid-row:1;font-weight:700}
.hero-meta{grid-column:10/13;grid-row:1}
.hero-title{grid-column:1/10;grid-row:2;font-weight:700;font-size:clamp(72px,8.33vw,120px);line-height:1.16;letter-spacing:-.085em;margin-top:64px}
.hero-title span{display:block;white-space:nowrap}
.hero-title em{font-style:normal;color:var(--red)}
.red-module{grid-column:10/13;grid-row:2/4;background:var(--red);color:var(--paper);margin-top:64px;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));column-gap:var(--gutter);grid-template-rows:auto 1fr auto;min-height:427px}
.module-number{grid-column:1/4;font-size:114px;font-weight:700;line-height:.9;letter-spacing:-.07em;padding-top:20px}
.module-label{grid-column:1/4;grid-row:2;margin-top:18px;line-height:1.6;font-size:10px;font-weight:700}
.module-bottom{grid-column:1/4;grid-row:3;border-top:1px solid var(--paper);padding-top:14px;padding-bottom:20px;font-size:12px;line-height:1.65}
.hero-bottom{grid-column:1/10;grid-row:3;display:grid;grid-template-columns:repeat(9,minmax(0,1fr));column-gap:var(--gutter);padding-top:42px;align-items:start}
.english-title{grid-column:1/4;font-size:27px;line-height:1.02;letter-spacing:-.055em;font-weight:700}
.hero-description{grid-column:4/8;font-size:12px;line-height:1.85}
.hero-description a{display:block;color:var(--red);font-weight:700;margin-top:16px}
.writing{border-top:1px solid var(--black)}
.section-heading{padding:21px 0 32px;align-items:start}
.section-index{grid-column:1/4;font-size:11px;line-height:1.5;font-weight:700}
.section-index span{display:block;font-weight:400;margin-top:6px;font-size:10px}
.section-heading h2{grid-column:4/10;font-size:44px;line-height:1.08;letter-spacing:-.055em;font-weight:700}
.section-heading>a{grid-column:11/13;font-size:11px;line-height:1.5;color:var(--red);padding-top:3px;font-weight:700}
.post{border-top:1px solid var(--black);padding:23px 0 25px;align-items:start;min-height:100px}
.post-number{grid-column:1/2;font-size:12px;font-weight:700;line-height:1.55}
.post-date{grid-column:2/4;font-size:11px;line-height:1.7}
.post-copy{grid-column:4/11}
.post-copy h3{font-weight:700;font-size:23px;line-height:1.3;letter-spacing:-.035em}
.post-copy p{font-size:11px;line-height:1.7;margin-top:8px}
.post-category{grid-column:11/13;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--gutter);font-size:10px;line-height:1.7}
.post-category a{font-size:19px;line-height:1.1}
.post:first-child .post-number,.post:first-child h3{color:var(--red)}
.archive-link{border-top:1px solid var(--black);padding:17px 0 54px}
.archive-link a{grid-column:4/11;color:var(--red);font-size:12px;font-weight:700}
.note{background:var(--red);color:var(--paper);padding:28px 0 34px}
.note-index{grid-column:1/4;font-size:11px;font-weight:700}
.note p{grid-column:4/13;font-size:40px;font-weight:700;line-height:1.28;letter-spacing:-.055em;max-width:750px}
.note small{grid-column:4/13;margin-top:20px;font-size:10px;font-weight:400;letter-spacing:.04em}
.site-footer{padding:24px 0 27px;align-items:start}
.footer-name{grid-column:1/4;font-weight:700;font-size:12px}
.footer-statement{grid-column:4/10;font-size:10px;line-height:1.6}
.footer-meta{grid-column:11/13;font-size:10px;line-height:1.6}
@media(min-width:1500px){.hero-title{font-size:120px}}
@media(max-width:900px){:root{--gutter:12px}.page{width:calc(100% - 40px)}.brand{grid-column:1/6}.site-nav{grid-column:7/13;column-gap:12px}.site-nav a{font-size:10px}.hero-title{font-size:8.3vw;margin-top:42px}.red-module{margin-top:42px;min-height:340px}.module-number{font-size:70px}.hero-bottom{padding-top:24px}.english-title{font-size:20px}.hero-description{font-size:11px;grid-column:4/10}.section-heading h2{font-size:30px}.post-copy h3{font-size:18px}.note p{font-size:30px}}
@media(max-width:600px){.site-header{row-gap:22px}.brand{grid-column:1/13}.site-nav{grid-column:1/13}.hero-label{grid-column:1/10}.hero-meta{grid-column:10/13;font-size:8px}.hero-title{grid-column:1/13;font-size:12vw;grid-row:2;margin-top:36px}.red-module{grid-column:10/13;grid-row:3;margin-top:30px;min-height:210px}.module-number{font-size:42px;padding-top:12px}.module-label{font-size:8px}.module-bottom{font-size:9px;padding-bottom:12px}.hero-bottom{grid-column:1/10;grid-template-columns:repeat(9,minmax(0,1fr));padding-top:30px}.english-title{grid-column:1/10;font-size:25px}.hero-description{grid-column:1/9;margin-top:25px}.hero{padding-bottom:40px}.section-index{grid-column:1/4}.section-heading h2{grid-column:4/13;font-size:31px}.section-heading>a{grid-column:4/13;padding-top:16px}.post-number{grid-column:1/2}.post-date{grid-column:2/5;font-size:9px}.post-copy{grid-column:5/13}.post-copy h3{font-size:17px}.post-category{grid-column:5/13;margin-top:13px;grid-template-columns:1fr 30px}.post{padding-top:18px}.archive-link a{grid-column:5/13}.note p{font-size:24px}.footer-meta{grid-column:11/13;font-size:8px}}
</style></head><body>
<div class="page"><header class="site-header grid">
<a class="brand" href="/">刘澈的博客<span>LIU CHE — PERSONAL NOTEBOOK</span></a>
<nav class="site-nav" aria-label="主导航"><a href="/">首页<span>INDEX</span></a><a href="/gallery/">图片<span>IMAGES</span></a><a href="/archives/">归档<span>ARCHIVE</span></a><a href="/about/">关于<span>ABOUT</span></a><a href="/friends/">友链<span>LINKS</span></a></nav>
</header>
<main><section class="hero grid">
<p class="hero-label caps">A PERSONAL NOTEBOOK / 学习 · 思考 · 记录</p>
<p class="hero-meta caps">2026<br>线上 / ONLINE</p>
<h1 class="hero-title"><span>把学到的，</span><span>慢慢<em>写下来。</em></span></h1>
<aside class="red-module" aria-label="笔记集编号"><p class="module-number">01</p><p class="module-label">NOTES ON<br>LEARNING.</p><p class="module-bottom">持续学习。<br>保持好奇。<br><span class="caps">ONE NOTE AT A TIME</span></p></aside>
<div class="hero-bottom"><p class="english-title">Learn.<br>Think.<br>Write.</p><div class="hero-description"><p>你好，我是刘澈。<br>这里存放学习中的探索、未解的疑问，<br>以及一些生活里的思考。</p><a href="/archives/">翻开我的笔记 ↗</a></div></div>
</section>
<section class="writing" aria-labelledby="writing-title"><div class="section-heading grid"><p class="section-index">01 / 最近更新<span>RECENT WRITING</span></p><h2 id="writing-title">最近写下的</h2><a href="/archives/">全部 15 篇 ↗</a></div>
<div>${posts.map((post,i)=>`<article class="post grid"><p class="post-number">${String(i+1).padStart(2,'0')}</p><time class="post-date">${post.date}</time><div class="post-copy"><h3><a href="${post.href}">${post.title}</a></h3>${post.description?`<p>${post.description}</p>`:''}</div><div class="post-category"><span>${post.category}</span><a href="${post.href}" aria-label="阅读${post.title}">↗</a></div></article>`).join('')}</div>
<div class="archive-link grid"><a href="/archives/">去归档里继续翻翻 →</a></div></section></main></div>
<aside class="note"><div class="page grid"><span class="note-index">02 / 关于记录</span><p>学习的痕迹，<br>值得被好好保存。</p><small>IN THE MAKING. IN THE MARGINS. IN THESE NOTES.</small></div></aside>
<footer class="site-footer page grid"><p class="footer-name">刘澈的博客</p><p class="footer-statement">在学习中生长，在文字里留痕。<br>学习 / 思考 / 记录</p><p class="footer-meta">© 2026 刘澈<br><a href="https://github.com/1213722170/blog">GITHUB ↗</a></p></footer>
</body></html>`;
await fs.writeFile(path.join(directory,'swiss-home.html'),html);
console.log(`Created Swiss homepage with ${posts.length} real posts.`);

