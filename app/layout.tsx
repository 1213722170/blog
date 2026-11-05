import type { Metadata } from "next";
import "./globals.css";
import "highlight.js/styles/github-dark.css";
import "katex/dist/katex.min.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MusicPlayer } from "@/components/MusicPlayer";
import { site } from "@/lib/site";
export const metadata: Metadata = {
  metadataBase: new URL(site.url.replace(/\/$/, "") + "/"),
  title: { default: site.name, template: "%s · " + site.name },
  description: site.description,
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="zh-CN" suppressHydrationWarning><body><ThemeProvider>
    <a className="skip-link" href="#main-content">跳到正文</a>
    <Header /><main id="main-content" className="site-main">{children}</main><Footer /><MusicPlayer />
  </ThemeProvider></body></html>;
}
