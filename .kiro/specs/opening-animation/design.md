# 设计文档

## 概述

本设计文档描述了博客网站开场动画系统的技术实现方案。该系统将创建一个多阶段的中国风动画序列，包含松树分离、楼房下移、莲花绽放和场景缩小四个主要阶段，最终平滑过渡到网站主界面。

## 架构

### 系统架构图

```
┌─────────────────────────────────────────────────────────┐
│                    RootLayout (app/layout.tsx)          │
│  ┌───────────────────────────────────────────────────┐  │
│  │         OpeningAnimation Component                │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │      AnimationController (状态管理)         │  │  │
│  │  │  - currentStage                             │  │  │
│  │  │  - isPlaying                                │  │  │
│  │  │  - skipAnimation()                          │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  │                                                    │  │
│  │  ┌──────────────┐  ┌──────────────┐              │  │
│  │  │ Stage1       │  │ Stage2       │              │  │
│  │  │ 松树分离     │  │ 楼房下移     │              │  │
│  │  └──────────────┘  └──────────────┘              │  │
│  │                                                    │  │
│  │  ┌──────────────┐  ┌──────────────┐              │  │
│  │  │ Stage3       │  │ Stage4       │              │  │
│  │  │ 莲花绽放     │  │ 场景缩小     │              │  │
│  │  └──────────────┘  └──────────────┘              │  │
│  │                                                    │  │
│  │  ┌─────────────────────────────────────────────┐  │  │
│  │  │         SkipButton Component                │  │  │
│  │  └─────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  ┌───────────────────────────────────────────────────┐  │
│  │              Main Content (children)              │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 组件层次结构

1. **OpeningAnimation** - 顶层容器组件
   - 管理动画的整体状态和生命周期
   - 控制动画的播放、暂停和跳过
   - 协调各个阶段的转换

2. **AnimationStage** - 各阶段组件
   - Stage1PineTrees - 松树分离动画
   - Stage2PavilionMove - 楼房下移动画
   - Stage3LotusBloom - 莲花绽放动画
   - Stage4ScaleDown - 场景缩小动画

3. **SkipButton** - 跳过按钮组件
   - 固定在右下角
   - 触发跳过动画逻辑

## 组件和接口

### 1. OpeningAnimation 组件

**文件路径**: `components/OpeningAnimation.tsx`

**Props 接口**:
```typescript
interface OpeningAnimationProps {
  onComplete: () => void;  // 动画完成回调
  children: React.ReactNode;  // 主界面内容
}
```

**状态管理**:
```typescript
interface AnimationState {
  currentStage: 0 | 1 | 2 | 3 | 4;  // 0=未开始, 1-4=各阶段
  isPlaying: boolean;
  isSkipped: boolean;
}
```

**主要方法**:
- `startAnimation()` - 启动动画序列
- `skipAnimation()` - 跳过动画
- `nextStage()` - 进入下一阶段
- `handleStageComplete()` - 处理阶段完成事件

### 2. AnimationStage 组件

**通用接口**:
```typescript
interface AnimationStageProps {
  isActive: boolean;  // 是否为当前活动阶段
  onComplete: () => void;  // 阶段完成回调
}
```

**各阶段特定组件**:

#### Stage1PineTrees
- 渲染左右松树、中心楼房和背景山峰
- 执行松树向两侧移动的动画
- 持续时间: 0.8秒

#### Stage2PavilionMove
- 楼房向下移动
- 莲花从小到大淡入
- "界园"文字淡入显示
- 持续时间: 1秒 + 0.3秒停留

#### Stage3LotusBloom
- 莲花花瓣展开动画
- 粉色光晕效果
- 持续时间: 0.8秒

#### Stage4ScaleDown
- 整个场景缩小到20%
- 主界面从背景淡入
- 场景淡出
- 持续时间: 1.1秒

### 3. SkipButton 组件

**文件路径**: `components/SkipButton.tsx`

**Props 接口**:
```typescript
interface SkipButtonProps {
  onClick: () => void;
  visible: boolean;
}
```

## 数据模型

### 动画配置

```typescript
interface AnimationConfig {
  totalDuration: 4000;  // 总时长约4秒
  stages: {
    stage1: {
      duration: 800;  // 毫秒 (0.8秒)
      easing: 'ease-out';
      pineTrees: {
        leftOffset: -200;  // px
        rightOffset: 200;  // px
      };
    };
    stage2: {
      duration: 1000;  // 1秒
      holdDuration: 300;  // 0.3秒停留
      easing: 'ease-in-out';
      pavilion: {
        targetY: 60;  // vh
      };
      lotus: {
        initialScale: 0.3;
        finalScale: 1;
      };
      title: {
        fadeInDelay: 700;  // 0.7秒后淡入
        fadeInDuration: 300;  // 0.3秒淡入
      };
    };
    stage3: {
      duration: 800;  // 0.8秒
      easing: 'ease-out';
      lotus: {
        petalLayers: 3;
        glowIntensity: 0.6;
      };
    };
    stage4: {
      duration: 1100;  // 1.1秒
      easing: 'ease-in-out';
      finalScale: 0.2;
      fadeOutDelay: 600;  // 0.6秒后开始淡出
    };
  };
}
```

### 元素位置模型

```typescript
interface ElementPosition {
  x: number;  // 百分比或像素
  y: number;
  scale: number;
  opacity: number;
  rotation?: number;
}

interface SceneElements {
  leftPineTree: ElementPosition;
  rightPineTree: ElementPosition;
  pavilion: ElementPosition;
  mountains: ElementPosition;
  lotus: ElementPosition & {
    petalRotations: number[];
  };
  titleText: ElementPosition;
}
```

## 动画实现策略

### CSS 动画 vs JavaScript 动画

**使用 CSS 动画的场景**:
- 简单的位移、缩放、旋转
- 淡入淡出效果
- 优点: GPU 加速，性能更好

**使用 JavaScript 动画的场景**:
- 复杂的序列控制
- 需要精确时间控制的场景
- 动态计算的动画参数
- 使用 Framer Motion 库实现

### Framer Motion 动画配置

```typescript
// 示例：松树移动动画（0.8秒）
const pineTreeVariants = {
  initial: { x: 0, opacity: 0.8 },
  animate: (direction: 'left' | 'right') => ({
    x: direction === 'left' ? -200 : 200,
    opacity: 0.6,
    transition: {
      duration: 0.8,
      ease: 'easeOut'
    }
  })
};

// 示例：莲花绽放动画（0.8秒）
const lotusVariants = {
  closed: {
    scale: 0.3,
    opacity: 0
  },
  blooming: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: 'easeOut'
    }
  },
  bloomed: {
    scale: 1.1,
    filter: 'drop-shadow(0 0 20px rgba(255, 182, 193, 0.6))',
    transition: {
      duration: 0.3
    }
  }
};
```

## 视觉资源

### SVG 元素设计

所有视觉元素使用 SVG 格式以确保清晰度和可缩放性：

1. **松树 (PineTree.svg)**
   - 中国传统松树造型
   - 深绿色渐变
   - 尺寸: 约 300x400px

2. **粉色楼房 (PinkPavilion.svg)**
   - 多层中国传统建筑
   - 粉红色主色调，青色屋顶
   - 尺寸: 约 400x500px

3. **山峰 (Mountains.svg)**
   - 水墨风格山峰轮廓
   - 青蓝色渐变
   - 尺寸: 全宽，高度约 300px

4. **莲花 (Lotus.svg)**
   - 多层花瓣结构
   - 粉色渐变
   - 组件化设计，支持动画
   - 尺寸: 约 200x200px

5. **界园文字 (TitleText.svg)**
   - 优雅的中文书法字体
   - 描边和填充效果
   - 尺寸: 约 300x150px

### 颜色方案

```css
:root {
  /* 主色调 */
  --animation-pink: #FFB6C1;
  --animation-pink-light: #FFC0CB;
  --animation-pink-dark: #FF69B4;
  
  /* 辅助色 */
  --animation-cyan: #00CED1;
  --animation-green: #2F4F4F;
  --animation-blue: #87CEEB;
  
  /* 背景 */
  --animation-bg-light: rgba(240, 249, 255, 0.95);
  --animation-bg-dark: rgba(15, 23, 42, 0.95);
  
  /* 光效 */
  --glow-pink: rgba(255, 182, 193, 0.6);
  --glow-white: rgba(255, 255, 255, 0.8);
}
```

## 错误处理

### 资源加载失败

```typescript
const handleResourceError = (resourceName: string) => {
  console.error(`Failed to load ${resourceName}`);
  // 降级方案：使用简化版动画或直接跳过
  skipAnimation();
};
```

### 性能检测

```typescript
const checkPerformance = () => {
  const fps = measureFPS();
  if (fps < 30) {
    // 降低动画复杂度
    setSimplifiedMode(true);
  }
  if (fps < 20) {
    // 直接跳过动画
    skipAnimation();
  }
};
```

### 移动设备适配

```typescript
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  ) || window.innerWidth < 768;
};

// 移动设备使用简化版动画
if (isMobile()) {
  // 减少动画元素
  // 缩短动画时间
  // 降低视觉效果复杂度
}
```

## 测试策略

### 单元测试

测试各个组件的独立功能：
- 动画状态管理逻辑
- 阶段转换逻辑
- 跳过功能
- 回调函数触发

### 集成测试

测试组件间的协作：
- 完整动画序列播放
- 阶段间的平滑过渡
- 跳过按钮与动画系统的交互

### 视觉回归测试

使用截图对比确保视觉一致性：
- 各阶段的关键帧截图
- 不同屏幕尺寸下的表现
- 深色模式下的显示效果

### 性能测试

- 动画帧率监控
- 内存使用情况
- 不同设备上的表现

## 可访问性考虑

### 动画偏好

```typescript
// 尊重用户的动画偏好设置
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches;

if (prefersReducedMotion) {
  // 跳过动画或使用极简版本
  skipAnimation();
}
```

### 键盘导航

- 支持 ESC 键跳过动画
- 跳过按钮可通过 Tab 键聚焦

### 屏幕阅读器

```typescript
// 为动画容器添加 ARIA 属性
<div
  role="presentation"
  aria-label="网站开场动画"
  aria-live="polite"
>
```

## 实现优先级

### 第一阶段（MVP）
1. 基础动画框架和状态管理
2. 四个主要动画阶段的实现
3. 跳过按钮功能
4. 基本的响应式适配

### 第二阶段（增强）
1. 视觉效果优化（光晕、粒子等）
2. 性能监控和自动降级
3. 深色模式支持
4. 移动设备优化

### 第三阶段（完善）
1. 可访问性增强
2. 详细的错误处理
3. 完整的测试覆盖
4. 性能优化和代码分割

## 技术栈

- **React 18+** - 组件框架
- **Next.js 14+** - 应用框架
- **TypeScript** - 类型安全
- **Framer Motion** - 动画库
- **Tailwind CSS** - 样式框架
- **SVG** - 矢量图形

## 文件结构

```
components/
├── OpeningAnimation/
│   ├── index.tsx                 # 主组件
│   ├── AnimationController.tsx   # 状态管理
│   ├── stages/
│   │   ├── Stage1PineTrees.tsx
│   │   ├── Stage2PavilionMove.tsx
│   │   ├── Stage3LotusBloom.tsx
│   │   └── Stage4ScaleDown.tsx
│   ├── SkipButton.tsx
│   ├── assets/
│   │   ├── PineTree.svg
│   │   ├── PinkPavilion.svg
│   │   ├── Mountains.svg
│   │   ├── Lotus.svg
│   │   └── TitleText.svg
│   ├── animations.ts             # 动画配置
│   ├── types.ts                  # TypeScript 类型定义
│   └── utils.ts                  # 工具函数
│
app/
├── layout.tsx                    # 集成 OpeningAnimation
└── globals.css                   # 全局样式和动画 CSS
```

## 性能优化

### 代码分割

```typescript
// 动态导入动画组件
const OpeningAnimation = dynamic(
  () => import('@/components/OpeningAnimation'),
  { ssr: false }  // 客户端渲染
);
```

### 资源预加载

```typescript
// 预加载 SVG 资源
useEffect(() => {
  const preloadImages = [
    '/assets/PineTree.svg',
    '/assets/PinkPavilion.svg',
    '/assets/Mountains.svg',
    '/assets/Lotus.svg',
    '/assets/TitleText.svg'
  ];
  
  preloadImages.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}, []);
```

### GPU 加速

```css
/* 使用 transform 和 opacity 触发 GPU 加速 */
.animated-element {
  will-change: transform, opacity;
  transform: translateZ(0);
}
```

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

对于不支持的浏览器，自动跳过动画直接显示主界面。
