# 友链头像目录

将友链头像图片放在这个目录下。

## 使用说明

1. 将好友的头像图片放入此目录
2. 建议命名格式: `friend-name.jpg` 或 `friend-name.png`
3. 在 `app/friends/page.tsx` 中引用时使用路径: `/avatars/friend-name.jpg`

## 图片建议

- **尺寸**: 建议至少 200x200 像素
- **格式**: JPG、PNG、WebP
- **大小**: 建议不超过 200KB
- **比例**: 正方形（1:1）效果最佳

## 示例

```typescript
{
  name: "张三",
  avatar: "/avatars/zhangsan.jpg",
  link: "https://zhangsan.blog",
  description: "张三的个人博客",
}
```

## 注意事项

- 请确保有使用头像的授权
- 图片文件名建议使用英文和数字
- 避免使用特殊字符和空格
