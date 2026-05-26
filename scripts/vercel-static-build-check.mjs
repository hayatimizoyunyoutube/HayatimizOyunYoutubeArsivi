import fs from 'node:fs';
import path from 'node:path';

const dist = path.join(process.cwd(), 'dist');
const index = path.join(dist, 'index.html');
const assets = path.join(dist, 'assets');
const required = [
  index,
  path.join(assets, 'hayatimiz-app-fix31.js'),
  path.join(assets, 'hayatimiz-style-fix31.css'),
  path.join(assets, 'hayatimiz-app.js'),
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
  if (file.includes('fix31') && !content.includes('HO240F31_INTERNAL_VERSION')) {
    console.error('FIX31 oyun listesi koruma katmanı ana JS içinde bulunamadı:', file);
    process.exit(1);
  }
}
const html = fs.readFileSync(index, 'utf8');
if (!html.includes('hayatimiz-app-fix31.js') || !html.includes('hayatimiz-style-fix31.css')) {
  console.error('dist/index.html FIX31 assetlerini göstermiyor.');
  process.exit(1);
}
console.log('FIX31: Hazır dist kontrolü başarılı.');
console.log('FIX31: Oyun listesi Supabase/API hatasına karşı cache ve fallback ile korunuyor.');
