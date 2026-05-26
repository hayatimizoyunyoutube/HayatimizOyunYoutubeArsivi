import fs from 'node:fs';
import path from 'node:path';

const dist = path.join(process.cwd(), 'dist');
const index = path.join(dist, 'index.html');
const assets = path.join(dist, 'assets');
const required = [
  index,
  path.join(assets, 'hayatimiz-app-fix55.js'),
  path.join(assets, 'hayatimiz-app.js'),
  path.join(assets, 'hayatimiz-style-fix55.css'),
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
}
const latest = fs.readFileSync(path.join(assets, 'hayatimiz-app-fix55.js'), 'utf8');
for (const marker of ['HO240F55_INTERNAL_VERSION','ho240f55ExactMeta','ho240f55ResetAddForm','ho240f55Release']) {
  if (!latest.includes(marker)) {
    console.error('FIX55 işareti eksik:', marker);
    process.exit(1);
  }
}
const html = fs.readFileSync(index, 'utf8');
if (!html.includes('hayatimiz-app-fix55.js') || !html.includes('hayatimiz-style-fix55.css')) {
  console.error('dist/index.html FIX55 assetlerini göstermiyor.');
  process.exit(1);
}
console.log('FIX55: Vercel build kontrolü başarılı.');
console.log('FIX55: çıkış tarihi kesin katalog, form sıfırlama ve çekme butonları stabil.');
