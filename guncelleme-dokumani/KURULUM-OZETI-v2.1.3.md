# Kurulum Özeti - v2.1.3

1. ZIP'i proje klasörüne çıkar.
2. Eski dosyaları temizlerken `.git` ve BAT dosyalarını koru.
3. Supabase tarafında önce `supabase/schema.sql` çalıştır.
4. Storage bölümünde `cover-images` ve `profile-photos` bucket adlarını oluştur.
5. Vercel ortam değişkenlerinde Supabase URL, anon key, service role key ve gerekiyorsa RAWG / YouTube API key değerlerini gir.
6. `npm install` ve `npm run build` ile test et.
7. `02-githuba-otomatik-gonder.bat` ile GitHub'a temiz force push yap.
