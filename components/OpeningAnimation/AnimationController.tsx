'use client';

import { useState, useCallback, useEffect } from 'react';
import type { AnimationState, AnimationStage } from './types';

interface AnimationControllerProps {
  onComplete: () => void;
  children: (state: AnimationState, handlers: AnimationHandlers) => React.ReactNode;
}

export interface AnimationHandlers {
  nextStage: () => void;
  skipAnimation: () => void;
  handleStageComplete: () => void;
}

export function AnimationController({ onComplete, children }: AnimationControllerProps) {
  const [state, setState] = useState<AnimationState>({
    currentStage: 1, // 从第1阶段开始
    isPlaying: true,
    isSkipped: false,
  });

  // 进入下一阶段
  const nextStage = useCallback(() => {
    setState((prev) => {
      if (prev.currentStage >= 4) {
        return prev;
      }
      return {
        ...prev,
        currentStage: (prev.currentStage + 1) as AnimationStage,
      };
    });
  }, []);

  // 跳过动画
  const skipAnimation = useCallback(() => {
    setState({
      currentStage: 0,
      isPlaying: false,
      isSkipped: true,
    });
    // 延迟调用完成回调，给淡出动画时间
    setTimeout(() => {
      onComplete();
    }, 300);
  }, [onComplete]);

  // 处理阶段完成
  const handleStageComplete = useCallback(() => {
    if (state.currentStage >= 4) {
      // 所有阶段完成
      setState((prev) => ({
        ...prev,
        isPlaying: false,
      }));
      onComplete();
    } else {
      // 进入下一阶段
      nextStage();
    }
  }, [state.currentStage, nextStage, onComplete]);

  // 键盘事件：ESC 键跳过动画
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.isPlaying) {
        skipAnimation();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.isPlaying, skipAnimation]);

  const handlers: AnimationHandlers = {
    nextStage,
    skipAnimation,
    handleStageComplete,
  };

  return <>{children(state, handlers)}</>;
}
