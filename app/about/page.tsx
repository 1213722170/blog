export default function AboutPage() {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <div className="mb-8">
        <h1 className="bg-gradient-to-r from-sky-600 to-cyan-600 dark:from-sky-400 dark:to-cyan-400 bg-clip-text text-transparent">
          关于我
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 bg-sky-50 dark:bg-sky-900/20 p-4 rounded-xl border-l-4 border-sky-500">
          欢迎来到我的个人博客!
        </p>
      </div>

      <div className="bg-gradient-to-br from-sky-50 to-cyan-50 dark:from-sky-900/20 dark:to-cyan-900/20 p-6 rounded-2xl mb-8 border border-sky-200/50 dark:border-sky-700/50">
        <h2 className="text-sky-600 dark:text-sky-400">
          关于这个博客
        </h2>
        <p>
          这是一个完全由ai搭建的个人博客，qoder真是太好用了你们知道吗
        </p>
      </div>

      <div className="bg-gradient-to-br from-cyan-50 to-sky-50 dark:from-cyan-900/20 dark:to-indigo-900/20 p-6 rounded-2xl mb-8 border border-cyan-200/50 dark:border-cyan-700/50">
        <h2 className="text-cyan-600 dark:text-cyan-400">
          技术栈
        </h2>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-sky-500 mt-1">◆</span>
            <div><strong className="text-sky-600 dark:text-sky-400">框架</strong>: Next.js 14 (App Router)</div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-500 mt-1">◆</span>
            <div><strong className="text-cyan-600 dark:text-cyan-400">语言</strong>: TypeScript</div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sky-500 mt-1">◆</span>
            <div><strong className="text-sky-600 dark:text-sky-400">样式</strong>: Tailwind CSS</div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-indigo-500 mt-1">◆</span>
            <div><strong className="text-indigo-600 dark:text-indigo-400">内容</strong>: Markdown 文件</div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-cyan-500 mt-1">◆</span>
            <div><strong className="text-cyan-600 dark:text-cyan-400">代码高亮</strong>: Highlight.js</div>
          </li>
        </ul>
      </div>

      <div className="bg-gradient-to-br from-indigo-50 to-sky-50 dark:from-indigo-900/20 dark:to-sky-900/20 p-6 rounded-2xl border border-indigo-200/50 dark:border-indigo-700/50">
        <h2 className="text-indigo-600 dark:text-indigo-400">
          联系方式
        </h2>
        <p>
          如果你想联系我，可以通过以下方式:
        </p>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 bg-white dark:bg-slate-800 p-3 rounded-lg">
            <strong>Email</strong>: 1213722171@qq.com
          </li>
          <li className="flex items-center gap-2 bg-white dark:bg-slate-800 p-3 rounded-lg">
            <strong>GitHub</strong>: github.com/1213722170
          </li>
        </ul>
      </div>

      <p className="mt-8 text-center text-gray-600 dark:text-gray-400 text-xl">
        感谢你的访问!
      </p>
    </div>
  );
}
