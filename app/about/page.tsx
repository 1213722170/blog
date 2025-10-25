export default function AboutPage() {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <div className="mb-8">
        <h1 className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
          关于我
        </h1>
        
        <p className="text-lg text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border-l-4 border-blue-500">
          👋 欢迎来到我的个人博客!
        </p>
      </div>

      <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-2xl mb-8">
        <h2 className="text-blue-600 dark:text-blue-400 flex items-center gap-2">
          <span>💻</span>
          关于这个博客
        </h2>
        <p>
          这是一个完全由ai搭建的个人博客，qoder真是太好用了你们知道吗
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-2xl mb-8">
        <h2 className="text-purple-600 dark:text-purple-400 flex items-center gap-2">
          <span>⚙️</span>
          技术栈
        </h2>
        <ul className="space-y-2">
          <li className="flex items-start gap-2">
            <span className="text-blue-500">◆</span>
            <div><strong className="text-blue-600 dark:text-blue-400">框架</strong>: Next.js 14 (App Router)</div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-500">◆</span>
            <div><strong className="text-purple-600 dark:text-purple-400">语言</strong>: TypeScript</div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-pink-500">◆</span>
            <div><strong className="text-pink-600 dark:text-pink-400">样式</strong>: Tailwind CSS</div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-green-500">◆</span>
            <div><strong className="text-green-600 dark:text-green-400">内容</strong>: Markdown 文件</div>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-orange-500">◆</span>
            <div><strong className="text-orange-600 dark:text-orange-400">代码高亮</strong>: Highlight.js</div>
          </li>
        </ul>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-2xl">
        <h2 className="text-green-600 dark:text-green-400 flex items-center gap-2">
          <span>📧</span>
          联系方式
        </h2>
        <p>
          如果你想联系我，可以通过以下方式:
        </p>
        <ul className="space-y-2">
          <li className="flex items-center gap-2 bg-white dark:bg-slate-800 p-3 rounded-lg">
            <span>📧</span>
            <strong>Email</strong>: 1213722171@qq.com
          </li>
          <li className="flex items-center gap-2 bg-white dark:bg-slate-800 p-3 rounded-lg">
            <span>💼</span>
            <strong>GitHub</strong>: github.com/1213722170
          </li>
        </ul>
      </div>

      <p className="mt-8 text-center text-gray-600 dark:text-gray-400 text-xl">
        感谢你的访问! 🙏✨
      </p>
    </div>
  );
}
