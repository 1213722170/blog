# 博客图片使用指南（已优化 ✨）

## 在博客中插入图片的方法

### 1. 使用外部图片链接（推荐用于临时图片）

```markdown
![图片描述](https://example.com/image.jpg)
```

### 2. 使用本地图片 - 简化版（推荐 ⭐）

#### 步骤：
1. 将图片放入 `public/images/posts/` 文件夹
2. 在 Markdown 中**只写文件名**：

```markdown
![图片描述](your-image.jpg)
```

就这么简单！系统会自动添加完整路径。

### 3. 使用本地图片 - 完整路径（旧方法，仍然有效）

```markdown
![图片描述](/images/posts/your-image.jpg)
```

## 支持的所有写法

```markdown
✅ 简化写法（推荐）
![描述](image.png)

✅ 完整路径（旧写法，继续有效）
![描述](/images/posts/image.png)

✅ 外部链接
![描述](https://example.com/image.jpg)
```

## 重要提示

- ✅ 路径不需要包含 `public/`
- ✅ 新旧写法都支持，不会失效
- ✅ 自动处理 GitHub Pages 的 basePath

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
