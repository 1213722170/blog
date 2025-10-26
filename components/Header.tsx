"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-slate-900/70 border-b border-white/20 dark:border-slate-700/50 shadow-sm">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between max-w-4xl">
        <Link 
          href="/" 
          className="text-xl font-bold bg-gradient-to-r from-sky-600 to-cyan-600 dark:from-sky-400 dark:to-cyan-400 bg-clip-text text-transparent hover:scale-105 transition-transform duration-200"
        >
          我的博客
        </Link>
        <div className="flex items-center gap-6">
          <Link 
            href="/" 
            className="relative group px-3 py-2 rounded-lg hover:bg-sky-50 dark:hover:bg-slate-800 transition-all duration-200"
          >
            <span className="relative z-10 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              首页
            </span>
          </Link>
          <Link 
            href="/about" 
            className="relative group px-3 py-2 rounded-lg hover:bg-sky-50 dark:hover:bg-slate-800 transition-all duration-200"
          >
            <span className="relative z-10 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              关于
            </span>
          </Link>
          <Link 
            href="/friends" 
            className="relative group px-3 py-2 rounded-lg hover:bg-sky-50 dark:hover:bg-slate-800 transition-all duration-200"
          >
            <span className="relative z-10 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
              友链
            </span>
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
