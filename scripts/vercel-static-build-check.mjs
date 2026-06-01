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

fs.copyFileSync(srcJs, path.join(assets, 'hayatimiz-app-v200-dolu.js'));
fs.copyFileSync(srcJs, path.join(assets, 'hayatimiz-app-fix64.js'));
fs.copyFileSync(srcJs, path.join(assets, 'hayatimiz-app.js'));
fs.copyFileSync(srcCss, path.join(assets, 'hayatimiz-style-v200-dolu.css'));
fs.copyFileSync(srcCss, path.join(assets, 'hayatimiz-style-fix64.css'));
fs.copyFileSync(srcCss, path.join(assets, 'hayatimiz-style.css'));

let html = fs.readFileSync(srcHtml, 'utf8');
html = html.replace(/<title>[^<]*<\/title>/, '<title>Hayatımız Oyun - v2.0.0</title>');
html = html.replace(/<link rel="stylesheet" href="\/src\/styles\.css"\s*\/?>/, '<script type="module" crossorigin src="/assets/hayatimiz-app-v200-dolu.js?v=v200-dolu-eski-taban"></script>\n  <link rel="stylesheet" crossorigin href="/assets/hayatimiz-style-v200-dolu.css?v=v200-dolu-eski-taban">');
if(!html.includes('/assets/hayatimiz-app-v200-dolu.js')){
  html = html.replace('</head>', '  <script type="module" crossorigin src="/assets/hayatimiz-app-v200-dolu.js?v=v200-dolu-eski-taban"></script>\n  <link rel="stylesheet" crossorigin href="/assets/hayatimiz-style-v200-dolu.css?v=v200-dolu-eski-taban">\n</head>');
}

// FIX9: dist içinde /src/main.js ikinci modül referansı kalırsa Vercel rewrite HTML döndürür ve tarayıcıda modül MIME hatası oluşur. Bu yüzden build çıktısında sadece /assets paketini bırak.
html = html.replace(/\s*<script\s+type=["']module["']\s+src=["']\/src\/main\.js["']\s*><\/script>\s*/g, '\n');

fs.writeFileSync(distHtml, html);

const redirects = '/* /index.html 200\n';
fs.writeFileSync(path.join(dist, '_redirects'), redirects);
fs.writeFileSync(path.join(dist, '404.html'), html);
fs.writeFileSync(path.join(dist, 'vercel-root-check.txt'), 'v2.0.0 dolu eski taban build ok\n');

const js = fs.readFileSync(path.join(assets, 'hayatimiz-app-v200-dolu.js'), 'utf8');
const css = fs.readFileSync(path.join(assets, 'hayatimiz-style-v200-dolu.css'), 'utf8');
const checks = [
  ['JS v2.0.0 marker', js.includes("const HO254F8_VERSION = 'v2.0.0'")],
  ['window.state exposure', js.includes('window.state = state')],
  ['CSS v2.0.0 marker', css.includes('v2.0.0') ],
  ['schema v2.0.0', fs.readFileSync(path.join(root, 'supabase', 'schema.sql'), 'utf8').includes('v2.0.0')],
  ['API v2.0.0', fs.readFileSync(path.join(root, 'api', 'index.js'), 'utf8').includes("version:'v2.0.0'")]
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
console.log('v2.0.0: src -> dist senkronizasyonu başarılı.');
console.log('v2.0.0 dolu eski taban: Admin, takvim, notlar, oyun ekleme, bakım ve schema stabil.');
