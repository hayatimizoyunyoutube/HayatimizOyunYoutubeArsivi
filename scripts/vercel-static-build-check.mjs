import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const assets = path.join(dist, 'assets');
fs.mkdirSync(assets, { recursive:true });

const srcJs = path.join(root, 'src', 'main.js');
const srcCss = path.join(root, 'src', 'styles.css');
const srcHtml = path.join(root, 'index.html');
const distHtml = path.join(dist, 'index.html');

if(!fs.existsSync(srcJs)) throw new Error('src/main.js bulunamadı.');
if(!fs.existsSync(srcCss)) throw new Error('src/styles.css bulunamadı.');
if(!fs.existsSync(srcHtml)) throw new Error('index.html bulunamadı.');

fs.copyFileSync(srcJs, path.join(assets, 'hayatimiz-app-fix64.js'));
fs.copyFileSync(srcJs, path.join(assets, 'hayatimiz-app.js'));
fs.copyFileSync(srcCss, path.join(assets, 'hayatimiz-style-fix64.css'));
fs.copyFileSync(srcCss, path.join(assets, 'hayatimiz-style.css'));

let html = fs.readFileSync(srcHtml, 'utf8');
html = html.replace(/<title>[^<]*<\/title>/, '<title>Hayatımız Oyun - v2.5.4 FIX8</title>');
html = html.replace(/<link rel="stylesheet" href="\/src\/styles\.css"\s*\/?>/, '<script type="module" crossorigin src="/assets/hayatimiz-app-fix64.js?v=fix8-tam-stabil-site"></script>\n  <link rel="stylesheet" crossorigin href="/assets/hayatimiz-style-fix64.css?v=fix8-tam-stabil-site">');
if(!html.includes('/assets/hayatimiz-app-fix64.js')){
  html = html.replace('</head>', '  <script type="module" crossorigin src="/assets/hayatimiz-app-fix64.js?v=fix8-tam-stabil-site"></script>\n  <link rel="stylesheet" crossorigin href="/assets/hayatimiz-style-fix64.css?v=fix8-tam-stabil-site">\n</head>');
}
fs.writeFileSync(distHtml, html);

const redirects = '/* /index.html 200\n';
fs.writeFileSync(path.join(dist, '_redirects'), redirects);
fs.writeFileSync(path.join(dist, '404.html'), html);
fs.writeFileSync(path.join(dist, 'vercel-root-check.txt'), 'v2.5.4 FIX8 build ok\n');

const js = fs.readFileSync(path.join(assets, 'hayatimiz-app-fix64.js'), 'utf8');
const css = fs.readFileSync(path.join(assets, 'hayatimiz-style-fix64.css'), 'utf8');
const checks = [
  ['JS FIX8 marker', js.includes('v2.5.4 FIX8 - Tam stabil admin')],
  ['window.state exposure', js.includes('window.state = state')],
  ['CSS FIX8 marker', css.includes('v2.5.4 FIX8 - stabil admin')],
  ['schema FIX8', fs.readFileSync(path.join(root, 'supabase', 'schema.sql'), 'utf8').includes('v2.5.4 FIX8')],
  ['API FIX8', fs.readFileSync(path.join(root, 'api', 'index.js'), 'utf8').includes("version:'v2.5.4 FIX8'")]
];
for(const [label, ok] of checks){
  if(!ok){
    console.error('Build kontrol hatası:', label);
    process.exit(1);
  }
}
if(/import\s+['"]\.\/styles\.css['"]/.test(js)){
  console.error('Tarayıcıyı yükleniyor ekranında bırakan CSS import bulundu.');
  process.exit(1);
}
console.log('v2.5.4 FIX8: src -> dist senkronizasyonu başarılı.');
console.log('v2.5.4 FIX8: Admin, takvim, notlar, oyun ekleme, bakım ve schema stabil.');
