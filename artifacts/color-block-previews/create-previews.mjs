import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const directory = path.dirname(fileURLToPath(import.meta.url));
const source = await fs.readFile(path.join(directory, '../color-previews/01-moss-green.html'), 'utf8');
const themes = [
  { id:'01-cobalt-orange', name:'钴蓝 × 柑橘橙', subtitle:'互补撞色 / 鲜明、自由', header:'#FFF5DE', headerInk:'#1835A6', left:'#2448C8', right:'#FF8B43', text:'#FFF5DE', accent:'#FFD56B', sketch:'#FFF5DE', sketchInk:'#2448C8', paper:'#FFF8E9', ink:'#202D53', muted:'#626780', line:'#D8D8DF', row:'#E9EEFF', note:'#FF8B43', noteInk:'#1835A6', footer:'#1835A6', footerInk:'#FFF5DE', swatches:['#2448C8','#FF8B43','#FFD56B','#FFF5DE','#202D53'] },
  { id:'02-teal-coral', name:'深青 × 珊瑚红', subtitle:'冷暖对撞 / 热情、有机', header:'#123F43', headerInk:'#FFF4DE', left:'#FF806C', right:'#155E63', text:'#123F43', accent:'#123F43', sketch:'#F5D96B', sketchInk:'#123F43', paper:'#FFF4DE', ink:'#153F43', muted:'#5C7067', line:'#CFD7C7', row:'#E2EBD9', note:'#155E63', noteInk:'#FFF4DE', footer:'#FF806C', footerInk:'#123F43', swatches:['#155E63','#FF806C','#F5D96B','#E2EBD9','#FFF4DE'] },
  { id:'03-violet-lime', name:'电光紫 × 青柠黄', subtitle:'互补色块 / 实验、灵感', header:'#5231A5', headerInk:'#FFF6D2', left:'#EFEAA5', right:'#6844C6', text:'#342155', accent:'#6844C6', sketch:'#D6EE59', sketchInk:'#342155', paper:'#F6F0FC', ink:'#342155', muted:'#786487', line:'#DBCEE7', row:'#FFF9E8', note:'#D6EE59', noteInk:'#342155', footer:'#5231A5', footerInk:'#FFF6D2', swatches:['#6844C6','#D6EE59','#EFEAA5','#F6F0FC','#342155'] },
  { id:'04-wine-butter', name:'酒红 × 黄油黄', subtitle:'复古对照 / 浓郁、书卷', header:'#FFF0C4', headerInk:'#6F253E', left:'#6F253E', right:'#F2D66D', text:'#FFF0C4', accent:'#F2D66D', sketch:'#EFB7BE', sketchInk:'#6F253E', paper:'#FFFAEF', ink:'#542A37', muted:'#8B6870', line:'#E5CFCA', row:'#F7E2E3', note:'#205C55', noteInk:'#FFF0C4', footer:'#6F253E', footerInk:'#FFF0C4', swatches:['#6F253E','#F2D66D','#EFB7BE','#205C55','#FFF0C4'] },
  { id:'05-sky-salmon', name:'天蓝 × 鲑粉', subtitle:'冷暖拼接 / 轻快、摩登', header:'#223A81', headerInk:'#FFF6E8', left:'#F6AB98', right:'#91C9E8', text:'#223A81', accent:'#223A81', sketch:'#223A81', sketchInk:'#FFF6E8', paper:'#F2F7FC', ink:'#25365F', muted:'#697691', line:'#CAD9E6', row:'#FCE6D9', note:'#3860C5', noteInk:'#FFF6E8', footer:'#F6AB98', footerInk:'#223A81', swatches:['#91C9E8','#F6AB98','#223A81','#FFF6E8','#3860C5'] },
];

function contrast(hex) {
  const rgb = hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);
  return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722 > .35 ? '#182539' : '#FFF9ED';
}

for (const t of themes) {
  const style = `
  :root,.dark{--background:${t.paper};--foreground:${t.ink};--primary:${t.sketchInk};--primary-light:${t.sketchInk};--primary-dark:${t.ink};--muted:${t.muted};--subtle:${t.muted};--line:${t.line};--surface:${t.row};--paper:${t.paper};color-scheme:light}
  body{background:${t.paper}}
  .site-header{background:${t.header};color:${t.headerInk};border-bottom:0}
  .header-inner{min-height:96px}
  .brand-mark{background:${t.headerInk};color:${t.header};border-radius:0}
  .brand-note,.site-nav,.site-nav a[aria-current=page],.theme-toggle{color:${t.headerInk}}
  .site-nav a[aria-current=page]::after{background:${t.headerInk}}
  .theme-toggle{border-color:${t.headerInk}55}
  .site-main{width:100%;max-width:none}
  .home-hero{position:relative;isolation:isolate;overflow:hidden;grid-template-columns:1.2fr 1fr;gap:70px;margin:0;padding:65px max(28px,calc((100% - 1064px)/2)) 70px;background:linear-gradient(90deg,${t.left} 0 52%,${t.right} 52% 100%);min-height:550px}
  .home-hero::after{content:'';position:absolute;z-index:-1;right:-68px;top:-100px;width:430px;height:430px;border:64px solid ${t.sketch}40;border-radius:50%;pointer-events:none}
  .hero-copy{color:${t.text};padding:0 15px 0 0}
  .hero-copy .eyebrow,.hero-description{color:${t.text}}
  .status-dot{background:${t.accent}}
  .hero-copy h1{font-size:57px;line-height:1.45;margin-top:20px}
  .ink-accent{color:${t.accent}}
  .hero-link{color:${t.text};border-color:${t.text};padding:11px 0;margin-top:22px}
  .learning-sketch{background:${t.sketch};color:${t.sketchInk};border:1px solid ${t.sketchInk}55;box-shadow:13px 14px 0 ${t.sketchInk}22;transform:rotate(-3deg);padding:25px 23px 20px}
  .learning-sketch::before{background:${t.left};border-color:${t.sketchInk}22;opacity:.75;width:90px;height:22px;left:calc(50% - 45px)}
  .sketch-topline,.sketch-bottomline{color:${t.sketchInk};border-color:${t.sketchInk}40}
  .sketch-node{fill:${t.sketch}}
  .sketch-node-filled{fill:${t.sketchInk}}
  .palette-strip{display:grid;grid-template-columns:repeat(5,1fr);height:47px}
  .palette-strip span{display:flex;align-items:center;justify-content:center;font:10px ui-monospace,Consolas,monospace;letter-spacing:.13em}
  .recent-section{background:${t.paper};padding:48px max(28px,calc((100% - 1064px)/2)) 0}
  .section-heading{border-bottom:2px solid ${t.ink};padding-bottom:23px}
  .section-heading h2{font-size:29px}
  .section-heading .text-link{color:${t.ink}}
  .section-heading .eyebrow{color:${t.muted}}
  .post-row{padding:24px 20px;grid-template-columns:115px 1fr 32px;border-bottom:1px solid ${t.line};gap:24px}
  .post-row:nth-child(odd){background:${t.row}}
  .post-row:first-child{border-left:5px solid ${t.right};padding-left:15px}
  .post-row-date{color:${t.ink}}
  .post-row-meta,.post-row-content>p,.post-row-arrow,.all-writing-link{color:${t.muted}}
  .post-row-meta>span:first-child{color:${t.ink}}
  .all-writing-link{padding:30px 0 36px}
  .home-note{position:relative;padding:38px 28px 44px;gap:8px;background:${t.note};color:${t.noteInk};overflow:hidden}
  .home-note::after{content:'✳';position:absolute;right:13%;top:8px;font-size:135px;line-height:1;color:${t.noteInk};opacity:.16}
  .note-symbol,.home-note .eyebrow{color:${t.noteInk}}
  .home-note>p{font-size:24px}
  .note-symbol{height:26px;font-size:44px}
  .site-footer{background:${t.footer};color:${t.footerInk};max-width:none;width:100%;margin:0;border-top:0;padding:32px max(28px,calc((100% - 1064px)/2)) 36px}
  .site-footer p,.footer-meta{color:${t.footerInk}}
  .music-toggle{background:${t.header};color:${t.headerInk};border-color:${t.headerInk}66;box-shadow:none}
  @media(max-width:767px){.home-hero{grid-template-columns:1fr;padding:45px 28px;background:linear-gradient(180deg,${t.left} 0 55%,${t.right} 55% 100%);gap:55px}.hero-copy h1{font-size:42px}.learning-sketch{max-width:430px}.palette-strip{height:42px}.palette-strip span{font-size:8px}.post-row{grid-template-columns:1fr 24px;padding:24px 12px}.post-row-date{grid-column:1/-1}.recent-section{padding-top:36px}.home-note>p{font-size:18px}.site-footer{flex-wrap:wrap}}
  `;
  const palette = `<div class="palette-strip" aria-label="配色色卡">${t.swatches.map(color=>`<span style="background:${color};color:${contrast(color)}">${color}</span>`).join('')}</div>`;
  let html = source.replace(/<title>[\s\S]*?<\/title>/,`<title>${t.name} · 博客撞色预览</title>`)
    .replace('</head>',`<style>${style}</style></head>`)
    .replace('<section class="recent-section"',`${palette}<section class="recent-section"`);
  await fs.writeFile(path.join(directory,t.id+'.html'),html);
}
await fs.writeFile(path.join(directory,'palettes.json'),JSON.stringify(themes,null,2));
console.log('Created '+themes.length+' color-block previews.');
