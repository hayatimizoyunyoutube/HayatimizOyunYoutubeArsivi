import fs from 'node:fs';
import path from 'node:path';
const dist = path.join(process.cwd(), 'dist');
const required = ['index.html','404.html','assets/hayatimiz-app-fix64.js','assets/hayatimiz-app.js','assets/hayatimiz-style-fix64.css','assets/hayatimiz-style.css'];
for (const f of required){ const p=path.join(dist,f); if(!fs.existsSync(p) || fs.statSync(p).size < 10){ console.error('Eksik veya boş dosya:', p); process.exit(1); } }
const js = fs.readFileSync(path.join(dist,'assets/hayatimiz-app-fix64.js'),'utf8');
for (const marker of ['v2.5.6 Temiz Çalışan','HO240F64_INTERNAL_VERSION']){ if(!js.includes(marker)){ console.error('Marker eksik:', marker); process.exit(1); } }
const html = fs.readFileSync(path.join(dist,'index.html'),'utf8');
if(!html.includes('hayatimiz-app-fix64.js') || !html.includes('hayatimiz-style-fix64.css')){ console.error('Asset bağlantısı eksik'); process.exit(1); }
console.log('v2.5.6 temiz çalışan paket kontrolü başarılı.');
