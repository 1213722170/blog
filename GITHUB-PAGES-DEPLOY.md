# GitHub Pages 部署指南

## 📋 为什么选择 GitHub Pages？

- ✅ **国内可直接访问**，不需要科学上网
- ✅ **完全免费**，无流量限制
- ✅ **稳定可靠**，由 GitHub 提供服务
- ✅ **自动部署**，推送代码即可更新

## 🚀 部署步骤

### 步骤 1：配置 Next.js 静态导出

#### 1.1 修改 `next.config.js`

编辑项目根目录的 `next.config.js` 文件：

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // 添加这一行，启用静态导出
  images: {
    unoptimized: true,  // GitHub Pages 不支持图片优化，需要禁用
  },
  // 如果你的仓库名不是 username.github.io，需要设置 basePath
  // basePath: '/blog',  // 取消注释并替换为你的仓库名
};

module.exports = nextConfig;
```

**重要说明**：
- 如果你的仓库名是 `1213722170.github.io`，不需要设置 `basePath`
- 如果你的仓库名是 `blog`，需要设置 `basePath: '/blog'`

#### 1.2 测试静态导出

在项目根目录执行：

```bash
cd "d:\下载\桌面\新建文件夹\my-blog"

# 构建静态文件
npm run build

# 检查是否生成了 out 目录
dir out
```

成功后会在项目根目录生成 `out` 文件夹，里面是静态 HTML 文件。

---

### 步骤 2：创建 GitHub Actions 自动部署

#### 2.1 创建工作流文件

创建文件：`.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  # 当推送到 main 分支时触发
  push:
    branches: [ main ]
  
  # 允许手动触发
  workflow_dispatch:

# 设置 GITHUB_TOKEN 的权限
permissions:
  contents: read
  pages: write
  id-token: write

# 只允许一个并发部署
concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  # 构建任务
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build with Next.js
        run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./out

  # 部署任务
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

### 步骤 3：配置 GitHub Pages

#### 3.1 推送代码到 GitHub

```bash
cd "d:\下载\桌面\新建文件夹\my-blog"

# 添加修改
git add .

# 提交
git commit -m "配置 GitHub Pages 部署"

# 推送（如果网络有问题，使用 GitHub Desktop）
git push origin main
```

#### 3.2 在 GitHub 上启用 Pages

1. **访问仓库设置**
   - 打开：https://github.com/1213722170/blog
   - 点击 "Settings"（设置）

2. **配置 Pages**
   - 左侧菜单找到 "Pages"
   - **Source**: 选择 "GitHub Actions"
   - 保存设置

3. **等待部署完成**
   - 访问 "Actions" 标签页
   - 查看部署进度
   - 等待绿色对勾 ✅

4. **获取网站地址**
   - 部署成功后，GitHub 会显示你的网站地址
   - 格式：`https://1213722170.github.io/blog/`
   - 或者：`https://1213722170.github.io/` （如果仓库名是 username.github.io）

---

### 步骤 4：访问你的网站

部署完成后，访问：

- **主页**: https://1213722170.github.io/blog/
- **关于页面**: https://1213722170.github.io/blog/about
- **友链页面**: https://1213722170.github.io/blog/friends

**在国内直接访问，不需要科学上网！** ✅

---

## 🔧 常见问题

### Q1: 样式或资源 404 错误？

**原因**: 如果仓库名不是 `username.github.io`，需要设置 `basePath`

**解决**: 在 `next.config.js` 中添加：

```javascript
basePath: '/blog',  // 替换为你的仓库名
```

然后重新构建和部署。

### Q2: 图片不显示？

**原因**: GitHub Pages 不支持 Next.js 图片优化

**解决**: 
1. 确保 `next.config.js` 中设置了 `images: { unoptimized: true }`
2. 使用本地图片时，路径要正确（如 `/avatars/friend.jpg`）

### Q3: 路由跳转有问题？

**原因**: GitHub Pages 是静态托管，不支持服务端路由

**解决**: 
- 使用 Next.js Link 组件
- 确保所有页面都已生成静态 HTML

### Q4: 如何更新网站？

非常简单：

```bash
# 1. 修改代码
# 2. 提交并推送
git add .
git commit -m "更新内容"
git push origin main

# 3. GitHub Actions 会自动部署
# 4. 等待 1-2 分钟即可
```

### Q5: 构建失败怎么办？

1. 访问仓库的 "Actions" 标签
2. 点击失败的工作流
3. 查看错误日志
4. 常见原因：
   - 依赖安装失败
   - TypeScript 类型错误
   - 配置文件错误

---

## 📊 GitHub Pages vs Vercel 对比

| 特性 | GitHub Pages | Vercel |
|------|--------------|--------|
| 国内访问 | ✅ 可直接访问 | ❌ 需要科学上网 |
| 部署速度 | ⚡ 2-3 分钟 | ⚡ 2-3 分钟 |
| 自动部署 | ✅ GitHub Actions | ✅ Git push |
| 费用 | ✅ 完全免费 | ⚠️ 免费版有限制 |
| SSR 支持 | ❌ 仅静态 | ✅ 完全支持 |
| API Routes | ❌ 不支持 | ✅ 支持 |
| 图片优化 | ❌ 不支持 | ✅ 自动优化 |
| CDN 加速 | ⚠️ 有限 | ✅ 全球 CDN |
| 自定义域名 | ✅ 支持 | ✅ 支持 |

**结论**：对于纯静态博客，GitHub Pages 更适合国内用户！

---

## 🎯 迁移方案总结

### 方案 A：完全迁移到 GitHub Pages（推荐）

**优点**：
- ✅ 解决国内访问问题
- ✅ 适合纯静态博客
- ✅ 配置简单

**步骤**：
1. 修改 `next.config.js`
2. 创建 GitHub Actions 工作流
3. 推送代码
4. 配置 GitHub Pages

### 方案 B：同时部署两个平台

**优点**：
- ✅ 国内用户访问 GitHub Pages
- ✅ 国外用户访问 Vercel（速度更快）
- ✅ 互为备份

**步骤**：
1. 按照上述步骤部署到 GitHub Pages
2. 保持 Vercel 部署不变
3. 在 README 中提供两个访问链接

---

## 🚀 快速开始

### 方式一：使用提供的配置文件（推荐）

我已经为你准备好了所有配置文件，只需要：

1. **应用配置修改**（我会帮你完成）
2. **推送到 GitHub**
3. **在 GitHub 上启用 Pages**
4. **等待部署完成**

### 方式二：手动配置

按照上述步骤逐步操作。

---

## 📝 后续维护

### 更新博客内容

```bash
# 1. 修改文章或代码
# 2. 提交推送
git add .
git commit -m "更新内容"
git push origin main

# 3. GitHub Actions 自动部署
# 4. 1-2 分钟后生效
```

### 查看部署状态

- 访问：https://github.com/1213722170/blog/actions
- 查看最新的工作流运行状态

### 回滚到之前版本

```bash
# 查看提交历史
git log --oneline

# 回滚到指定版本
git revert <commit-id>
git push origin main
```

---

## 🎨 自定义域名（可选）

如果你有自己的域名，可以绑定到 GitHub Pages：

1. **在仓库设置中添加域名**
   - Settings → Pages → Custom domain
   - 输入你的域名

2. **配置 DNS**
   - 添加 CNAME 记录指向 `1213722170.github.io`

3. **等待生效**
   - DNS 生效需要几分钟到几小时

---

## ✅ 验证清单

部署完成后，检查以下项：

- [ ] 网站可以在国内访问
- [ ] 首页正常显示
- [ ] 文章页面正常
- [ ] 友链页面正常
- [ ] 图片正常显示
- [ ] 深色模式正常切换
- [ ] 导航链接正常工作
- [ ] 音乐播放器正常（如果使用）

---

## 📞 需要帮助？

如果遇到问题：

1. 查看 GitHub Actions 构建日志
2. 检查 `next.config.js` 配置
3. 参考本文档的常见问题部分
4. 查看 Next.js 静态导出文档：https://nextjs.org/docs/app/building-your-application/deploying/static-exports

---

**准备好开始迁移了吗？** 🚀

我可以帮你：
1. 自动修改所有配置文件
2. 创建 GitHub Actions 工作流
3. 指导推送和部署流程
4. 解决可能遇到的问题
