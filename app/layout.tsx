import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MusicPlayer } from "@/components/MusicPlayer";

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
          <Header />
          <main className="flex-1 container mx-auto px-4 py-8 max-w-4xl">
            {children}
          </main>
          <Footer />
          <MusicPlayer />
        </ThemeProvider>
      </body>
    </html>
  );
}
