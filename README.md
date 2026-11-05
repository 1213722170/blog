# 刘澈的博客

基于 Next.js 14、React、TypeScript 和 Tailwind CSS 的静态个人博客。以 Markdown 保存文章，采用纸面、墨色和青绿色的阅读界面。

## 本地运行

使用 Node.js 22：

~~~powershell
npm.cmd ci
npm.cmd run dev
~~~

打开 http://localhost:3000。项目保留现有的本地写作页 /write；需要保存和上传图片时，另开终端运行：

~~~powershell
npm.cmd run write-server
~~~

写作服务默认使用端口 4317。已存在文章的专题等额外 front matter 在保存时会保留。

在写作页打开已有文章后，可点击「删除文章」。确认后文章会从本地列表移除，编辑器切换到新文章；原文备份保存在 `.posts-trash/`，配图保留。需要恢复时，将备份移回 `posts/` 并恢复原文件名。删除后重新部署，线上网站才会同步更新。

## 页面

- /：个人介绍、图片集入口、最近 6 篇文章。
- /gallery/：喜欢的图片，支持瀑布流展示、放大预览和本地多图上传。
- /topics/deep-learning/：保留旧专题地址与文章之间的阅读导航，不再作为导航栏目。
- /archives/：按年份分组，可按标签和标题、简介搜索。
- /posts/<slug>/：文章、章节目录、阅读进度、图片预览和专题上一篇 / 下一篇。
- /about/、/friends/、/write/：保留原有页面。

## 添加图片

本地启动 `npm.cmd run dev` 和 `npm.cmd run write-server`，进入「图片」页点击「添加图片」，可一次选择多张，每张不超过 10 MB。图片会保存在项目的 `public/images/gallery/` 文件夹，刷新页面仍然保留；相同图片重复上传不会重复添加。

也可以直接将 PNG、JPG、WebP、GIF 或 AVIF 文件放进该文件夹。上传的图片标题和时间保存在同目录的 `metadata.json`，直接放入的图片默认使用文件名作为标题。

重新构建、部署博客后，图片会在公开网站展示。在线访客只能浏览；上传入口只出现在本地站点。

在本地「图片」页，每张图片下方有「删除」按钮。删除后可点击提示栏中的「撤销删除」恢复最近移除的图片。原图暂存于项目根目录的 `.gallery-trash/`，不会被静态网站发布，也已排除在 Git 提交之外。删除后重新部署博客，线上图片集才会同步移除。

## 写文章

在 posts/ 新建 Markdown 文件，文件名就是文章 slug。重构没有修改已有文章的 slug。

~~~markdown
---
title: "文章标题"
date: "2026-10-20"
description: "文章简介"
tags: ["深度学习", "笔记"]
series: deep-learning
seriesOrder: 11
---

## 第一个章节

正文……
~~~

- 日期统一写为 YYYY-MM-DD；读取时兼容旧的单数字月日，缺失或无效日期会在构建时明确报错。
- series 和 seriesOrder 可选；加入深度学习专题时，使用 deep-learning 和唯一的学习顺序数字。
- draft: true 会将文章排除出公开列表和静态路由。
- 标题会自动生成唯一锚点，目录从真实渲染的章节生成。
- 阅读时间根据文字和图片数量估算。
- 本地图片放在 public/images/posts/。Markdown 可使用 /images/posts/图片.png 或 图片.png。
- 图片、音乐及其他 public 资源统一使用 lib/utils.ts 的 getAssetPath；内部页面使用 Next 的 Link，避免重复添加路径前缀。
- 不要在文章或组件中硬编码 /blog 前缀。

## 构建与部署

~~~powershell
npm.cmd test
npm.cmd run build
~~~

静态输出位于 out/，所有页面都使用目录式 URL（trailingSlash）。本地和 Vercel 默认从根路径 / 部署。

### GitHub Pages

.github/workflows/deploy.yml 已配置：

~~~text
NEXT_PUBLIC_BASE_PATH=/blog
NEXT_PUBLIC_SITE_URL=https://1213722170.github.io/blog
~~~

构建路径由 NEXT_PUBLIC_BASE_PATH 显式决定，服务端和浏览器保持一致，不再根据 NODE_ENV 或域名猜测。

在 PowerShell 本地验证相同构建：

~~~powershell
$env:NEXT_PUBLIC_BASE_PATH = "/blog"
$env:NEXT_PUBLIC_SITE_URL = "https://1213722170.github.io/blog"
npm.cmd run build
~~~

### Vercel 或独立域名

项目根目录设置为 my-blog，构建命令为 npm run build，输出目录为 out。NEXT_PUBLIC_BASE_PATH 留空；NEXT_PUBLIC_SITE_URL 设置为实际站点地址。

不要复用 GitHub Pages 的 out 构建产物到根路径站点；各部署目标应带各自配置重新构建。

## 修改外观与站点信息

- lib/site.ts：名称、作者、描述及深度学习专题信息。
- app/globals.css：纸面颜色、文字、排版、响应式和深浅主题。
- components/Header.tsx：导航。
- components/MusicPlayer.tsx：播放列表；默认收起，用户主动播放。

原开场动画组件与资源仍保留在仓库中；新的全站布局不再自动播放开场、云朵和花瓣动画。

## 验证

npm test 检查日期有效性、真实时间排序、专题顺序、旧 slug 及根路径 / 子路径配置。npm run build 执行 Next 的生产编译、类型检查、lint 和静态导出。
