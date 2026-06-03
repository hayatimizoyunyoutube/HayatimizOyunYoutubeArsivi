# v2.1.1 FIX - Site İçi İzleme, Kalite, Alfabetik Sıralama, Yetki ve Bakım

Yeni sürüm yapılmadı; v2.1.1 üzerinde fix paketi hazırlandı.

## Yapılanlar
- Site içinden izleme sayfası eklendi: `/izle?id=...`
- YouTube video/playlist embed oynatıcı eklendi.
- Kalite tercihi paneli eklendi: Otomatik, 1080p, 720p, 480p, 360p.
- Alfabetik sıralama sayfası eklendi: `/alfabetik-siralama`
- 0-9 ile başlayan oyunlar ayrı grup yapıldı.
- Oyun kartlarına Siteden İzle butonu eklendi.
- Hikaye metni profesyonel Türkçe anlatım üretecek şekilde düzeltildi.
- 007 First Light için istenen tarzda hikaye metni eklendi.
- Kayıtlı kullanıcıları görme ekranı eklendi: `/yonetim/kullanicilar`
- Kullanıcı yetkisi verme/değiştirme alanı eklendi.
- Rol adları Türkçe korundu: Kurucu, Moderatör, İçerik Editörü, Üye.
- Bakım modu Supabase yenileme açık yerel ayarı kapalı uzak ayarla ezmeyecek şekilde düzeltildi.

## Schema
Schema gerekli değil. Yeni tablo/kolon eklenmedi. Mevcut `site_users` ve `site_runtime_config` yapısı kullanıldı.
