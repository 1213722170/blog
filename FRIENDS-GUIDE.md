# 友链页面使用指南

## 功能说明

友链页面位于 `/friends` 路径，用于展示你的好朋友的网站链接。

## 页面特性

- ✨ 精美的卡片式布局
- 🖼️ 支持显示头像图片
- 🔗 点击卡片跳转到对应链接（新标签页打开）
- 📝 显示网站名称和描述
- 🎨 悬停动画效果
- 📱 响应式设计，支持手机、平板、电脑
- 🌓 支持深色/浅色主题

## 如何添加友链

### 步骤 1: 准备友链信息

你需要准备以下信息：
- **name**: 网站名称或朋友昵称
- **avatar**: 头像图片链接
- **link**: 网站链接
- **description**: 网站描述（一句话简介）

### 步骤 2: 编辑友链数据

打开文件：`app/friends/page.tsx`

找到 `friends` 数组，添加新的友链对象：

```typescript
const friends: Friend[] = [
  {
    name: "张三的博客",
    avatar: "https://example.com/avatar1.jpg",
    link: "https://zhangsan.blog",
    description: "一个热爱技术的程序员",
  },
  {
    name: "李四的网站",
    avatar: "https://example.com/avatar2.jpg",
    link: "https://lisi.com",
    description: "分享生活与技术的美好",
  },
  // 继续添加更多友链...
];
```

### 步骤 3: 保存并刷新

保存文件后，Next.js 开发服务器会自动刷新页面，你可以在浏览器中查看效果。

## 头像图片建议

### 图片来源

1. **使用本地图片**：
   - 将图片放在 `public/avatars/` 目录下
   - 使用路径：`/avatars/friend-name.jpg`

2. **使用在线图片**：
   - 使用图床服务（如 GitHub、阿里云OSS等）
   - 使用完整的 URL：`https://example.com/avatar.jpg`

### 图片规格建议

- **尺寸**: 建议至少 200x200 像素
- **格式**: JPG、PNG、WebP 都支持
- **大小**: 建议不超过 200KB
- **比例**: 正方形（1:1）效果最佳

### 示例：使用本地图片

1. 创建目录（如果不存在）：
```bash
mkdir public/avatars
```

2. 将头像图片放入该目录

3. 在友链数据中使用：
```typescript
{
  name: "好友名称",
  avatar: "/avatars/friend-name.jpg",
  link: "https://friend-website.com",
  description: "描述文字",
}
```

## 自定义样式

### 修改卡片列数

在 `page.tsx` 中找到这一行：

```typescript
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
```

- `grid-cols-1`: 手机上 1 列
- `sm:grid-cols-2`: 平板上 2 列
- `md:grid-cols-3`: 电脑上 3 列

你可以修改为 `md:grid-cols-4` 显示 4 列，或其他数字。

### 修改卡片间距

修改 `gap-6` 为其他值（如 `gap-4`、`gap-8`）来调整卡片间距。

### 修改头像大小

找到这一行：

```typescript
<div className="relative w-24 h-24 rounded-full...">
```

修改 `w-24 h-24` 为其他值：
- `w-20 h-20`: 更小的头像
- `w-32 h-32`: 更大的头像

## 修改申请友链说明

在 `page.tsx` 底部找到"申请友链"部分，可以自定义：
- 申请条件
- 联系方式
- 所需信息

## 常见问题

### Q: 图片显示不出来？
A: 检查以下几点：
1. 图片 URL 是否正确
2. 图片是否可公开访问
3. 如果使用本地图片，确保路径以 `/` 开头
4. 检查图片格式是否支持

### Q: 如何隐藏"申请友链"部分？
A: 在 `page.tsx` 中找到以下代码并删除或注释掉：
```typescript
{/* 申请友链说明 */}
<div className="mt-12 p-6 bg-blue-50...">
  ...
</div>
```

### Q: 如何更改页面标题？
A: 修改 `<h1>` 标签中的文字：
```typescript
<h1 className="text-4xl font-bold mb-4">友情链接</h1>
```

### Q: 如何添加更多友链信息？
A: 在 `Friend` 接口中添加新字段，例如：
```typescript
interface Friend {
  name: string;
  avatar: string;
  link: string;
  description: string;
  tags?: string[];  // 新增标签
  email?: string;   // 新增邮箱
}
```

## 访问友链页面

- **本地开发**: http://localhost:3000/friends
- **生产环境**: https://your-domain.com/friends

## 技术说明

- 使用 Next.js Image 组件优化图片加载
- 响应式网格布局（Tailwind CSS Grid）
- 悬停动画效果
- 在新标签页打开外部链接（`target="_blank"`）
- 安全性设置（`rel="noopener noreferrer"`）
