// 动画配置

export const ANIMATION_CONFIG = {
  totalDuration: 4000, // 总时长约4秒
  stages: {
    stage1: {
      duration: 800, // 0.8秒
      easing: 'easeOut' as const,
      pineTrees: {
        leftOffset: -200, // px
        rightOffset: 200, // px
      },
    },
    stage2: {
      duration: 1000, // 1秒
      holdDuration: 300, // 0.3秒停留
      easing: 'easeInOut' as const,
      pavilion: {
        targetY: 60, // vh
      },
      lotus: {
        initialScale: 0.3,
        finalScale: 1,
      },
      title: {
        fadeInDelay: 700, // 0.7秒后淡入
        fadeInDuration: 300, // 0.3秒淡入
      },
    },
    stage3: {
      duration: 800, // 0.8秒
      easing: 'easeOut' as const,
      lotus: {
        petalLayers: 3,
        glowIntensity: 0.6,
      },
    },
    stage4: {
      duration: 1100, // 1.1秒
      easing: 'easeInOut' as const,
      finalScale: 0.2,
      fadeOutDelay: 600, // 0.6秒后开始淡出
    },
  },
} as const;

// Framer Motion 动画变体

// 松树移动动画（0.8秒）
export const pineTreeVariants = {
  initial: { x: 0, opacity: 0.8 },
  animate: (direction: 'left' | 'right') => ({
    x: direction === 'left' ? ANIMATION_CONFIG.stages.stage1.pineTrees.leftOffset : ANIMATION_CONFIG.stages.stage1.pineTrees.rightOffset,
    opacity: 0.6,
    transition: {
      duration: ANIMATION_CONFIG.stages.stage1.duration / 1000,
      ease: ANIMATION_CONFIG.stages.stage1.easing,
    },
  }),
};

// 楼房下移动画 - 从中心移动到底部
export const pavilionVariants = {
  initial: { 
    top: '50%',
    bottom: 'auto',
    y: '-50%'
  },
  animate: {
    top: 'auto',
    bottom: '2.5rem', // 对应 bottom-10 (2.5rem = 40px)
    y: 0,
    transition: {
      duration: ANIMATION_CONFIG.stages.stage2.duration / 1000,
      ease: ANIMATION_CONFIG.stages.stage2.easing,
    },
  },
};

// 莲花淡入动画 - 从小到正常大小
export const lotusAppearVariants = {
  initial: {
    scale: 0.3,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: ANIMATION_CONFIG.stages.stage2.duration / 1000,
      ease: ANIMATION_CONFIG.stages.stage2.easing,
    },
  },
};

// 标题文字淡入动画
export const titleVariants = {
  initial: { opacity: 0, y: -20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      delay: ANIMATION_CONFIG.stages.stage2.title.fadeInDelay / 1000,
      duration: ANIMATION_CONFIG.stages.stage2.title.fadeInDuration / 1000,
      ease: 'easeOut' as const,
    },
  },
};

// 莲花绽放动画（0.8秒）
export const lotusBloomVariants = {
  closed: {
    scale: 0.3,
    opacity: 0,
  },
  blooming: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: ANIMATION_CONFIG.stages.stage3.duration / 1000,
      ease: ANIMATION_CONFIG.stages.stage3.easing,
    },
  },
  bloomed: {
    scale: 1.1,
    filter: `drop-shadow(0 0 20px rgba(255, 182, 193, ${ANIMATION_CONFIG.stages.stage3.lotus.glowIntensity}))`,
    transition: {
      duration: 0.3,
    },
  },
};

// 场景缩小动画
export const sceneScaleVariants = {
  initial: { scale: 1, opacity: 1 },
  shrink: {
    scale: ANIMATION_CONFIG.stages.stage4.finalScale,
    opacity: 0,
    transition: {
      duration: ANIMATION_CONFIG.stages.stage4.duration / 1000,
      ease: ANIMATION_CONFIG.stages.stage4.easing,
    },
  },
};

// 主界面淡入动画
export const mainInterfaceVariants = {
  initial: { opacity: 0 },
  fadeIn: {
    opacity: 1,
    transition: {
      duration: ANIMATION_CONFIG.stages.stage4.duration / 1000,
      ease: 'easeIn',
    },
  },
};
