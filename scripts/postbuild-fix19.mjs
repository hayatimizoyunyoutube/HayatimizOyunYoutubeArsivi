import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');
const assets = path.join(dist, 'assets');

function copy(src, dest){ fs.copyFileSync(src, dest); }
function newest(pattern){
  const files = fs.readdirSync(assets).filter(pattern).map(name => ({ name, full:path.join(assets,name), mtime:fs.statSync(path.join(assets,name)).mtimeMs }));
  files.sort((a,b)=>b.mtime-a.mtime);
  return files[0]?.full;
}

const js = newest(name => /^index-.*\.js$/.test(name));
const css = newest(name => /^index-.*\.css$/.test(name));
if(!js || !css) throw new Error('FIX19 postbuild: Vite JS/CSS bundle bulunamadı.');

for(const name of ['hayatimiz-app-fix19.js','hayatimiz-app.js','index-fix18-status-buttons-stabil.js','index-fix17-auto-plan-version.js','index-fix16-public-version-clean.js']){
  copy(js, path.join(assets, name));
}
for(const name of ['hayatimiz-style-fix19.css','hayatimiz-style.css','styles.css']){
  copy(css, path.join(assets, name));
}

const indexPath = path.join(dist, 'index.html');
let html = fs.readFileSync(indexPath, 'utf8');
html = html.replace(/<script type="module" crossorigin src="\/assets\/index-[^"]+\.js"><\/script>/, '<script type="module" crossorigin src="/assets/hayatimiz-app-fix19.js?v=fix19"></script>');
html = html.replace(/<link rel="stylesheet" crossorigin href="\/assets\/index-[^"]+\.css">/, '<link rel="stylesheet" crossorigin href="/assets/hayatimiz-style-fix19.css?v=fix19">');
html = html.replace('Site yükleniyor...</h1><p>Sayfa beyaz kalmasın diye güvenli başlangıç ekranı aktif oldu. Birkaç saniye içinde açılmazsa Vercel deploy cache temizleyip tekrar deneyin.</p>', 'Site yükleniyor...</h1><p>Uygulama dosyası yükleniyor. Açılmazsa Ctrl+F5 yapıp Vercel yeniden deploy sonrası tekrar deneyin. FIX19 paketinde asset/build yolu düzeltilmiştir.</p>');
fs.writeFileSync(indexPath, html);
console.log('FIX19 postbuild tamamlandı:', path.basename(js), path.basename(css));
