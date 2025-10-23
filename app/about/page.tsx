export default function AboutPage() {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <h1>关于我</h1>
      
      <p className="text-lg text-gray-600 dark:text-gray-400">
        欢迎来到我的个人博客!
      </p>

      <h2>关于这个博客</h2>
      <p>
        这是一个使用 Next.js 14、TypeScript 和 Tailwind CSS 构建的现代化个人博客。
        我在这里分享关于技术、编程、生活和思考的文章。
      </p>

      <h2>技术栈</h2>
      <ul>
        <li><strong>框架</strong>: Next.js 14 (App Router)</li>
        <li><strong>语言</strong>: TypeScript</li>
        <li><strong>样式</strong>: Tailwind CSS</li>
        <li><strong>内容</strong>: Markdown 文件</li>
        <li><strong>代码高亮</strong>: Highlight.js</li>
      </ul>

      <h2>功能特性</h2>
      <ul>
        <li>📝 支持 Markdown 格式的文章</li>
        <li>🌓 深色/浅色主题切换</li>
        <li>💻 代码语法高亮</li>
        <li>📱 响应式设计</li>
        <li>⚡ 快速加载和优秀的性能</li>
        <li>🔍 SEO 友好</li>
      </ul>

      <h2>联系方式</h2>
      <p>
        如果你想联系我，可以通过以下方式:
      </p>
      <ul>
        <li>📧 Email: your-email@example.com</li>
        <li>💼 GitHub: github.com/yourusername</li>
        <li>🐦 Twitter: @yourusername</li>
      </ul>

      <p className="mt-8 text-gray-600 dark:text-gray-400">
        感谢你的访问! 🙏
      </p>
    </div>
  );
}
