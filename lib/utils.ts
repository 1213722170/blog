export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// 获取资源路径，自动处理 basePath
// 在客户端使用，通过检测 URL 来判断是否需要 basePath
export function getAssetPath(path: string): string {
  // 如果是浏览器环境，检查当前 URL
  if (typeof window !== 'undefined') {
    const basePath = window.location.pathname.startsWith('/blog') ? '/blog' : '';
    return `${basePath}${path}`;
  }
  // 服务端渲染时使用环境变量
  const basePath = process.env.NODE_ENV === 'production' ? '/blog' : '';
  return `${basePath}${path}`;
}
