# Hayatımız Oyun - v2.1.5

Gerçek Storage + Gelişmiş İzleme sürümü.

## Bu sürümde

- Supabase Storage `profile-photos` bucket ile gerçek profil fotoğrafı yükleme.
- Oyunlarda toplam bölüm hedefi ve izlenen bölüm sayısı ayrı alanlar.
- Seri sıra numarası alanı.
- Seriyi İzle detay ekranı ve bölüm listesi.
- Alfabetik arşivde aktif harf görünümü.
- Harf başlıkları: `A Harfinde Başlayan Seriler`.
- Admin oyun kartı/kapak oranı düzeltmesi.
- Bakım modunda geri sayım metni.
- Güncelleme notu düzenle/sil API altyapısı.

## Kurulum

1. `.git` ve BAT dosyalarını koru.
2. Eski proje dosyalarını temizle.
3. Bu ZIP içeriğini proje klasörüne çıkar.
4. `npm install` ve `npm run build` ile kontrol et.
5. `02-githuba-otomatik-gonder.bat` ile GitHub'a gönder.
6. Vercel'de Redeploy > Clear Build Cache yap.
7. Supabase için `supabase/schema.sql` çalıştır.
8. Storage hata verirse Supabase Dashboard > Storage > New bucket > `profile-photos` > Public olarak elle oluştur.
