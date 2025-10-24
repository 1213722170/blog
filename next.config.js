/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // GitHub Pages 部署配置
  output: 'export',  // 启用静态导出
  
  // 图片配置 - GitHub Pages 不支持 Next.js 图片优化
  images: {
    unoptimized: true,
  },
  
  // 如果你的仓库名是 blog（不是 username.github.io），需要设置 basePath
  basePath: '/blog',
  
  // 资源路径前缀（与 basePath 保持一致）
  assetPrefix: '/blog',
};

module.exports = nextConfig;
