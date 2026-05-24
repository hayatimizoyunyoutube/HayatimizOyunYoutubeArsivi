HAYATIMIZ OYUN v2.1.2 KURULUM SIRASI

1) Supabase
- supabase/schema.sql dosyasını SQL Editor içinde çalıştır.
- Bu sürüm games tablosuna series_name, playlist_url, description ve favorite_count alanlarını ekler.

2) Temiz Kurulum
- Proje klasöründe .git klasörünü SİLME.
- 01-siteyi-temizle-git-ve-bat-haric.bat çalıştır.
- ZIP içeriğini proje klasörünün içine çıkar.

3) GitHub
- 02-githuba-otomatik-gonder.bat çalıştır.

4) Vercel
- Redeploy > Clear Build Cache yap.
- Vercel ENV içinde RAWG_API_KEY varsa kapak/meta gerçek API ile gelir.
- YOUTUBE_API_KEY varsa playlist bölüm sayısı otomatik çekilir.

5) Test
- Yönetim Paneli > Oyunlar > + Oyun Ekle.
- Oyun adını yazıp RAWG sonuçlarını getir.
- Doğru sonucu seç.
- Kaydetmeden oyun eklenmediğini kontrol et.
