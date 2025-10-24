# 博客背景自定义指南

## 🎨 如何自定义博客背景

博客背景可以通过修改 `app/globals.css` 文件来实现。以下提供多种方案供你选择。

## 📁 文件位置

编辑文件：**`app/globals.css`**

---

## 🌈 方案一：纯色背景

### 1. 简单纯色

在 `globals.css` 中修改 `:root` 和 `.dark` 的 `--background` 变量：

```css
:root {
  --background: #f5f5f5;  /* 浅灰色背景 */
  --foreground: #171717;
}

.dark {
  --background: #1a1a2e;  /* 深蓝色背景 */
  --foreground: #ededed;
}
```

### 2. 流行配色方案

#### 清新绿色
```css
:root {
  --background: #f0f9ff;  /* 淡蓝色 */
  --foreground: #0f172a;
}

.dark {
  --background: #0f172a;  /* 深蓝灰 */
  --foreground: #f1f5f9;
}
```

#### 温暖米色
```css
:root {
  --background: #fef3c7;  /* 米黄色 */
  --foreground: #292524;
}

.dark {
  --background: #1c1917;  /* 深棕色 */
  --foreground: #fafaf9;
}
```

#### 优雅紫色
```css
:root {
  --background: #faf5ff;  /* 淡紫色 */
  --foreground: #1e1b4b;
}

.dark {
  --background: #1e1b4b;  /* 深紫色 */
  --foreground: #f5f3ff;
}
```

---

## 🌟 方案二：渐变背景

在 `body` 样式中添加渐变：

```css
body {
  color: var(--foreground);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: Arial, Helvetica, sans-serif;
  min-height: 100vh;
}

/* 深色模式渐变 */
.dark body {
  background: linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 100%);
}
```

### 流行渐变配色

#### 日落橙色
```css
body {
  background: linear-gradient(135deg, #ffa751 0%, #ffe259 100%);
}

.dark body {
  background: linear-gradient(135deg, #2c3e50 0%, #3498db 100%);
}
```

#### 海洋蓝色
```css
body {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.dark body {
  background: linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%);
}
```

#### 森林绿色
```css
body {
  background: linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%);
}

.dark body {
  background: linear-gradient(135deg, #134e5e 0%, #71b280 100%);
}
```

#### 梦幻粉色
```css
body {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
}

.dark body {
  background: linear-gradient(135deg, #232526 0%, #414345 100%);
}
```

---

## 🖼️ 方案三：图片背景

### 1. 使用本地图片

**步骤1：** 将背景图片放到 `public/images/` 目录  
**步骤2：** 在 `globals.css` 中添加：

```css
body {
  color: var(--foreground);
  background-image: url('/images/bg.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  background-repeat: no-repeat;
  font-family: Arial, Helvetica, sans-serif;
}

/* 添加半透明遮罩层以提高文字可读性 */
body::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.85);
  z-index: -1;
}

.dark body::before {
  background: rgba(0, 0, 0, 0.75);
}
```

### 2. 使用在线图片

```css
body {
  background-image: url('https://images.unsplash.com/photo-1557683316-973673baf926');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}
```

---

## ✨ 方案四：图案/纹理背景

### 1. 点状图案

```css
body {
  background-color: #f8f9fa;
  background-image: radial-gradient(circle, #e0e0e0 1px, transparent 1px);
  background-size: 20px 20px;
}

.dark body {
  background-color: #1a1a1a;
  background-image: radial-gradient(circle, #333 1px, transparent 1px);
}
```

### 2. 网格图案

```css
body {
  background-color: #ffffff;
  background-image: 
    linear-gradient(#e5e5e5 1px, transparent 1px),
    linear-gradient(90deg, #e5e5e5 1px, transparent 1px);
  background-size: 50px 50px;
}

.dark body {
  background-color: #0a0a0a;
  background-image: 
    linear-gradient(#2a2a2a 1px, transparent 1px),
    linear-gradient(90deg, #2a2a2a 1px, transparent 1px);
}
```

### 3. 斜线图案

```css
body {
  background-color: #f5f5f5;
  background-image: repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    rgba(0, 0, 0, 0.03) 10px,
    rgba(0, 0, 0, 0.03) 20px
  );
}
```

---

## 🎭 方案五：动态背景

### 1. 渐变动画

```css
body {
  background: linear-gradient(270deg, #667eea, #764ba2, #f093fb);
  background-size: 600% 600%;
  animation: gradientShift 15s ease infinite;
}

@keyframes gradientShift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
```

### 2. 脉动效果

```css
body {
  background: radial-gradient(circle at center, #667eea 0%, #764ba2 100%);
  animation: pulse 10s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}
```

---

## 📝 完整配置示例

### 推荐配置（渐变 + 高可读性）

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --background: #ffffff;
  --foreground: #171717;
}

body {
  color: var(--foreground);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  font-family: Arial, Helvetica, sans-serif;
  min-height: 100vh;
}

.dark {
  --background: #0a0a0a;
  --foreground: #ededed;
}

.dark body {
  background: linear-gradient(135deg, #1e3a8a 0%, #1e1b4b 100%);
}

/* 确保内容区域有背景 */
main {
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.dark main {
  background: rgba(10, 10, 10, 0.85);
}

/* ... 其他样式保持不变 ... */
```

---

## 🛠️ 实施步骤

### 1. 打开文件
编辑 `app/globals.css`

### 2. 选择方案
从上述方案中选择一个你喜欢的

### 3. 修改代码
复制对应的 CSS 代码并替换或添加到文件中

### 4. 保存并测试
保存文件后，浏览器会自动刷新（开发模式）

### 5. 调整细节
根据效果调整颜色、透明度等参数

---

## 🎨 颜色选择工具

推荐使用以下工具选择配色：

- **Coolors**: https://coolors.co/ - 配色生成器
- **UIGradients**: https://uigradients.com/ - 渐变配色
- **Adobe Color**: https://color.adobe.com/ - 专业配色工具
- **WebGradients**: https://webgradients.com/ - 渐变背景集合

---

## 💡 注意事项

### 1. 可读性优先
- 确保背景和文字有足够对比度
- 使用半透明遮罩提高可读性
- 测试深色和浅色两种模式

### 2. 性能考虑
- 图片背景优化尺寸（建议 < 500KB）
- 复杂动画可能影响性能
- 移动端测试响应速度

### 3. 用户体验
- 背景不要过于花哨
- 保持主题一致性
- 考虑不同设备的显示效果

---

## 🔧 常见问题

### Q: 背景没有显示？
A: 检查 CSS 语法是否正确，确保路径正确（图片背景）

### Q: 深色模式背景不对？
A: 确保同时配置了 `.dark body` 的样式

### Q: 背景影响文字可读性？
A: 添加半透明遮罩层或调整 `main` 容器背景

### Q: 如何让背景铺满整个页面？
A: 在 `body` 上添加 `min-height: 100vh`

---

## 📖 相关文件

- `app/globals.css` - 全局样式（主要编辑）
- `app/layout.tsx` - 页面布局
- `tailwind.config.ts` - Tailwind 配置

---

**开始自定义你的博客背景吧！** 🎉

选择一个方案，复制代码到 `app/globals.css`，然后刷新页面查看效果！
