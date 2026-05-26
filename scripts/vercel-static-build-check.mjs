import fs from 'node:fs';
import path from 'node:path';

const dist = path.join(process.cwd(), 'dist');
const index = path.join(dist, 'index.html');
const assets = path.join(dist, 'assets');
const required = [
  index,
  path.join(assets, 'hayatimiz-app-fix38.js'),
  path.join(assets, 'hayatimiz-app-fix36.js'),
  path.join(assets, 'hayatimiz-app-fix35.js'),
  path.join(assets, 'hayatimiz-app-fix34.js'),
  path.join(assets, 'hayatimiz-app-fix33.js'),
  path.join(assets, 'hayatimiz-app-fix32.js'),
  path.join(assets, 'hayatimiz-app-fix31.js'),
  path.join(assets, 'hayatimiz-app.js'),
  path.join(assets, 'hayatimiz-style-fix38.css'),
  path.join(assets, 'hayatimiz-style-fix36.css'),
  path.join(assets, 'hayatimiz-style-fix35.css'),
  path.join(assets, 'hayatimiz-style-fix34.css'),
  path.join(assets, 'hayatimiz-style-fix33.css'),
  path.join(assets, 'hayatimiz-style-fix32.css'),
  path.join(assets, 'hayatimiz-style-fix31.css'),
  path.join(assets, 'hayatimiz-style.css')
];
for (const file of required) {
  if (!fs.existsSync(file)) {
    console.error('Eksik hazır yayın dosyası:', file);
    process.exit(1);
  }
}
const jsFiles = fs.readdirSync(assets).filter(f => f.endsWith('.js') && f.startsWith('hayatimiz-app'));
for (const file of jsFiles) {
  const full = path.join(assets, file);
  const content = fs.readFileSync(full, 'utf8');
  if (/import\s+['"]\.\/styles\.css['"]/.test(content)) {
    console.error('Tarayıcıyı yükleniyor ekranında bırakan CSS import bulundu:', file);
    process.exit(1);
  }
  if (content.includes('fix12GenreFromTitle = v222GenreFromTitle')) {
    console.error('Eski sonsuz döngüye yol açan tür ataması devam ediyor:', file);
    process.exit(1);
  }
  if (!content.includes('HO240F38_INTERNAL_VERSION')) {
    console.error('FIX38 sürükle bırak seri sıralama motoru eksik:', file);
    process.exit(1);
  }
}
const html = fs.readFileSync(index, 'utf8');
if (!html.includes('hayatimiz-app-fix38.js') || !html.includes('hayatimiz-style-fix38.css')) {
  console.error('dist/index.html FIX38 assetlerini göstermiyor.');
  process.exit(1);
}
console.log('FIX38: Hazır dist kontrolü başarılı.');
console.log('FIX38: Sürükle bırak seri sıralama kontrolü başarılı.');
