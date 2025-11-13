'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  pavilionVariants,
  lotusAppearVariants,
  titleVariants,
  ANIMATION_CONFIG,
} from '../animations';
import type { AnimationStageProps } from '../types';
import { getAssetPath } from '../utils';

export function Stage2PavilionMove({ isActive, onComplete }: AnimationStageProps) {
  useEffect(() => {
    if (isActive) {
      const totalDuration =
        ANIMATION_CONFIG.stages.stage2.duration +
        ANIMATION_CONFIG.stages.stage2.holdDuration;
      
      const timer = setTimeout(() => {
        onComplete();
      }, totalDuration);

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {/* 背景山峰 - 保持可见 */}
      <div className="absolute inset-0 flex items-end justify-center">
        <img
          src={getAssetPath('/assets/opening-animation/Mountains.svg')}
          alt="Mountains"
          className="w-full h-auto opacity-60"
          style={{ maxHeight: '40%' }}
        />
      </div>

      {/* 粉色楼房 - 保持在底部位置（与第一阶段结束位置一致） */}
      <div className="absolute" style={{ left: '50%', bottom: '-1rem', transform: 'translateX(-50%)' }}>
        <img
          src={getAssetPath('/assets/opening-animation/PinkPavilion.svg')}
          alt="Pink Pavilion"
          className="w-128 h-160"
          style={{ width: '32rem', height: '40rem' }}
        />
      </div>

      {/* 莲花 - 淡入显示，在楼房顶部上方 */}
      <motion.div
        className="absolute"
        style={{ left: '50%', bottom: 'calc(-1rem + 20rem + 2rem)' }}
        initial={{ x: '-50%', opacity: 0, scale: 0.8 }}
        animate={{ x: '-50%', opacity: 1, scale: 1 }}
        transition={{
          duration: ANIMATION_CONFIG.stages.stage2.duration / 1000,
          ease: ANIMATION_CONFIG.stages.stage2.easing,
        }}
      >
        <img
          src={getAssetPath('/assets/opening-animation/Lotus.svg')}
          alt="Lotus"
          className="w-96 h-96"
          style={{ width: '18rem', height: '18rem' }}
        />
      </motion.div>

      {/* "界园"文字 - 淡入显示，与莲花同一高度 */}
      <motion.div
        className="absolute"
        style={{ left: '50%', bottom: 'calc(-1rem + 20rem + 12rem)' }}
        initial={{ x: '-50%', opacity: 0, y: -20 }}
        animate={{ x: '-50%', opacity: 1, y: 0 }}
        transition={{
          delay: ANIMATION_CONFIG.stages.stage2.title.fadeInDelay / 1000,
          duration: ANIMATION_CONFIG.stages.stage2.title.fadeInDuration / 1000,
          ease: 'easeOut',
        }}
      >
        <img
          src={getAssetPath('/assets/opening-animation/TitleText.svg')}
          alt="界园"
          className="w-96 h-48"
          style={{
            letterSpacing: '5rem',
            filter: 'drop-shadow(0 0 10px rgba(255, 182, 193, 0.5))',
          }}
        />
      </motion.div>
    </div>
  );
}
