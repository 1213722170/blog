import type { Metadata } from "next";
import { getGalleryImages } from "@/lib/gallery";
import { Gallery } from "@/components/Gallery";

export const metadata: Metadata = {
  title: "图片",
  description: "收藏喜欢的图片，记录偶然遇见的美好与值得留住的瞬间。",
};

export default function GalleryPage() {
  return (
    <div className="gallery-page">
      <header className="page-heading">
        <p className="eyebrow">A COLLECTION OF MOMENTS</p>
        <h1>喜欢的画面</h1>
      </header>
      <Gallery initialImages={getGalleryImages()} />
    </div>
  );
}
