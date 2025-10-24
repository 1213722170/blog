# 我的个人博客 ✨

一个使用 Next.js 14、TypeScript 和 Tailwind CSS 构建的现代化个人博客系统。支持 Markdown 文章、深色模式、代码高亮、音乐播放器等功能。

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38bdf8)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black)

## 🌐 在线访问

**项目已部署在 Vercel 上,访问地址:**

🔗 **[点击访问我的博客](https://blog-eta-teal-77.vercel.app)** _(请替换为你的实际 Vercel 域名)_

- GitHub 仓库: https://github.com/1213722170/blog
- 部署平台: Vercel
- 部署状态: ✅ 已上线

## ✨ 主要特性

- 🚀 **Next.js 14** - 使用最新的 App Router 和 React Server Components
- 📝 **Markdown 支持** - 使用 Markdown 格式编写博客文章
- 🎨 **Tailwind CSS** - 现代化的响应式设计
- 🌓 **深色模式** - 支持明暗主题切换,自动保存用户偏好
- 💻 **代码高亮** - 使用 Highlight.js 实现多语言代码高亮
- 🎵 **音乐播放器** - 内置音乐播放器,可播放背景音乐
- 🔗 **友情链接** - 精美的友链页面,展示好友网站
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

## 🚀 本地开发

### 环境要求

- Node.js 18.17+
- npm

### 快速开始

```bash
# 克隆项目
git clone https://github.com/1213722170/blog.git
cd blog

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

访问 http://localhost:3000 查看效果

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
│   ├── friends/           # 友链页面
│   │   └── page.tsx
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
├── FRIENDS-GUIDE.md      # 友链页面使用指南
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

## 🔗 友链页面使用

博客内置了精美的友情链接页面,用于展示好友的网站。

### 添加友链

1. 编辑 `app/friends/page.tsx` 文件
2. 在 `friends` 数组中添加友链信息:

```typescript
{
  name: "好友名称",
  avatar: "/avatars/friend.jpg",  // 或使用在线图片 URL
  link: "https://friend-website.com",
  description: "网站描述",
}
```

### 页面特性

- 🖼️ 支持显示头像图片
- 🔗 点击跳转到对应网站(新标签页)
- 📝 显示网站名称和描述
- 🎨 悬停动画效果
- 📱 响应式卡片布局
- 🌓 深色模式适配

详细使用说明请查看 [FRIENDS-GUIDE.md](./FRIENDS-GUIDE.md)

## 🛠️ 部署

### 已部署到 Vercel ✅

项目已成功部署,推送代码到 GitHub 即可自动更新:

```bash
git add .
git commit -m "更新内容"
git push
```

查看部署状态: https://vercel.com/dashboard

### 其他部署方案

详见 [`DEPLOYMENT.md`](./DEPLOYMENT.md) 了解更多部署选项

## 🔧 常见问题

### 文章不显示?
- 确保文件以 `.md` 结尾并放在 `posts/` 目录
- 检查 Front Matter 格式是否正确

### 构建失败?
```bash
rm -rf node_modules .next
npm install
npm run build
```

### 网站访问慢?
国内访问 Vercel 可能较慢,可配置 CDN 或使用代理

更多问题查看项目 Issues 或联系作者



## 📚 相关文档

- 📖 [部署指南](./DEPLOYMENT.md) - 详细的多平台部署教程
- 📖 [GitHub 上传指南](./GITHUB-UPLOAD-GUIDE.md) - Git 使用完整教程
- 📖 [音乐播放器说明](./MUSIC-PLAYER.md) - 音乐播放器功能介绍
- 📖 [友链页面指南](./FRIENDS-GUIDE.md) - 友情链接使用教程

## 📄 许可证

MIT License - 你可以自由使用、修改和分发这个项目。



## 📧 联系方式

如有问题或建议,欢迎联系:

- GitHub: [@1213722170](https://github.com/1213722170)
- 项目仓库: https://github.com/1213722170/blog
- Email: 1213722171@qq.com

## 🙏 致谢

感谢以下开源项目:

- [Next.js](https://nextjs.org/) - React 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Highlight.js](https://highlightjs.org/) - 代码高亮
- [React Markdown](https://github.com/remarkjs/react-markdown) - Markdown 渲染
- [Vercel](https://vercel.com/) - 部署平台



---

**享受写作的乐趣!** ✍️

*Built with ❤️ using Next.js 14*
