# 博客图片使用指南

## 在博客中插入图片的方法

### 1. 使用外部图片链接（推荐用于临时图片）

```markdown
![图片描述](https://example.com/image.jpg)
```

### 2. 使用本地图片（推荐用于永久图片）

#### 步骤：
1. 在项目根目录创建 `public/images/posts/` 文件夹
2. 将图片放入该文件夹
3. 在 Markdown 中引用：

```markdown
![图片描述](/images/posts/your-image.jpg)
```

#### ⚠️ 重要提示：
- ✅ **正确**：`/images/posts/your-image.jpg`（不包含 public）
- ❌ **错误**：`/public/images/posts/your-image.jpg`
- Next.js 会自动将 `public` 文件夹作为网站根目录，所以路径中不需要包含 `public/`

### 3. 图片示例

#### 基本图片
```markdown
![美丽的风景](/images/posts/landscape.jpg)
```

#### 带链接的图片
```markdown
[![点击查看大图](/images/posts/thumbnail.jpg)](https://example.com/full-image.jpg)
```

#### HTML 方式（更多控制）
```markdown
<img src="/images/posts/example.jpg" alt="示例图片" width="500" />
```

## 图片优化建议

1. **文件大小**：建议单张图片不超过 500KB
2. **格式**：推荐使用 WebP 或 JPEG 格式
3. **命名**：使用有意义的英文名称，如 `neural-network-architecture.jpg`
4. **尺寸**：建议宽度不超过 1200px

## 目录结构示例

```
public/
  images/
    posts/
      deeplearning1/
        neural-network.jpg
        activation-function.png
      welcome/
        banner.jpg
```

## 在博客中的实际使用

```markdown
---
title: "深度学习笔记"
date: "2025-11-17"
---

# 神经网络基础

神经网络是深度学习的基础。下面是一个简单的神经网络结构图：

![神经网络结构](/images/posts/deeplearning1/neural-network.jpg)

## 激活函数

常见的激活函数包括：

![激活函数对比](/images/posts/deeplearning1/activation-function.png)
```
