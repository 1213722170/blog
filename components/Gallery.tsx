"use client";

import { useEffect, useRef, useState } from "react";
import type { GalleryImage } from "@/lib/gallery";
import { getAssetPath } from "@/lib/utils";

const service = process.env.NEXT_PUBLIC_BLOG_WRITE_SERVER || "http://127.0.0.1:4317";
const acceptedTypes = new Set(["image/png", "image/jpeg", "image/webp", "image/gif", "image/avif"]);

function fileDataUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("图片读取失败，请重新选择。"));
    reader.readAsDataURL(file);
  });
}

export function Gallery({ initialImages }: { initialImages: GalleryImage[] }) {
  const [images, setImages] = useState(initialImages);
  const [isLocal, setIsLocal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [removing, setRemoving] = useState("");
  const [restoring, setRestoring] = useState(false);
  const [undo, setUndo] = useState<{ id: string; title: string } | null>(null);
  const [status, setStatus] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const image = selected === null ? null : images[selected];
  const previewOpen = selected !== null;
  const busy = uploading || Boolean(removing) || restoring;

  useEffect(() => {
    const local = ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname);
    setIsLocal(local);
    if (!local) return;
    const controller = new AbortController();
    fetch(service + "/gallery", { signal: controller.signal, cache: "no-store" })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => { if (data?.images) setImages(data.images); })
      .catch(() => { /* The static gallery also works without the local upload service. */ });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!previewOpen) return;
    const element = dialog.current;
    const previous = document.body.style.overflow;
    element?.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      element?.close();
      document.body.style.overflow = previous;
      trigger.current?.focus({ preventScroll: true });
    };
  }, [previewOpen]);

  async function upload(files: FileList | null) {
    if (!files?.length || busy) return;
    setUploading(true);
    let saved = 0;
    try {
      for (const file of Array.from(files)) {
        if (!acceptedTypes.has(file.type)) throw new Error("请选择 PNG、JPG、WebP、GIF 或 AVIF 图片。");
        if (file.size > 10 * 1024 * 1024) throw new Error("每张图片请控制在 10 MB 以内。");
        setStatus("正在保存 " + file.name + "…");
        let response: Response;
        try {
          response = await fetch(service + "/upload-gallery", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileName: file.name, mimeType: file.type, dataUrl: await fileDataUrl(file) }),
          });
        } catch {
          throw new Error("图片管理服务未连接。请在项目目录运行 npm.cmd run write-server 后重试。");
        }
        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        setImages(data.images);
        saved++;
      }
      setStatus("已保存 " + saved + " 张图片。发布博客时，图片会随网站一起更新。");
    } catch (error) {
      setStatus((saved ? "已保存 " + saved + " 张。" : "") + (error instanceof Error ? error.message : "图片保存失败，请重试。"));
    } finally {
      setUploading(false);
      if (fileInput.current) fileInput.current.value = "";
    }
  }

  async function remove(item: GalleryImage) {
    if (busy || !isLocal) return;
    setRemoving(item.fileName);
    setStatus("");
    try {
      const response = await fetch(service + "/delete-gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: item.fileName }),
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      setImages(data.images);
      setUndo({ id: data.undoId, title: item.title });
      setStatus("已删除「" + item.title + "」。误删可以点击撤销；重新发布后线上同步更新。");
    } catch (error) {
      setStatus(error instanceof Error && error.message !== "Failed to fetch" ? error.message : "图片管理服务未连接，请启动 npm.cmd run write-server 后重试。");
    } finally {
      setRemoving("");
    }
  }

  async function restore() {
    if (!undo || busy || !isLocal) return;
    setRestoring(true);
    try {
      const response = await fetch(service + "/restore-gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ undoId: undo.id }),
      });
      if (!response.ok) throw new Error(await response.text());
      const data = await response.json();
      setImages(data.images);
      setStatus("已恢复「" + undo.title + "」。");
      setUndo(null);
    } catch (error) {
      setStatus(error instanceof Error && error.message !== "Failed to fetch" ? error.message : "恢复失败，请确认本地图片管理服务已启动。");
    } finally {
      setRestoring(false);
    }
  }

  return <>
    <div className="gallery-toolbar">
      <p><strong>{String(images.length).padStart(2, "0")}</strong> 张收藏 <span> / 慢慢积攒，常常回看</span></p>
      {isLocal && <>
        <input ref={fileInput} type="file" accept="image/png,image/jpeg,image/webp,image/gif,image/avif" multiple className="sr-only" aria-label="选择要收藏的图片" onChange={(event) => void upload(event.target.files)} disabled={busy} />
        <button className="outlined-link" onClick={() => fileInput.current?.click()} disabled={busy}>{uploading ? "正在保存…" : "+ 添加图片"}</button>
      </>}
    </div>
    {status && <div className="gallery-status gallery-status-actions"><p role="status">{status}</p>{undo && <button onClick={() => void restore()} disabled={busy} aria-label={"撤销删除：" + undo.title}>{restoring ? "正在恢复…" : "撤销删除"}</button>}</div>}
    {images.length ? <div className="gallery-grid">{images.map((item, index) => <figure className="gallery-card" key={item.fileName}>
      <button className="gallery-image-button" aria-label={"放大图片：" + item.title} aria-haspopup="dialog" onClick={(event) => { trigger.current = event.currentTarget; setSelected(index); }}>
        {/* Native images retain the natural aspect ratio of each collected picture. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={getAssetPath(item.src)} alt={item.title} loading="lazy" />
      </button>
      <figcaption><span>{item.title}</span>{isLocal ? <button className="gallery-delete" aria-label={"删除图片：" + item.title} onClick={() => void remove(item)} disabled={busy}>{removing === item.fileName ? "删除中…" : "删除"}</button> : <span aria-hidden="true">↗</span>}</figcaption>
    </figure>)}</div> : <div className="gallery-empty">
      <div className="empty-frames" aria-hidden="true"><span /><span /><span /></div>
      <h2>留一个位置，给下一次心动。</h2>
      <p>{isLocal ? "点击「添加图片」，把喜欢的画面放进来。" : "图片集还在慢慢收集中，过些时候再来看吧。"}</p>
    </div>}
    {isLocal && <details className="gallery-help"><summary>如何管理这些图片？</summary><p>添加的图片会保存在这个博客项目里，刷新页面仍然保留。每张图片下方的「删除」可将它移出图片集，误删时点击提示中的「撤销删除」。重新发布后，线上图片集会同步更新。</p><p>也可以直接把图片放入 <code>public/images/gallery/</code> 文件夹。支持 PNG、JPG、WebP、GIF 和 AVIF。删除的原图暂存于项目的 <code>.gallery-trash/</code>，不会随网站发布。</p></details>}
    <dialog ref={dialog} className="image-dialog gallery-dialog" aria-label="图片预览" onCancel={() => setSelected(null)} onClose={() => setSelected(null)} onClick={(event) => { if (event.target === event.currentTarget) setSelected(null); }} onKeyDown={(event) => {
      if (event.key === "ArrowLeft" && selected !== null) { event.preventDefault(); setSelected((selected + images.length - 1) % images.length); }
      if (event.key === "ArrowRight" && selected !== null) { event.preventDefault(); setSelected((selected + 1) % images.length); }
    }}>
      <button className="image-dialog-close" aria-label="关闭图片预览" onClick={() => setSelected(null)}>✕</button>
      {image && <>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={getAssetPath(image.src)} alt={image.title} />
        <div className="gallery-preview-caption"><button aria-label="上一张图片" disabled={images.length < 2} onClick={() => setSelected(((selected || 0) + images.length - 1) % images.length)}>←</button><p>{image.title}<span>{(selected || 0) + 1} / {images.length}</span></p><button aria-label="下一张图片" disabled={images.length < 2} onClick={() => setSelected(((selected || 0) + 1) % images.length)}>→</button></div>
        <span className="image-dialog-hint">← → 切换 · Esc 关闭</span>
      </>}
    </dialog>
  </>;
}
