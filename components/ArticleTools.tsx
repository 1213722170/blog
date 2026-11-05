"use client";
import { useEffect, useRef, useState } from "react";

type Heading = { id: string; title: string; level: number };
export function ArticleTools({ slug }: { slug: string }) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [active, setActive] = useState("");
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState<{ src: string; alt: string } | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const imageTrigger = useRef<HTMLImageElement | null>(null);
  const tocRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const body = document.getElementById("article-body");
    if (!body) return;
    const nodes = Array.from(body.querySelectorAll<HTMLElement>("h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]"));
    setHeadings(nodes.map((node) => ({ id: node.id, title: node.textContent || "", level: Number(node.tagName[1]) })));
    const update = () => {
      const top = body.getBoundingClientRect().top + window.scrollY;
      const distance = body.offsetHeight - window.innerHeight + 160;
      setProgress(distance <= 0 ? (body.getBoundingClientRect().bottom <= window.innerHeight ? 100 : 0) : Math.max(0, Math.min(100, ((window.scrollY - top + 120) / distance) * 100)));
      let current = nodes[0]?.id || "";
      for (const node of nodes) { if (node.getBoundingClientRect().top <= 170) current = node.id; }
      setActive(current);
    };
    const showImage = (node: HTMLImageElement) => {
      imageTrigger.current = node;
      setImage({ src: node.currentSrc || node.src, alt: node.alt === "alt text" ? "" : node.alt });
    };
    const onClick = (event: MouseEvent) => { if (event.target instanceof HTMLImageElement) showImage(event.target); };
    const onKey = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLImageElement && (event.key === "Enter" || event.key === " ")) { event.preventDefault(); showImage(event.target); }
    };
    const images = Array.from(body.querySelectorAll("img"));
    images.forEach((node) => { node.tabIndex = 0; node.setAttribute("role", "button"); node.setAttribute("aria-label", "放大图片：" + (node.alt || "文章配图")); node.setAttribute("aria-haspopup", "dialog"); });
    const resize = new ResizeObserver(update);
    resize.observe(body);
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    body.addEventListener("click", onClick);
    body.addEventListener("keydown", onKey);
    return () => {
      resize.disconnect();
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      body.removeEventListener("click", onClick);
      body.removeEventListener("keydown", onKey);
    };
  }, [slug]);

  useEffect(() => {
    if (!image) return;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    dialog?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      imageTrigger.current?.focus({ preventScroll: true });
    };
  }, [image]);

  const links = <ol>{headings.map((heading) => <li key={heading.id} style={{ paddingLeft: Math.max(0, heading.level - (headings[0]?.level || 1)) * 12 }}><a href={"#" + heading.id} aria-current={active === heading.id ? "location" : undefined} onClick={() => { if (tocRef.current) tocRef.current.open = false; }}>{heading.title}</a></li>)}</ol>;
  return <>
    <div className="reading-progress" role="progressbar" aria-label="阅读进度" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}><span style={{ transform: "scaleX(" + progress / 100 + ")" }} /></div>
    <aside className="article-aside"><div className="article-aside-inner">
      <div className="desktop-toc"><p className="eyebrow">ON THIS PAGE</p><h2>本页目录</h2>{headings.length ? links : <p className="toc-empty">这篇笔记没有分节标题，<br />慢慢往下读就好。</p>}</div>
      <details className="mobile-toc" ref={tocRef}><summary>本页目录 <span>{headings.length} 个章节</span></summary>{headings.length ? links : <p className="toc-empty">这篇笔记没有分节标题。</p>}</details>
      <div className="reading-status"><span>阅读进度</span><span>{Math.round(progress)}%</span></div>
      <a className="back-to-top" href="#article-title">↑ 回到开头</a>
    </div></aside>
    <dialog className="image-dialog" ref={dialogRef} aria-label="图片预览" onCancel={() => setImage(null)} onClose={() => setImage(null)} onClick={(event) => { if (event.target === event.currentTarget) setImage(null); }}>
      <button className="image-dialog-close" aria-label="关闭图片预览" onClick={() => setImage(null)}>✕</button>
      {image && <>
        {/* Native image preserves the full-size screenshot in the static lightbox. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={image.src} alt={image.alt} />
        {image.alt && <p>{image.alt}</p>}
        <span className="image-dialog-hint">按 Esc 关闭</span>
      </>}
    </dialog>
  </>;
}
