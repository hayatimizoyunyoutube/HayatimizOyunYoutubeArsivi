import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const dist = path.join(root, 'dist');
const assets = path.join(dist, 'assets');
fs.mkdirSync(assets, { recursive:true });
for (const file of fs.readdirSync(assets)) {
  if (/^hayatimiz-(app|style)-/.test(file) && !file.includes('v212-public-stabilite')) {
    fs.rmSync(path.join(assets, file), { force:true });
  }
}
for (const dir of ['data']) fs.mkdirSync(path.join(dist, dir), {recursive:true});
const srcJs = path.join(root, 'src', 'main.js');
const srcCss = path.join(root, 'src', 'styles.css');
const srcHtml = path.join(root, 'index.html');
if(!fs.existsSync(srcJs)) throw new Error('src/main.js bulunamadı.');
if(!fs.existsSync(srcCss)) throw new Error('src/styles.css bulunamadı.');
if(!fs.existsSync(srcHtml)) throw new Error('index.html bulunamadı.');
fs.copyFileSync(srcJs, path.join(assets, 'hayatimiz-app-v212-public-stabilite.js'));
fs.copyFileSync(srcJs, path.join(assets, 'hayatimiz-app.js'));
fs.copyFileSync(srcCss, path.join(assets, 'hayatimiz-style-v212-public-stabilite.css'));
fs.copyFileSync(srcCss, path.join(assets, 'hayatimiz-style.css'));
let html = fs.readFileSync(srcHtml, 'utf8');
html = html.replace(/\s*<script\s+type=["']module["']\s+src=["']\/src\/main\.js["']\s*><\/script>\s*/g, '\n');
fs.writeFileSync(path.join(dist, 'index.html'), html);
fs.writeFileSync(path.join(dist, '404.html'), html);
fs.writeFileSync(path.join(dist, '_redirects'), '/* /index.html 200\n');
fs.writeFileSync(path.join(dist, 'vercel-root-check.txt'), 'v2.1.2 public stabilite build ok\n');
for (const file of ['robots.txt','sitemap.xml']) { const f=path.join(root,'public',file); if(fs.existsSync(f)) fs.copyFileSync(f, path.join(dist,file)); }
const publicData=path.join(root,'public','data','update-notes.json'); if(fs.existsSync(publicData)) fs.copyFileSync(publicData, path.join(dist,'data','update-notes.json'));
const js = fs.readFileSync(path.join(assets,'hayatimiz-app-v212-public-stabilite.js'), 'utf8');
const css = fs.readFileSync(path.join(assets,'hayatimiz-style-v212-public-stabilite.css'), 'utf8');
if(!js.includes("const VERSION = 'v2.1.2'")) throw new Error('JS v2.1.2 marker yok.');
if(!js.includes('function gameForm')) throw new Error('v2.1.2 oyun formu fonksiyonu eksik.');
if(!js.includes('gameEditorHero')) throw new Error('v2.1.2 profesyonel oyun formu eksik.');
if(!js.includes('oyun-duzenle')) throw new Error('v2.1.2 oyun düzenle rotası eksik.');
if(!js.includes('safeErrorPanel')) throw new Error('v2.1.2 güvenli hata ekranı eksik.');
if(!css.includes('collectionGrid')) throw new Error('CSS v2.1.2 koleksiyon paneli eksik.');
if(html.includes('/src/main.js')) throw new Error('Kırık /src/main.js referansı kaldı.');
if(!js.includes('data-youtube-action')) throw new Error('v2.1.2 YouTube butonları eksik.');
if(!js.includes('playlist-items')) throw new Error('v2.1.2 playlist-items bağlantısı eksik.');
if(!js.includes('function episodeTracker')) throw new Error('v2.1.2 bölüm takip sayfası eksik.');
if(!js.includes('function collectionsPage')) throw new Error('v2.1.2 koleksiyon sayfası eksik.');
if(!js.includes('function moveGameOrder')) throw new Error('v2.1.2 sıralama fonksiyonu eksik.');
if(!js.includes('refreshGamesFromSupabase')) throw new Error('v2.1.2 Supabase yenileme fonksiyonu eksik.');
if(!js.includes('persistGameToSupabase')) throw new Error('v2.1.2 Supabase kayıt fonksiyonu eksik.');
if(!js.includes('refreshEventsFromSupabase')) throw new Error('v2.1.2 Supabase takvim yenileme fonksiyonu eksik.');
if(!js.includes('persistMaintenanceToSupabase')) throw new Error('v2.1.2 Supabase bakım kayıt fonksiyonu eksik.');
if(!js.includes('function publicStatusPage')) throw new Error('v2.1.2 public status sayfası eksik.');
console.log('v2.1.2 Public Yayın Öncesi Stabilite build başarılı.');
