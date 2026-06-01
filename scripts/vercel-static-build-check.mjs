import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const dist = path.join(root, 'dist');
const assets = path.join(dist, 'assets');
fs.mkdirSync(assets, { recursive:true });
for (const file of fs.readdirSync(assets)) {
  if (/^hayatimiz-(app|style)-/.test(file) && !file.includes('v204-fix-kalici-auth-bakim')) {
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
fs.copyFileSync(srcJs, path.join(assets, 'hayatimiz-app-v204-fix-kalici-auth-bakim.js'));
fs.copyFileSync(srcJs, path.join(assets, 'hayatimiz-app.js'));
fs.copyFileSync(srcCss, path.join(assets, 'hayatimiz-style-v204-fix-kalici-auth-bakim.css'));
fs.copyFileSync(srcCss, path.join(assets, 'hayatimiz-style.css'));
let html = fs.readFileSync(srcHtml, 'utf8');
html = html.replace(/\s*<script\s+type=["']module["']\s+src=["']\/src\/main\.js["']\s*><\/script>\s*/g, '\n');
fs.writeFileSync(path.join(dist, 'index.html'), html);
fs.writeFileSync(path.join(dist, '404.html'), html);
fs.writeFileSync(path.join(dist, '_redirects'), '/* /index.html 200\n');
fs.writeFileSync(path.join(dist, 'vercel-root-check.txt'), 'v2.0.4 fix kalici silme auth bakim build ok\n');
const js = fs.readFileSync(path.join(assets,'hayatimiz-app-v204-fix-kalici-auth-bakim.js'), 'utf8');
const css = fs.readFileSync(path.join(assets,'hayatimiz-style-v204-fix-kalici-auth-bakim.css'), 'utf8');
if(!js.includes("const VERSION = 'v2.0.4'")) throw new Error('JS v2.0.4 marker yok.');
if(!js.includes('clearAllGames')) throw new Error('Kalıcı oyun silme fix eksik.');
if(!js.includes('data-login-form')) throw new Error('Kayıt/giriş fix eksik.');
if(!js.includes('maintenancePublic')) throw new Error('Bakım modu fix eksik.');
if(!css.includes('maintenancePublic')) throw new Error('CSS bakım modu fix eksik.');
if(html.includes('/src/main.js')) throw new Error('Kırık /src/main.js referansı kaldı.');
console.log('v2.0.4 FIX kalıcı silme + kayıt/giriş + bakım modu build başarılı.');
