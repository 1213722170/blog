// 工具函数

/**
 * 检测是否为移动设备
 */
export const isMobile = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return (
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768
  );
};

/**
 * 检测用户是否偏好减少动画
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * 测量当前帧率
 */
export const measureFPS = (): Promise<number> => {
  return new Promise((resolve) => {
    let lastTime = performance.now();
    let frames = 0;
    const duration = 1000; // 测量1秒

    const measureFrame = (currentTime: number) => {
      frames++;
      const elapsed = currentTime - lastTime;

      if (elapsed >= duration) {
        const fps = Math.round((frames * 1000) / elapsed);
        resolve(fps);
      } else {
        requestAnimationFrame(measureFrame);
      }
    };

    requestAnimationFrame(measureFrame);
  });
};

/**
 * 预加载图片资源
 */
export const preloadImages = (imagePaths: string[]): Promise<void[]> => {
  const promises = imagePaths.map((src) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  });

  return Promise.all(promises);
};

/**
 * 检查性能并决定是否使用简化动画
 */
export const shouldUseSimplifiedAnimation = async (): Promise<boolean> => {
  // 移动设备使用简化版
  if (isMobile()) return true;

  // 用户偏好减少动画
  if (prefersReducedMotion()) return true;

  // 检测帧率
  try {
    const fps = await measureFPS();
    return fps < 30;
  } catch {
    return false;
  }
};

/**
 * 获取资源路径（考虑 basePath）
 */
export { getAssetPath } from "@/lib/utils";
