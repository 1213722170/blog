# 博客图片存放目录

## 目录说明

这个文件夹用于存放博客文章中使用的图片。

## 推荐的目录结构

```
public/images/posts/
├── deeplearning1/          # 深度学习笔记1的图片
│   ├── neural-network.jpg
│   └── activation.png
├── welcome/                # 欢迎文章的图片
│   └── banner.jpg
└── common/                 # 通用图片
    └── avatar.jpg
```

## 使用方法

在 Markdown 文件中引用图片：

```markdown
![图片描述](/images/posts/deeplearning1/neural-network.jpg)
```

## 图片规范

- 格式：推荐 WebP、JPEG、PNG
- 大小：单张图片建议不超过 500KB
- 命名：使用小写字母和连字符，如 `neural-network.jpg`
- 尺寸：宽度建议 800-1200px
