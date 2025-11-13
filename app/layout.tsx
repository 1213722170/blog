import type { Metadata } from "next";
import "./globals.css";
import dynamic from "next/dynamic";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MusicPlayer } from "@/components/MusicPlayer";
import { PetalAnimation } from "@/components/PetalAnimation";
import { CloudAnimation } from "@/components/CloudAnimation";

// 动态导入开场动画组件（客户端渲染）
const OpeningAnimation = dynamic(
  () => import("@/components/OpeningAnimation").then((mod) => ({ default: mod.OpeningAnimation })),
  { ssr: false }
);

export const metadata: Metadata = {
  title: "刘澈的博客",
  description: "cms激推 ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <OpeningAnimation>
            <CloudAnimation />
            <PetalAnimation />
            <Header />
            <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
              {children}
            </main>
            <Footer />
            <MusicPlayer />
          </OpeningAnimation>
        </ThemeProvider>
      </body>
    </html>
  );
}
