# Hayatımız Oyun v2.1.8 - Gelişmiş Otomasyon + Kalıcı Bölüm Senkronizasyonu

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


## v2.1.8 - Gelişmiş Otomasyon + Kalıcı Bölüm Senkronizasyonu
- Yönetim panelindeki form alt butonları düzenlendi.
- Hikayesi/Açıklama alanı Türkçe hikaye çekme butonuyla doldurulur.
- Playlistten bölüm çekme sonrası bölüm listesi ve toplam bölüm formda kalıcı görünür.
- Edit formunda Meta/Playlist işlemleri formu sıfırlamaz.


## v2.1.8 Notu
- Supabase schema.sql tekrar çalıştırılmalı.
- Bölüm izlendi kaydı artık Supabase games.episodes ve watched_episode_count alanlarına yazılır.
- Seriler kategorisi yönetim panelindeki seri sıra numarasını kullanır.


## v2.1.8 Notu
Tam otomatik yayın takvimi, gelişmiş medya yönetimi, burada kaldım/geri al, sinema modu, toplu playlist senkronizasyonu ve profesyonel bakım ekranı eklendi.
