/** @type {import('next').NextConfig} */
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH || '').trim().replace(/^\/+|\/+$/g, '');
module.exports = {
  reactStrictMode: true,
  // Keep hot-reload chunks separate from static production builds.
  distDir: process.env.NODE_ENV === 'development' ? '.next-dev' : '.next',
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: basePath ? '/' + basePath : '',
  // Identical build-time value on the server and in the browser.
  env: { NEXT_PUBLIC_BASE_PATH: basePath ? '/' + basePath : '' },
};
