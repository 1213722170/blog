"use client";

import { useState, useRef, useEffect } from "react";

// 歌曲信息接口
interface Song {
  title: string;
  artist: string;
  src: string;
}

export function MusicPlayer() {
  // 播放列表配置 - 可以添加多首歌曲
  const playlist: Song[] = [
    {
      title: "三百六十五里路",
      artist: "李璐",
      src: "/blog/music/365-li-lu.mp3",  // GitHub Pages 需要 basePath 前缀
    },
    // 在这里添加更多歌曲
    // {
    //   title: "歌曲名称2",
    //   artist: "艺术家2",
    //   src: "/blog/music/song2.mp3",
    // },
  ];

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [showPlayer, setShowPlayer] = useState(true);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [playMode, setPlayMode] = useState<'loop' | 'single' | 'random'>('loop'); // 播放模式
  const audioRef = useRef<HTMLAudioElement>(null);

  // 当前播放的歌曲
  const currentSong = playlist[currentSongIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      // 歌曲结束时的处理
      if (playMode === 'single') {
        // 单曲循环
        audio.currentTime = 0;
        audio.play();
      } else if (playMode === 'random') {
        // 随机播放
        playRandomSong();
      } else {
        // 列表循环
        playNext();
      }
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [playMode, currentSongIndex]);

  // 切换歌曲时自动播放
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      // 重置时间并播放
      audio.currentTime = 0;
      audio.play().catch(err => {
        console.error('播放失败:', err);
        setIsPlaying(false);
      });
    }
  }, [currentSongIndex]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(err => {
        console.error('播放失败:', err);
      });
      setIsPlaying(true);
    }
  };

  // 播放下一曲
  const playNext = () => {
    setCurrentSongIndex((prevIndex) => {
      const nextIndex = (prevIndex + 1) % playlist.length;
      return nextIndex;
    });
  };

  // 播放上一曲
  const playPrevious = () => {
    setCurrentSongIndex((prevIndex) => {
      const prevIndexCalc = prevIndex - 1;
      return prevIndexCalc < 0 ? playlist.length - 1 : prevIndexCalc;
    });
  };

  // 随机播放
  const playRandomSong = () => {
    if (playlist.length <= 1) return;
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * playlist.length);
    } while (randomIndex === currentSongIndex);
    setCurrentSongIndex(randomIndex);
  };

  // 切换播放模式
  const togglePlayMode = () => {
    const modes: Array<'loop' | 'single' | 'random'> = ['loop', 'single', 'random'];
    const currentIndex = modes.indexOf(playMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    setPlayMode(modes[nextIndex]);
  };

  // 获取播放模式图标
  const getPlayModeIcon = () => {
    switch (playMode) {
      case 'loop':
        return '🔁'; // 列表循环
      case 'single':
        return '🔂'; // 单曲循环
      case 'random':
        return '🔀'; // 随机播放
      default:
        return '🔁';
    }
  };

  // 获取播放模式文字
  const getPlayModeText = () => {
    switch (playMode) {
      case 'loop':
        return '列表循环';
      case 'single':
        return '单曲循环';
      case 'random':
        return '随机播放';
      default:
        return '列表循环';
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = parseFloat(e.target.value);
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newVolume = parseFloat(e.target.value);
    audio.volume = newVolume;
    setVolume(newVolume);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (!showPlayer) {
    return (
      <button
        onClick={() => setShowPlayer(true)}
        className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all z-50"
        aria-label="显示音乐播放器"
      >
        🎵
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-4 w-80 z-50 border border-gray-200 dark:border-gray-700">
      <audio ref={audioRef} src={currentSong.src} preload="metadata" />
      
      {/* 头部 */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-sm truncate">{currentSong.title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {currentSong.artist}
          </p>
        </div>
        <button
          onClick={() => setShowPlayer(false)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 ml-2"
          aria-label="隐藏播放器"
        >
          ✕
        </button>
      </div>

      {/* 进度条 */}
      <div className="mb-3">
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={handleSeek}
          className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
        />
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* 控制按钮 */}
      <div className="flex items-center justify-center gap-3 mb-3">
        {/* 播放模式 */}
        <button
          onClick={togglePlayMode}
          className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          aria-label={getPlayModeText()}
          title={getPlayModeText()}
        >
          <span className="text-lg">{getPlayModeIcon()}</span>
        </button>

        {/* 上一曲 */}
        <button
          onClick={playPrevious}
          disabled={playlist.length <= 1}
          className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="上一曲"
        >
          <span className="text-xl">⏮</span>
        </button>

        {/* 播放/暂停 */}
        <button
          onClick={togglePlay}
          className="bg-blue-600 hover:bg-blue-700 text-white w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-lg"
          aria-label={isPlaying ? "暂停" : "播放"}
        >
          {isPlaying ? (
            <span className="text-xl">⏸</span>
          ) : (
            <span className="text-xl ml-0.5">▶</span>
          )}
        </button>

        {/* 下一曲 */}
        <button
          onClick={playNext}
          disabled={playlist.length <= 1}
          className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="下一曲"
        >
          <span className="text-xl">⏭</span>
        </button>

        {/* 音量控制 */}
        <div className="flex items-center gap-2 flex-1">
          <span className="text-sm">🔊</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>
      </div>

      {/* 播放列表信息 */}
      {playlist.length > 1 && (
        <div className="text-center text-xs text-gray-500 dark:text-gray-400 mb-2">
          {currentSongIndex + 1} / {playlist.length}
        </div>
      )}

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: #2563eb;
          cursor: pointer;
          border: none;
        }
      `}</style>
    </div>
  );
}
