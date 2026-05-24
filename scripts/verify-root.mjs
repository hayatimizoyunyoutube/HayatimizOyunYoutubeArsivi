import fs from 'fs';

const required = [
  'package.json',
  'index.html',
  'vercel.json',
  'vite.config.js',
  'src/main.js',
  'api/index.js',
  'public',
  'supabase/schema.sql'
];

let ok = true;
for (const item of required) {
  if (!fs.existsSync(item)) {
    console.error('EKSİK:', item);
    ok = false;
  } else {
    console.log('OK:', item);
  }
}

const vercel = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
const hasFallback = JSON.stringify(vercel.rewrites || []).includes('/index.html');
if (!hasFallback) {
  console.error('EKSİK: vercel.json /index.html fallback yok');
  ok = false;
} else {
  console.log('OK: vercel.json SPA fallback /index.html');
}

if (!ok) process.exit(1);
console.log('\nKök klasör doğru. GitHub ana dizinine bu dosyalar gitmeli.');
