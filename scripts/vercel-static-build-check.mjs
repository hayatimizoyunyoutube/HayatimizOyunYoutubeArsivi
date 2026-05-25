import fs from 'node:fs';
import path from 'node:path';

const dist = path.join(process.cwd(), 'dist');
const index = path.join(dist, 'index.html');
const assets = path.join(dist, 'assets');
const required = [
  index,
  path.join(assets, 'hayatimiz-app-fix20.js'),
  path.join(assets, 'hayatimiz-style-fix20.css')
];
for (const file of required) {
  if (!fs.existsSync(file)) {
    console.error('Eksik hazır deploy dosyası:', file);
    process.exit(1);
  }
}
console.log('FIX20: Vite build atlandı. Hazır dist klasörü Vercel çıktısı olarak kullanılacak.');
console.log('FIX20: index.html + asset dosyaları hazır.');
