"use client";

import { useTheme } from "./ThemeProvider";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2.5 rounded-full bg-gradient-to-br from-sky-400 to-cyan-500 dark:from-sky-600 dark:to-indigo-600 hover:scale-110 hover:rotate-12 transition-all duration-300 shadow-lg hover:shadow-xl group"
      aria-label="切换主题"
    >
      <span className="text-xl group-hover:scale-125 inline-block transition-transform duration-300">
        {theme === "light" ? "🌙" : "☀️"}
      </span>
      <span className="absolute inset-0 rounded-full bg-white dark:bg-gray-900 opacity-20 group-hover:opacity-30 transition-opacity"></span>
    </button>
  );
}
