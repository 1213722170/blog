import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = path.dirname(fileURLToPath(import.meta.url));
const origin = 'http://127.0.0.1:3000';
const response = await fetch(origin);
if (!response.ok) throw new Error(`Homepage returned ${response.status}`);
const source = await response.text();
const sheets = [...source.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)].map(([tag]) => tag.match(/href="([^"]+)"/)[1]);
const css = await Promise.all(sheets.map(async href => {
  const result = await fetch(new URL(href.replaceAll('&amp;', '&'), origin));
  if (!result.ok) throw new Error(`Stylesheet returned ${result.status}`);
  return result.text();
}));
const themes = [
  { id: '01-moss-green', name: '苔绿纸笺', description: '浅苔绿 × 松针绿 · 安静自然', mode: 'light', colors: ['#f1f5ed','#293b2d','#626f60','#7b8877','#d5dfcf','#3d704c','#6a9072','#254f33','#e7eddf','#fbfcf7'], tape: '#9caf7d' },
  { id: '02-mist-blue', name: '雾蓝手记', description: '雾蓝灰 × 靛蓝 · 清爽理性', mode: 'light', colors: ['#edf3f8','#293b4b','#5f7285','#7a8da0','#cfdce8','#386d98','#6a94b6','#244e74','#e1ebf3','#f9fcff'], tape: '#8eafca' },
  { id: '03-warm-apricot', name: '暖杏书页', description: '奶油杏 × 陶土棕 · 温暖复古', mode: 'light', colors: ['#fbf2e6','#49382f','#856d5a','#a08a75','#e8d7c3','#a15c37','#ba8058','#794126','#f3e7d6','#fffbf4'], tape: '#d5ad77' },
  { id: '04-lotus-purple', name: '藕紫随笔', description: '浅藕紫 × 烟紫 · 柔和文艺', mode: 'light', colors: ['#f4eff7','#403346','#7d6b84','#97879d','#ded2e4','#835d94','#a083ae','#613e72','#ebe2ef','#fdfaff'], tape: '#b498c3' },
  { id: '05-midnight-blue', name: '深夜墨蓝', description: '深墨蓝 × 月光蓝 · 沉静专注', mode: 'dark', colors: ['#141e2c','#e0e8f3','#a2b3ca','#8196b0','#304158','#a0c7ee','#b9d9f7','#d0e6fc','#1b2a3d','#1a283b'], tape: '#87a6cc' },
];
const keys = ['background','foreground','muted','subtle','line','primary','primary-light','primary-dark','surface','paper'];
const clean = source.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, '').replace(/<link\b[^>]*>/g, '').replace(/<html[^>]*>/, '<html lang="zh-CN">');
for (const theme of themes) {
  const palette = `:root,.dark{${keys.map((key,index) => `--${key}:${theme.colors[index]}`).join(';')};color-scheme:${theme.mode}}.learning-sketch::before{background:${theme.tape}44;border-color:${theme.tape}38}::selection{background:${theme.tape}55}*,*::before,*::after{animation:none!important;transition:none!important}`;
  let html = clean.replace('</head>', `<style>${css.join('\n')}\n${palette}</style></head>`);
  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${theme.name} · 博客主页配色预览</title>`);
  await fs.writeFile(path.join(directory, `${theme.id}.html`), html);
}
await fs.writeFile(path.join(directory, 'palettes.json'), JSON.stringify(themes.map(theme => ({...theme, colors: Object.fromEntries(keys.map((key,i) => [key,theme.colors[i]]))})), null, 2));
console.log(JSON.stringify({ pages: themes.map(theme => theme.id), stylesheetCount: sheets.length }));
