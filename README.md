# Hayatımız Oyun v2.1.6

Büyük Arşiv Otomasyonu + Bölüm Yönetimi sürümü.

## Bu sürümde

- YouTube playlist URL'sinden bölüm listesi import paneli.
- Bölüm başlığı, açıklaması, küçük kapak ve video linki alanları.
- Seriyi İzle ekranı site içi sinema görünümüne taşındı: solda oynatıcı, sağda bölümler.
- Bölüm bazlı izlendi işaretleme ve otomatik ilerleme.
- Admin panelinde seri gruplama ve seri sıra no kontrolü.
- Hatalı / boş YouTube link sağlık paneli.
- Ana sayfada toplam seri, toplam bölüm, izlenen bölüm ve tamamlanan seri istatistikleri.
- Kart / kompakt liste görünüm seçici.

## Kurulum

1. `.git` ve BAT dosyalarını koru.
2. Eski proje dosyalarını temizle.
3. Bu ZIP içeriğini proje klasörüne çıkar.
4. `02-githuba-otomatik-gonder.bat` çalıştır.
5. Vercel > Redeploy > Clear Build Cache yap.
6. Supabase SQL Editor içinde `supabase/schema.sql` çalıştır.

## YouTube import için ENV

Vercel ortam değişkenlerinde `YOUTUBE_API_KEY` olursa playlist bölümleri başlık/kapak/video linkiyle çekilir. Key yoksa manuel bölüm listesi girilebilir.
