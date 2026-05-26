import fs from 'node:fs';
import path from 'node:path';

const dist = path.join(process.cwd(), 'dist');
const index = path.join(dist, 'index.html');
const assets = path.join(dist, 'assets');
const required = [
  index,
  path.join(assets, 'hayatimiz-app-fix35.js'),
  path.join(assets, 'hayatimiz-app-fix34.js'),
  path.join(assets, 'hayatimiz-app-fix33.js'),
  path.join(assets, 'hayatimiz-app-fix32.js'),
  path.join(assets, 'hayatimiz-app-fix31.js'),
  path.join(assets, 'hayatimiz-app.js'),
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
const jsFiles = fs.readdirSync(assets).filter(f => f.endsWith('.js'));
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
  if (!content.includes('HO240F35_INTERNAL_VERSION')) {
    console.error('FIX35 kapak/seri güvenli motoru eksik:', file);
    process.exit(1);
  }
}
const html = fs.readFileSync(index, 'utf8');
if (!html.includes('hayatimiz-app-fix35.js') || !html.includes('hayatimiz-style-fix35.css')) {
  console.error('dist/index.html FIX35 assetlerini göstermiyor.');
  process.exit(1);
}
console.log('FIX35: Hazır dist kontrolü başarılı.');
console.log('FIX35: Kapakları Getir ve profesyonel seri sıralama kontrolü başarılı.');
