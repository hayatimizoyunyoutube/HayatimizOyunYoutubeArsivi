# Kurulum Özeti - v2.2.0 FIX 6

1. Proje klasöründe `.git` klasörünü ve BAT dosyalarını koru.
2. Diğer eski proje dosyalarını temizle.
3. Bu ZIP içeriğini proje klasörünün içine çıkar.
4. `npm install` çalıştır.
5. `npm run build` çalıştır.
6. Build başarılıysa GitHub temiz yükleme BAT dosyanı çalıştır.
7. Vercel tarafında Redeploy + Clear Build Cache yap.

Supabase schema değişikliği yoktur. Daha önce v2.2.0 FIX schema çalıştıysa tekrar SQL çalıştırman şart değildir.
