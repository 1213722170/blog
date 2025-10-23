# 我的个人博客

一个使用 Next.js 14、TypeScript 和 Tailwind CSS 构建的现代化个人博客系统。支持 Markdown 文章、深色模式、代码高亮等功能。

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8)

## ✨ 主要特性

- 🚀 **Next.js 14** - 使用最新的 App Router 和 React Server Components
- 📝 **Markdown 支持** - 使用 Markdown 格式编写博客文章
- 🎨 **Tailwind CSS** - 现代化的响应式设计
- 🌓 **深色模式** - 支持明暗主题切换,自动保存用户偏好
- 💻 **代码高亮** - 使用 Highlight.js 实现多语言代码高亮
- 🎵 **音乐播放器** - 内置音乐播放器,可播放背景音乐
- 📱 **响应式设计** - 完美适配各种设备屏幕
- ⚡ **高性能** - 优化的构建和加载速度
- 🔍 **SEO 友好** - 内置 Metadata API 支持

## 📋 技术栈

- **框架**: Next.js 14
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **Markdown 处理**: 
  - gray-matter (Front Matter 解析)
  - react-markdown (Markdown 渲染)
  - remark-gfm (GitHub Flavored Markdown)
  - rehype-highlight (代码高亮)
  - highlight.js (语法高亮主题)

## 🚀 快速开始

### 环境要求

- Node.js 18.17 或更高版本
- npm 或 yarn 或 pnpm

### 安装步骤

1. **克隆项目** (如果使用 Git)
   ```bash
   git clone <your-repository-url>
   cd my-blog
   ```

2. **安装依赖**
   ```bash
   npm install
   # 或
   yarn install
   # 或
   pnpm install
   ```

3. **启动开发服务器**
   ```bash
   npm run dev
   # 或
   yarn dev
   # 或
   pnpm dev
   ```

4. **访问博客**
   
   打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 📝 如何写文章

### 创建新文章

1. 在 `posts` 目录下创建一个新的 `.md` 文件,例如 `my-new-post.md`

2. 在文件开头添加 Front Matter 元数据:

```markdown
---
title: "文章标题"
date: "2025-10-23"
description: "文章简短描述"
tags: ["标签1", "标签2"]
---

# 文章标题

这里是文章内容...
```

### Front Matter 字段说明

- `title` (必需): 文章标题
- `date` (必需): 发布日期,格式为 YYYY-MM-DD
- `description` (推荐): 文章简短描述,用于文章列表和 SEO
- `tags` (可选): 文章标签数组

### Markdown 语法支持

博客支持所有标准 Markdown 语法以及 GitHub Flavored Markdown (GFM),包括:

- 标题、段落、列表
- 粗体、斜体、删除线
- 链接和图片
- 代码块和行内代码
- 引用
- 表格
- 任务列表

#### 代码高亮示例

````markdown
```javascript
function hello() {
  console.log("Hello, World!");
}
```
````

## 📁 项目结构

```
my-blog/
├── app/                    # Next.js App Router 目录
│   ├── layout.tsx         # 根布局组件
│   ├── page.tsx           # 首页
│   ├── globals.css        # 全局样式
│   ├── about/             # 关于页面
│   └── posts/             # 文章详情页
│       └── [slug]/
│           └── page.tsx
├── components/             # React 组件
│   ├── Header.tsx         # 头部导航
│   ├── Footer.tsx         # 底部组件
│   ├── ThemeProvider.tsx  # 主题提供者
│   ├── ThemeToggle.tsx    # 主题切换按钮
│   └── MusicPlayer.tsx    # 音乐播放器
├── lib/                   # 工具函数
│   ├── posts.ts          # 文章管理功能
│   └── utils.ts          # 通用工具函数
├── posts/                 # Markdown 文章目录
│   ├── welcome.md
│   ├── nextjs-14-features.md
│   └── markdown-guide.md
├── public/                # 静态资源
│   └── music/            # 音乐文件目录
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
├── README.md             # 项目说明文档
└── MUSIC-PLAYER.md       # 音乐播放器使用说明
```

## 🎨 自定义配置

### 修改博客标题和描述

编辑 `app/layout.tsx` 文件:

```typescript
export const metadata: Metadata = {
  title: "你的博客名称",
  description: "你的博客描述",
};
```

### 修改导航菜单

编辑 `components/Header.tsx` 文件,在导航部分添加或修改链接。

### 自定义样式

- 全局样式: 编辑 `app/globals.css`
- Tailwind 配置: 编辑 `tailwind.config.ts`
- 主题颜色: 修改 `globals.css` 中的 CSS 变量

### 修改代码高亮主题

在 `app/posts/[slug]/page.tsx` 中修改 highlight.js 主题:

```typescript
import "highlight.js/styles/github-dark.css"; // 更换为其他主题
```

可用主题参考: [Highlight.js Styles](https://highlightjs.org/static/demo/)

## 🎵 音乐播放器使用

博客内置了一个精美的音乐播放器组件,位于页面右下角。

### 添加音乐文件

1. 将音乐文件(MP3格式)放入 `public/music/` 目录
2. 文件命名为 `365-li-lu.mp3` (或修改配置)
3. 刷新页面即可使用

### 播放器功能

- ▶️ 播放/暂停控制
- 🎚️ 进度条拖动
- 🔊 音量调节
- 👁️ 显示/隐藏播放器
- 🌓 深色模式适配

详细使用说明请查看 [MUSIC-PLAYER.md](./MUSIC-PLAYER.md)

## 🛠️ 构建和部署

### 本地构建

```bash
npm run build
npm run start
```

### 部署到 Vercel (推荐)

1. 将项目推送到 GitHub
2. 访问 [Vercel](https://vercel.com)
3. 导入你的 GitHub 仓库
4. Vercel 会自动检测 Next.js 项目并进行部署

### 部署到其他平台

项目可以部署到任何支持 Node.js 的托管平台:

- **Netlify**: 适合静态导出
- **AWS Amplify**: AWS 云平台
- **Railway**: 简单的部署流程
- **自己的服务器**: 使用 PM2 或 Docker

## 🔧 常见问题

### 1. 文章不显示怎么办?

- 检查 `posts` 目录是否存在
- 确保文章文件以 `.md` 结尾
- 验证 Front Matter 格式是否正确

### 2. 代码高亮不工作?

- 确保代码块指定了语言,例如 ` ```javascript `
- 检查 `highlight.js` 包是否正确安装

### 3. 深色模式不保存?

- 确保浏览器允许使用 localStorage
- 检查 `ThemeProvider` 组件是否正确集成

### 4. 样式不生效?

- 运行 `npm run dev` 重启开发服务器
- 检查 Tailwind CSS 配置文件
- 清除浏览器缓存

### 5. 构建失败?

```bash
# 删除 node_modules 和锁文件
rm -rf node_modules package-lock.json
# 重新安装依赖
npm install
```

## 📚 扩展功能建议

可以考虑添加以下功能来增强博客:

- [ ] 文章搜索功能
- [ ] 分类和标签页面
- [ ] RSS 订阅
- [ ] 评论系统 (Giscus、Disqus)
- [ ] 文章阅读时间估算
- [ ] 文章目录 (TOC)
- [ ] 相关文章推荐
- [ ] 访问统计 (Google Analytics)
- [ ] 图片优化和懒加载
- [ ] 分页功能

## 📄 许可证

MIT License - 你可以自由使用、修改和分发这个项目。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request!

## 📧 联系方式

如有问题或建议,欢迎联系:

- Email: your-email@example.com
- GitHub: [@yourusername](https://github.com/yourusername)

---

**享受写作的乐趣!** ✍️
