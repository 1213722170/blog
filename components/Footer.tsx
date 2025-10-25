export function Footer() {
  return (
    <footer className="backdrop-blur-md bg-white/50 dark:bg-slate-900/50 border-t border-white/20 dark:border-slate-700/50 mt-12">
      <div className="container mx-auto px-4 py-6 text-center max-w-4xl">
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} 我的博客. 保留所有权利.
        </p>
        <p className="text-gray-500 dark:text-gray-500 text-xs mt-2">
          Made with ❤️ and Next.js
        </p>
      </div>
    </footer>
  );
}
