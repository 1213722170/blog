// TypeScript 类型定义

export type AnimationStage = 0 | 1 | 2 | 3 | 4;

export interface AnimationState {
  currentStage: AnimationStage;
  isPlaying: boolean;
  isSkipped: boolean;
}

export interface OpeningAnimationProps {
  onComplete?: () => void;
  children: React.ReactNode;
}

export interface AnimationStageProps {
  isActive: boolean;
  onComplete: () => void;
}

export interface SkipButtonProps {
  onClick: () => void;
  visible: boolean;
}

export interface ElementPosition {
  x: number;
  y: number;
  scale: number;
  opacity: number;
  rotation?: number;
}

export interface SceneElements {
  leftPineTree: ElementPosition;
  rightPineTree: ElementPosition;
  pavilion: ElementPosition;
  mountains: ElementPosition;
  lotus: ElementPosition & {
    petalRotations: number[];
  };
  titleText: ElementPosition;
}
