/** @type {import('next').NextConfig} */

// 判断是否为生产环境部署
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  reactStrictMode: true,
  
  // GitHub Pages 部署配置
  output: 'export',  // 启用静态导出
  
  // 图片配置 - GitHub Pages 不支持 Next.js 图片优化
  images: {
    unoptimized: true,
  },
  
  // 如果你的仓库名是 blog（不是 username.github.io），需要设置 basePath
  // 本地开发时自动禁用，生产环境自动启用
  ...(isProd && {
    basePath: '/blog',
    assetPrefix: '/blog',
  }),
};

module.exports = nextConfig;
