'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { lotusBloomVariants, ANIMATION_CONFIG } from '../animations';
import type { AnimationStageProps } from '../types';
import { getAssetPath } from '../utils';

export function Stage3LotusBloom({ isActive, onComplete }: AnimationStageProps) {
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        onComplete();
      }, ANIMATION_CONFIG.stages.stage3.duration);

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {/* 背景山峰 */}
      <div className="absolute inset-0 flex items-end justify-center">
        <img
          src={getAssetPath('/assets/opening-animation/Mountains.svg')}
          alt="Mountains"
          className="w-full h-auto opacity-60"
          style={{ maxHeight: '40%' }}
        />
      </div>

      {/* 粉色楼房 - 位置与第二阶段完全一致 */}
      <div className="absolute" style={{ left: '50%', bottom: '-1rem', transform: 'translateX(-50%)' }}>
        <img
          src={getAssetPath('/assets/opening-animation/PinkPavilion.svg')}
          alt="Pink Pavilion"
          className="w-128 h-160"
          style={{ width: '32rem', height: '40rem' }}
        />
      </div>

      {/* 莲花 - 绽放动画（从花苞到花瓣展开） */}
      <div className="absolute" style={{ left: '50%', bottom: 'calc(-1rem + 20rem + 2rem)', transform: 'translateX(-50%)' }}>
        {/* 外层光晕 */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, rgba(255, 182, 193, ${ANIMATION_CONFIG.stages.stage3.lotus.glowIntensity}) 0%, transparent 70%)`,
            width: '200%',
            height: '200%',
            left: '-50%',
            top: '-50%',
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: ANIMATION_CONFIG.stages.stage3.duration / 1000,
            ease: 'easeInOut',
          }}
        />

        {/* 莲花主体 - 静态显示 */}
        <img
          src={getAssetPath('/assets/opening-animation/Lotus.svg')}
          alt="Lotus"
          className="w-96 h-96 relative z-10"
          style={{ width: '18rem', height: '18rem' }}
        />
      </div>

      {/* "界园"文字 - 位置与第二阶段一致，与莲花同一高度 */}
      <div className="absolute" style={{ left: '50%', bottom: 'calc(-1rem + 20rem + 12rem)', transform: 'translateX(-50%)' }}>
        <img
          src={getAssetPath('/assets/opening-animation/TitleText.svg')}
          alt="界园"
          className="w-96 h-48"
          style={{
            letterSpacing: '5rem',
            filter: 'drop-shadow(0 0 10px rgba(255, 182, 193, 0.5))',
          }}
        />
      </div>
    </div>
  );
}
