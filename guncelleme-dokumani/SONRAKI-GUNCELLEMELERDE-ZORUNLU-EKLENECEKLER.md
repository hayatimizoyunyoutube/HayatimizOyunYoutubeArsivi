# Sonraki Güncellemelerde Zorunlu Eklenecekler

Bundan sonraki her ZIP güncellemesinde şu klasör ve dosyalar mutlaka eklenecek:

1. `site-gorselleri/vX.X.X/`
   - Kullanıcı ana sayfası görseli
   - Yönetim paneli görseli
   - Mobil görünüm görseli
   - Varsa yeni özellik paneli görseli

2. `gelecek-guncelleme-ozellikleri-ve-resimler/vX.X.X-resimler/`
   - Sonraki sürümde planlanan özellik görselleri
   - Öneri ekranı veya panel tasarım görselleri

3. `kurulum-gorselleri/vX.X.X/`
   - Supabase kurulumu
   - Temiz kurulum
   - GitHub gönderme
   - Vercel redeploy
   - Test adımı

4. `guncelleme-dokumani/`
   - Değişen dosyalar listesi
   - Kurulum özeti
   - Eklenen / düzeltilen özellikler

5. Sadece 2 BAT dosyası kalacak:
   - `01-siteyi-temizle-git-ve-bat-haric.bat`
   - `02-githuba-otomatik-gonder.bat`

6. ZIP içine gizli key, admin şifresi, Supabase service key eklenmeyecek.
