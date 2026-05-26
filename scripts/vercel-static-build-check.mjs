import fs from 'node:fs';
import path from 'node:path';

const dist = path.join(process.cwd(), 'dist');
const index = path.join(dist, 'index.html');
const assets = path.join(dist, 'assets');
const required = [
  index,
  path.join(assets, 'hayatimiz-app-fix48.js'),
  path.join(assets, 'hayatimiz-app.js'),
  path.join(assets, 'hayatimiz-style-fix48.css'),
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
const latest = fs.readFileSync(path.join(assets, 'hayatimiz-app-fix48.js'), 'utf8');
if (!latest.includes('HO240F48_INTERNAL_VERSION') || !latest.includes('ho240f48OpenGameEditModal') || !latest.includes('HO240F48_PUBLIC_VERSION')) {
  console.error('FIX48 sürüm/modal düzeltme işareti eksik.');
  process.exit(1);
}
const html = fs.readFileSync(index, 'utf8');
if (!html.includes('hayatimiz-app-fix48.js') || !html.includes('hayatimiz-style-fix48.css')) {
  console.error('dist/index.html FIX48 assetlerini göstermiyor.');
  process.exit(1);
}
console.log('FIX48: Vercel build kontrolü başarılı.');
console.log('FIX48: v2.4.1 sürüm, Supabase schema notu ve modal düzenleme fix hazır.');
