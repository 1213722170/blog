'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AnimationController } from './AnimationController';
import { SkipButton } from './SkipButton';
import { Stage1PineTrees } from './stages/Stage1PineTrees';
import { Stage2PavilionMove } from './stages/Stage2PavilionMove';
import { Stage3LotusBloom } from './stages/Stage3LotusBloom';
import { Stage4ScaleDown } from './stages/Stage4ScaleDown';
import { prefersReducedMotion } from './utils';
import type { OpeningAnimationProps } from './types';

export function OpeningAnimation({ onComplete, children }: OpeningAnimationProps) {
  const [showAnimation, setShowAnimation] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // 检查用户是否偏好减少动画
    if (prefersReducedMotion()) {
      setShowAnimation(false);
      onComplete?.();
      return;
    }

    setIsReady(true);
  }, [onComplete]);

  const handleComplete = () => {
    setShowAnimation(false);
    onComplete?.();
  };

  if (!isReady || !showAnimation) {
    return <>{children}</>;
  }

  return (
    <>
      <AnimationController onComplete={handleComplete}>
        {(state, handlers) => (
          <AnimatePresence mode="wait">
            {state.isPlaying && (
              <motion.div
                className="fixed inset-0 z-50 overflow-hidden"
                role="presentation"
                aria-label="网站开场动画"
                aria-live="polite"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* 动画容器 */}
                <div className="relative w-full h-full bg-gradient-to-b from-sky-100 to-pink-100 dark:from-slate-900 dark:to-slate-800">
                  {/* 各阶段组件 */}
                  <Stage1PineTrees
                    isActive={state.currentStage === 1}
                    onComplete={handlers.handleStageComplete}
                  />
                  <Stage2PavilionMove
                    isActive={state.currentStage === 2}
                    onComplete={handlers.handleStageComplete}
                  />
                  <Stage3LotusBloom
                    isActive={state.currentStage === 3}
                    onComplete={handlers.handleStageComplete}
                  />
                  <Stage4ScaleDown
                    isActive={state.currentStage === 4}
                    onComplete={handlers.handleStageComplete}
                  />

                  {/* 跳过按钮 */}
                  <SkipButton onClick={handlers.skipAnimation} visible={state.isPlaying} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </AnimationController>

      {/* 主界面内容 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showAnimation ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </>
  );
}
