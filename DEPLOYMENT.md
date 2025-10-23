# 博客部署指南

本文档详细介绍如何将你的 Next.js 博客部署到各种服务器和平台上。

## 📋 目录

- [部署前准备](#部署前准备)
- [方案一: Vercel 部署(最简单推荐)](#方案一-vercel-部署最简单推荐)
- [方案二: 自己的服务器部署](#方案二-自己的服务器部署)
- [方案三: Docker 容器化部署](#方案三-docker-容器化部署)
- [方案四: Netlify 部署](#方案四-netlify-部署)
- [方案五: Railway 部署](#方案五-railway-部署)
- [常见问题解决](#常见问题解决)

---

## 部署前准备

### 1. 确保项目正常运行

在本地测试构建:

```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 测试生产版本
npm run start
```

访问 http://localhost:3000 确认无错误。

### 2. 代码托管(推荐)

将代码上传到 Git 仓库(GitHub、GitLab 或 Gitee):

```bash
# 初始化 Git(如果还没有)
git init

# 创建 .gitignore 文件
echo "node_modules
.next
.env.local
.DS_Store" > .gitignore

# 提交代码
git add .
git commit -m "Initial commit"

# 关联远程仓库并推送
git remote add origin <你的仓库地址>
git branch -M main
git push -u origin main
```

---

## 方案一: Vercel 部署(最简单推荐)

**优点**: 
- ✅ 专为 Next.js 优化,零配置
- ✅ 自动 HTTPS
- ✅ 全球 CDN 加速
- ✅ 免费额度充足
- ✅ 自动部署(Git push 即部署)

### 步骤:

#### 1. 注册 Vercel 账号

访问 https://vercel.com 并使用 GitHub 账号登录。

#### 2. 导入项目

- 点击 "Add New Project"
- 选择你的 GitHub 仓库
- Vercel 会自动检测到 Next.js 项目

#### 3. 配置部署(通常保持默认即可)

- **Framework Preset**: Next.js
- **Build Command**: `npm run build`
- **Output Directory**: `.next`
- **Install Command**: `npm install`

#### 4. 点击 "Deploy"

等待几分钟,部署完成后会得到一个免费域名,如: `your-blog.vercel.app`

#### 5. 配置自定义域名(可选)

- 在 Vercel 项目设置中点击 "Domains"
- 添加你的域名
- 按照提示配置 DNS 记录

### 环境变量配置

如果需要环境变量:
1. 在 Vercel 项目设置中找到 "Environment Variables"
2. 添加变量名和值
3. 重新部署

---

## 方案二: 自己的服务器部署

**适用于**: 有自己的 VPS 或云服务器(阿里云、腾讯云、AWS 等)

### 环境要求

- Node.js 18.17+ 
- PM2(进程管理器)
- Nginx(可选,用于反向代理)

### 方法 A: 使用 PM2 部署

#### 1. 连接到服务器

```bash
ssh user@your-server-ip
```

#### 2. 安装 Node.js

```bash
# 使用 nvm 安装 Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

#### 3. 安装 PM2

```bash
npm install -g pm2
```

#### 4. 上传项目代码

方法一 - 使用 Git:
```bash
cd /var/www
git clone <你的仓库地址> my-blog
cd my-blog
```

方法二 - 使用 SCP/SFTP 上传项目文件夹

#### 5. 安装依赖并构建

```bash
npm install
npm run build
```

#### 6. 使用 PM2 启动应用

```bash
# 启动应用
pm2 start npm --name "my-blog" -- start

# 设置开机自启
pm2 startup
pm2 save
```

#### 7. PM2 常用命令

```bash
# 查看运行状态
pm2 list

# 查看日志
pm2 logs my-blog

# 重启应用
pm2 restart my-blog

# 停止应用
pm2 stop my-blog

# 删除应用
pm2 delete my-blog
```

### 方法 B: 配置 Nginx 反向代理(推荐)

#### 1. 安装 Nginx

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx

# CentOS
sudo yum install nginx
```

#### 2. 创建 Nginx 配置文件

```bash
sudo nano /etc/nginx/sites-available/my-blog
```

添加以下配置:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 3. 启用配置

```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/my-blog /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

#### 4. 配置 HTTPS(使用 Let's Encrypt)

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取 SSL 证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

### 更新部署

```bash
cd /var/www/my-blog
git pull
npm install
npm run build
pm2 restart my-blog
```

---

## 方案三: Docker 容器化部署

**优点**: 环境一致、易于迁移、便于管理

### 1. 创建 Dockerfile

在项目根目录创建 `Dockerfile`:

```dockerfile
# 使用官方 Node.js 镜像
FROM node:18-alpine AS base

# 安装依赖阶段
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# 构建阶段
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# 运行阶段
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

### 2. 修改 next.config.js

添加 standalone 输出配置:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // 添加这一行
};

module.exports = nextConfig;
```

### 3. 创建 .dockerignore

```
node_modules
.next
.git
.gitignore
README.md
npm-debug.log
.DS_Store
.env.local
```

### 4. 构建 Docker 镜像

```bash
docker build -t my-blog .
```

### 5. 运行容器

```bash
docker run -d -p 3000:3000 --name my-blog my-blog
```

### 6. 使用 Docker Compose(推荐)

创建 `docker-compose.yml`:

```yaml
version: '3.8'

services:
  blog:
    build: .
    ports:
      - "3000:3000"
    restart: unless-stopped
    environment:
      - NODE_ENV=production
```

启动:
```bash
docker-compose up -d
```

### 7. Docker 常用命令

```bash
# 查看运行中的容器
docker ps

# 查看日志
docker logs my-blog

# 停止容器
docker stop my-blog

# 启动容器
docker start my-blog

# 重启容器
docker restart my-blog

# 删除容器
docker rm my-blog
```

---

## 方案四: Netlify 部署

### 步骤:

#### 1. 注册 Netlify

访问 https://netlify.com 并注册账号

#### 2. 连接 Git 仓库

- 点击 "Add new site" → "Import an existing project"
- 选择 GitHub 并授权
- 选择你的博客仓库

#### 3. 配置构建设置

- **Build command**: `npm run build`
- **Publish directory**: `.next`

#### 4. 部署

点击 "Deploy site",等待部署完成

#### 5. 配置自定义域名

在 "Domain settings" 中添加你的域名

---

## 方案五: Railway 部署

### 步骤:

#### 1. 访问 Railway

https://railway.app 并使用 GitHub 登录

#### 2. 创建新项目

- 点击 "New Project"
- 选择 "Deploy from GitHub repo"
- 选择你的博客仓库

#### 3. 自动检测和部署

Railway 会自动检测 Next.js 项目并开始部署

#### 4. 配置域名

在项目设置中添加自定义域名

---

## 常见问题解决

### 1. 端口被占用

```bash
# 查找占用端口的进程
lsof -i :3000
# 或
netstat -ano | findstr :3000

# 杀死进程
kill -9 <PID>
```

### 2. 权限问题

```bash
# 给予执行权限
chmod +x node_modules/.bin/next

# 修改文件所有者
sudo chown -R $USER:$USER /var/www/my-blog
```

### 3. 内存不足

在 `package.json` 中修改构建命令:

```json
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=4096' next build"
  }
}
```

### 4. 构建失败

```bash
# 清理缓存
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### 5. 静态资源 404

检查 `next.config.js` 中的 basePath 配置:

```javascript
const nextConfig = {
  basePath: '', // 确保为空或正确配置
  assetPrefix: '', // 如果使用 CDN 则配置
};
```

### 6. 环境变量不生效

确保环境变量名以 `NEXT_PUBLIC_` 开头(如果需要在客户端使用):

```bash
# .env.local
NEXT_PUBLIC_API_URL=https://api.example.com
```

### 7. 服务器重启后应用停止

使用 PM2 并设置开机自启:

```bash
pm2 startup
pm2 save
```

---

## 部署检查清单

部署后请检查以下项目:

- [ ] 网站可以正常访问
- [ ] 所有页面都能正常加载
- [ ] 文章列表和详情页正常显示
- [ ] 深色模式切换正常
- [ ] 音乐播放器正常工作(如果有音乐文件)
- [ ] 移动端显示正常
- [ ] HTTPS 证书有效
- [ ] 自定义域名解析正确
- [ ] SEO 元数据正确显示

---

## 性能优化建议

### 1. 启用 CDN

- 使用 Vercel/Netlify 自带 CDN
- 或配置 Cloudflare CDN

### 2. 图片优化

使用 Next.js Image 组件:

```typescript
import Image from 'next/image';

<Image src="/photo.jpg" alt="Photo" width={500} height={300} />
```

### 3. 启用压缩

在 Nginx 配置中启用 gzip:

```nginx
gzip on;
gzip_vary on;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
```

---

## 监控和日志

### 使用 PM2 监控

```bash
# 实时监控
pm2 monit

# 查看详细信息
pm2 show my-blog
```

### 集成分析工具

推荐使用:
- **Google Analytics** - 访问统计
- **Vercel Analytics** - 性能分析
- **Sentry** - 错误监控

---

## 总结

| 部署方案 | 难度 | 成本 | 性能 | 推荐度 |
|---------|------|------|------|--------|
| Vercel | ⭐ | 免费 | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| 自己服务器 | ⭐⭐⭐⭐ | 低-中 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Docker | ⭐⭐⭐ | 低-中 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Netlify | ⭐⭐ | 免费 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |
| Railway | ⭐ | 免费起 | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ |

**建议**:
- 🥇 **新手**: 选择 Vercel 或 Railway
- 🥈 **有服务器**: 使用 Docker + Nginx
- 🥉 **需要控制**: 自己服务器 + PM2

---

祝你部署顺利! 🚀

如有问题,欢迎查阅 Next.js 官方文档: https://nextjs.org/docs/deployment
