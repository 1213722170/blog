export default function AboutPage() {
  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      <h1>关于我</h1>
      
      <p className="text-lg text-gray-600 dark:text-gray-400">
        欢迎来到我的个人博客!
      </p>

      <h2>关于这个博客</h2>
      <p>
        这是一个完全由ai搭建的个人博客,qoder真是太好用了你们知道吗
      </p>

      <h2>技术栈</h2>
      <ul>
        <li><strong>框架</strong>: Next.js 14 (App Router)</li>
        <li><strong>语言</strong>: TypeScript</li>
        <li><strong>样式</strong>: Tailwind CSS</li>
        <li><strong>内容</strong>: Markdown 文件</li>
        <li><strong>代码高亮</strong>: Highlight.js</li>
      </ul>
      <h2>联系方式</h2>
      <p>
        如果你想联系我，可以通过以下方式:
      </p>
      <ul>
        <li>📧 Email: 1213722171@qq.com</li>
        <li>💼 GitHub: github.com/1213722170</li>
      </ul>

      <p className="mt-8 text-gray-600 dark:text-gray-400">
        感谢你的访问! 🙏
      </p>
    </div>
  );
}
