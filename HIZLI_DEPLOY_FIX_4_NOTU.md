# v2.4.0 FIX 4 - Hızlı Deploy Notu

Bu paket ultra statik değildir; Supabase/API ve gerçek kayıtlar korunur.

Ama Vercel beklemesini azaltmak için:
- `dist/` hazır gelir.
- `package.json` bağımlılıksızdır.
- `package-lock.json` kaldırıldı.
- `vercel.json` install/build için echo komutu kullanır.
- Kaynak kod `src/` ve `api/` içinde korunur.
- Geliştirme gerekirse `package.dev.json` içeriği `package.json` yapılabilir.

Vercel ayarı:
- Install Command: boş bırak veya vercel.json kullansın.
- Build Command: boş bırak veya vercel.json kullansın.
- Output Directory: dist
- Framework: Other veya Vite olabilir.

Vercel logunda hâlâ `npm install --no-audit --no-fund` görürsen Project Settings içinde manuel Install Command kalmıştır.
