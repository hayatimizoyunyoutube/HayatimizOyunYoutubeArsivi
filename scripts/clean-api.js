const fs = require('fs');
const path = require('path');
const apiDir = path.join(process.cwd(), 'api');
const allowed = new Set([
  'auth.js','calendar.js','games.js','health.js','logs.js','notes.js',
  'rawg.js','settings.js','social.js','upload.js','users.js','youtube.js'
]);
if (fs.existsSync(apiDir)) {
  for (const file of fs.readdirSync(apiDir)) {
    const full = path.join(apiDir, file);
    if (fs.statSync(full).isFile() && file.endsWith('.js') && !allowed.has(file)) {
      fs.rmSync(full, { force: true });
      console.log('[clean-api] removed extra api function:', file);
    }
  }
}
const count = fs.existsSync(apiDir) ? fs.readdirSync(apiDir).filter(f => f.endsWith('.js')).length : 0;
console.log('[clean-api] api js count:', count);
if (count > 12) {
  console.error('[clean-api] Hata: api klasöründe 12’den fazla JS var.');
  process.exit(1);
}
