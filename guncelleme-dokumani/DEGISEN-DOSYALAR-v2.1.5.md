AI Düzenle Öneri + Kategori Fix
- Bu paket yeni sürüm değildir; Akıllı Özellik / Düzenle sayfası için fix paketidir.
- Düzenle butonuna basınca artık 4-5 yeni düzenleme önerisi gösterilir.
- Öneri ekranında “Bunlardan hangisi istediğiniz doğrultusunda?” mantığı eklendi.
- Seçilen öneri düzenlenmiş haliyle Siteye Uygula yapılır.
- Seçimden sonra özellik yeşil aktif duruma döner.
- Seçilen düzenleme local cache + Supabase site_features/site_admin_planner akışına gönderilir.
- Siteye uygulama sonrası F5 yenileme akışı eklendi; oturum korunur.
- Site adresindeki kategori/panel yolu algılanır: #/kategori/korku, #/admin/oyunlar gibi adreslerde öneriler o kategoriye göre şekillenir.
- Oyunlar, Özellik Planı, Güncelleme Notları, Bakım Modu, Profil ve public kategoriler için bağlama göre öneri hedefi ayarlanır.
- Eksik loadFeatures fonksiyonu eklendi; Siteye Uygula + yenile akışı daha stabil hale getirildi.
- API tarafında hazır modül uygulanırken düzenlenen başlık/açıklama artık yok sayılmaz.
- Build testi başarılı: 291ms.
- ZIP içinde gizli API key/şifre yoktur.


Değişen dosyalar:
- src/main.js
- src/styles.css
- api/index.js
- README.md
- VERSION_NOTES.md

# Değişen Dosyalar - v2.1.5

- `src/main.js` sürüm adı güncellendi.
- `src/styles.css` sürüm notu güncellendi.
- `api/index.js` health version güncellendi.
- `package.json` adı ve version güncellendi.
- `KURULUM-KOMUTLARI.txt` yeniden yazıldı.
- `README.md` yeniden yazıldı.
- `VERSION_NOTES.md` güncellendi.
- `supabase/OKU-ONCE-SUPABASE-SIRASI.txt` güncellendi.
- `supabase/YETKI-ORNEK-SQL-v215.sql` eklendi.
- Eski `YETKI-ORNEK-SQL-v*.sql` dosyaları kaldırıldı.
- `kurulum-gorselleri/` temizlenip sadece `v2.1.5` klasörü bırakıldı.
