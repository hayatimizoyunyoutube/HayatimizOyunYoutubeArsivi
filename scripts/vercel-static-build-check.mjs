import fs from 'node:fs';
import path from 'node:path';

const dist = path.join(process.cwd(), 'dist');
const index = path.join(dist, 'index.html');
const assets = path.join(dist, 'assets');
const required = [
  index,
  path.join(assets, 'hayatimiz-app-fix23.js'),
  path.join(assets, 'hayatimiz-style-fix23.css'),
  path.join(assets, 'hayatimiz-app-fix22.js'),
  path.join(assets, 'hayatimiz-style-fix22.css')
];
for (const file of required) {
  if (!fs.existsSync(file)) {
    console.error('Eksik hazır yayın dosyası:', file);
    process.exit(1);
  }
}
console.log('FIX23: Vite build atlandı. Hazır dist klasörü kullanılacak.');
console.log('FIX23: AI ve site içi yayına alma panelleri kaldırıldı.');
