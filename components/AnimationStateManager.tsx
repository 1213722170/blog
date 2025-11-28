'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * 管理动画播放状态
 * 当离开首页时清除动画标记，这样回到首页时动画会再次播放
 */
export function AnimationStateManager() {
  const pathname = usePathname();

  useEffect(() => {
    // 当离开首页时，清除动画播放标记
    if (pathname !== '/') {
      sessionStorage.removeItem('animationPlayed');
    }
  }, [pathname]);

  return null;
}
