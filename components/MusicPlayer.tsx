"use client";
import { useEffect, useRef, useState } from "react";
import { getAssetPath } from "@/lib/utils";

const songs = [
  { title: "三百六十五里路", artist: "李璐", src: "/music/365-li-lu.mp3" },
  { title: "ave mujika", artist: "ave mujika", src: "/music/song2.m4a" },
];
function time(value: number) {
  return Number.isFinite(value) ? Math.floor(value / 60) + ":" + String(Math.floor(value % 60)).padStart(2, "0") : "0:00";
}
export function MusicPlayer() {
  const audio = useRef<HTMLAudioElement>(null);
  const playRequested = useRef(false);
  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [mode, setMode] = useState<"loop" | "single" | "random">("loop");
  const [error, setError] = useState("");
  const song = songs[index];
  const play = () => audio.current?.play().catch(() => { playRequested.current = false; setPlaying(false); setError("暂时无法播放，请再试一次。"); });
  useEffect(() => { if (audio.current) audio.current.volume = volume; }, [volume]);
  useEffect(() => {
    setPosition(0); setDuration(0); setError("");
    if (playRequested.current) void play();
  }, [index]);
  function toggle() {
    setError("");
    if (playing) { playRequested.current = false; audio.current?.pause(); }
    else { playRequested.current = true; void play(); }
  }
  function next() {
    setIndex((current) => mode === "random" ? (current + 1 + Math.floor(Math.random() * (songs.length - 1))) % songs.length : (current + 1) % songs.length);
  }
  return <div className="music-widget">
    <audio ref={audio} src={getAssetPath(song.src)} preload="none" onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onTimeUpdate={() => setPosition(audio.current?.currentTime || 0)} onLoadedMetadata={() => setDuration(audio.current?.duration || 0)} onError={() => { setPlaying(false); setError("音频暂时不可用。"); }} onEnded={() => { if (mode === "single") { if (audio.current) audio.current.currentTime = 0; void play(); } else next(); }} />
    {expanded && <section className="music-panel" aria-label="音乐播放器">
      <div className="music-panel-heading"><div><h2>{song.title}</h2><p>{song.artist}</p></div><button onClick={() => setExpanded(false)} aria-label="收起音乐播放器">✕</button></div>
      <label className="sr-only" htmlFor="music-seek">播放进度</label><input id="music-seek" type="range" min={0} max={duration || 0} step={0.1} value={position} onChange={(event) => { const value = Number(event.target.value); if (audio.current) audio.current.currentTime = value; setPosition(value); }} />
      <div className="music-times"><span>{time(position)}</span><span>{time(duration)}</span></div>
      <div className="music-controls"><button onClick={() => setIndex((current) => (current + songs.length - 1) % songs.length)} aria-label="上一曲">←</button><button className="music-play" onClick={toggle} aria-label={playing ? "暂停" : "播放"}>{playing ? "Ⅱ" : "▶"}</button><button onClick={next} aria-label="下一曲">→</button><label><span className="sr-only">播放模式</span><select value={mode} onChange={(event) => setMode(event.target.value as typeof mode)}><option value="loop">列表循环</option><option value="single">单曲循环</option><option value="random">随机播放</option></select></label></div>
      <label className="music-volume">音量<input type="range" min={0} max={1} step={0.01} value={volume} onChange={(event) => setVolume(Number(event.target.value))} /></label>
      {error && <p role="status" className="music-error">{error}</p>}
    </section>}
    <button className="music-toggle" onClick={() => setExpanded((value) => !value)} aria-expanded={expanded} aria-label={expanded ? "收起音乐播放器" : "打开音乐播放器"}><svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M8 14V4l9-2v10M8 7l9-2" /><ellipse cx="5" cy="15" rx="3" ry="2" /><ellipse cx="14" cy="13" rx="3" ry="2" /></svg><span>{playing ? "正在播放" : "听一会儿"}</span></button>
  </div>;
}
