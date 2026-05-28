import fs from 'node:fs';
import path from 'node:path';

const dist = path.join(process.cwd(), 'dist');
const index = path.join(dist, 'index.html');
const assets = path.join(dist, 'assets');
const required = [
  index,
  path.join(assets, 'hayatimiz-app-fix64.js'),
  path.join(assets, 'hayatimiz-app.js'),
  path.join(assets, 'hayatimiz-style-fix64.css'),
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
const latest = fs.readFileSync(path.join(assets, 'hayatimiz-app-fix64.js'), 'utf8');
for (const marker of ['HO240F64_INTERNAL_VERSION','ho240f64SeriesCard','ho240f64MaintenanceNotes','ho240f64Topbar','ho240f64AllMiniList']) {
  if (!latest.includes(marker)) {
    console.error('FIX64 işareti eksik:', marker);
    process.exit(1);
  }
}
const html = fs.readFileSync(index, 'utf8');
if (!html.includes('hayatimiz-app-fix64.js') || !html.includes('hayatimiz-style-fix64.css')) {
  console.error('dist/index.html FIX64 assetlerini göstermiyor.');
  process.exit(1);
}
console.log('v2.5.2 FIX13: Vercel build kontrolü başarılı.');
console.log('v2.5.2 FIX13: Seri kartları, bakım modu, menü taşması ve paket temizliği stabil.');
