"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { site } from "@/lib/site";
const links = [
  { href: "/", label: "首页" },
  { href: "/gallery", label: "图片" },
  { href: "/archives", label: "归档" },
  { href: "/about", label: "关于" },
  { href: "/friends", label: "友链" },
];
export function Header() {
  const pathname = usePathname().replace(/\/+$/, "") || "/";
  const [isLocal, setIsLocal] = useState(false);
  useEffect(() => {
    setIsLocal(["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname));
  }, []);
  return <header className="site-header"><div className="header-inner">
    <Link href="/" className="site-brand" aria-label={site.name + "，返回首页"}><span className="brand-mark" aria-hidden="true">澈</span><span>{site.name}<span className="brand-note">学习 / 思考 / 记录</span></span></Link>
    <div className="header-actions">
      <nav className="site-nav" aria-label="主导航">{links.map(({ href, label }) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined}>{label}</Link>)}</nav>
      <div className="header-tools">
        {isLocal && <Link href="/write" className="header-write-link" aria-current={pathname === "/write" ? "page" : undefined}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m16 3 5 5-12 12-6 1 1-6L16 3Z" /><path d="m13 6 5 5" /></svg>
          编辑文章
        </Link>}
        <ThemeToggle />
      </div>
    </div>
  </div></header>;
}
