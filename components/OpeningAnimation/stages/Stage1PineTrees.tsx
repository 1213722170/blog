'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { pineTreeVariants, ANIMATION_CONFIG } from '../animations';
import type { AnimationStageProps } from '../types';
import Image from 'next/image';
import { getAssetPath } from '../utils';

export function Stage1PineTrees({ isActive, onComplete }: AnimationStageProps) {
  useEffect(() => {
    if (isActive) {
      const timer = setTimeout(() => {
        onComplete();
      }, ANIMATION_CONFIG.stages.stage1.duration);

      return () => clearTimeout(timer);
    }
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {/* 背景山峰 - 始终可见 */}
      <div className="absolute inset-0 flex items-end justify-center">
        <img
          src={getAssetPath('/assets/opening-animation/Mountains.svg')}
          alt="Mountains"
          className="w-full h-auto opacity-60"
          style={{ maxHeight: '40%' }}
        />
      </div>

      {/* 左侧松树 - 从中心向左移动 */}
      <motion.div
        className="absolute z-20"
        style={{ left: '50%', top: '50%' }}
        initial={{ x: '-50%', y: '-50%' }}
        animate={{ x: '-350%', y: '-50%' }}
        transition={{
          duration: ANIMATION_CONFIG.stages.stage1.duration / 1000,
          ease: 'easeOut',
        }}
      >
        <img
          src={getAssetPath('/assets/opening-animation/PineTree.svg')}
          alt="Left Pine Tree"
          className="w-96 h-128"
          style={{ width: '24rem', height: '32rem' }}
        />
      </motion.div>

      {/* 中心粉色楼房 - 从小放大并下移到底部，水平方向始终居中 */}
      <motion.div
        className="absolute z-10"
        style={{ 
          left: '50%',
          bottom: '-1rem'
        }}
        initial={{ 
          x: '-50%',
          y: '-40vh',
          scale: 0.5,
          opacity: 0.3
        }}
        animate={{ 
          x: '-50%',
          y: 0,
          scale: 1,
          opacity: 1
        }}
        transition={{
          duration: ANIMATION_CONFIG.stages.stage1.duration / 1000,
          ease: 'easeOut',
        }}
      >
        <img
          src={getAssetPath('/assets/opening-animation/PinkPavilion.svg')}
          alt="Pink Pavilion"
          className="w-128 h-160"
          style={{ width: '32rem', height: '40rem' }}
        />
      </motion.div>

      {/* 右侧松树 - 从中心向右移动 */}
      <motion.div
        className="absolute z-20"
        style={{ left: '50%', top: '50%' }}
        initial={{ x: '-50%', y: '-50%' }}
        animate={{ x: '250%', y: '-50%' }}
        transition={{
          duration: ANIMATION_CONFIG.stages.stage1.duration / 1000,
          ease: 'easeOut',
        }}
      >
        <img
          src={getAssetPath('/assets/opening-animation/PineTree.svg')}
          alt="Right Pine Tree"
          className="w-96 h-128"
          style={{ width: '24rem', height: '32rem' }}
        />
      </motion.div>
    </div>
  );
}
