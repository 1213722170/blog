# 音乐播放器使用说明（已升级）

## ✨ 新功能

### 已实现功能
- ✅ **自动读取歌曲名称** - 从配置中显示歌名和艺术家
- ✅ **切歌功能** - 上一曲/下一曲按钮
- ✅ **多种播放模式** - 列表循环/单曲循环/随机播放
- ✅ **播放列表** - 支持多首歌曲
- ✅ **播放进度显示** - 显示当前第几首

## 🎵 添加歌曲

编辑 `components/MusicPlayer.tsx`，在 `playlist` 数组中添加：

```typescript
const playlist: Song[] = [
  {
    title: "三百六十五里路",
    artist: "李琼",
    src: "/music/365-li-lu.mp3",
  },
  {
    title: "你的歌曲名",
    artist: "艺术家名字",
    src: "/music/song2.mp3",
  },
  // 继续添加...
];
```

## 🎮 播放控制

| 按钮 | 功能 |
|------|------|
| ⏮ | 上一曲 |
| ▶/⏸ | 播放/暂停 |
| ⏭ | 下一曲 |
| 🔁 | 列表循环 |
| 🔂 | 单曲循环 |
| 🔀 | 随机播放 |
| 🔊 | 音量调节 |

## 📝 快速配置

### 添加本地歌曲
1. 将 MP3 文件放到 `public/music/`
2. 在 `playlist` 中添加配置
3. 刷新页面

### 使用在线歌曲
```typescript
{
  title: "在线歌曲",
  artist: "艺术家",
  src: "https://example.com/song.mp3",
}
```

## 🔧 常见问题

**Q: 切歌按钮不能点击？**  
A: 只有一首歌时会禁用，添加更多歌曲即可。

**Q: 如何更改默认播放模式？**  
A: 修改 `useState('loop')` 为 `'single'` 或 `'random'`

详细说明见：public/music/README.md
