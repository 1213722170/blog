"use client";

import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <nav className="container mx-auto px-4 py-4 flex items-center justify-between max-w-4xl">
        <Link href="/" className="text-xl font-bold hover:text-blue-600 dark:hover:text-blue-400">
          我的博客
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="hover:text-blue-600 dark:hover:text-blue-400">
            首页
          </Link>
          <Link href="/about" className="hover:text-blue-600 dark:hover:text-blue-400">
            关于
          </Link>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
