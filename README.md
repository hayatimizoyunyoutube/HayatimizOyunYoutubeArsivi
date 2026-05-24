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

Akıllı Özellik Düzenle Stabil Fix
- Bu paket yeni sürüm değildir; sadece Özellik Planı / Akıllı Özellik sayfasını düzeltir.
- Tarayıcı prompt düzenleme penceresi kaldırıldı.
- Sayfa içi profesyonel özellik düzenleme modalı eklendi.
- Düzenle > Kaydet aynı sayfada çalışır, kart anında güncellenir.
- Siteye Uygula aynı sayfada kalır ve özellik yeşil Sitede aktif durumuna döner.
- AI öneri seçme akışı korunur ve daha stabil hale getirildi.
- ZIP içinde gizli API key/şifre yoktur.

# Hayatımız Oyun - Akıllı Özellik / Siteye Uygula Fix

Bu paket yeni sürüm değildir; hata düzeltme paketidir.

Düzeltilenler:
- Siteye Uygula artık otomatik başka sekmeye atmaz.
- Uygulanan özellik anında yeşil olur.
- Akıllı Özellik Ekle artık direkt yanlış ekleme yapmaz; 4-5 AI önerisi gösterir.
- Kullanıcı önerilerden birini seçerek siteye uygular.
- Özel istekler sadece plan/öneri olarak tabloya kaydedilir.
- Aktif özellik bölümü daha profesyonel hale getirildi.
- Modal karmaşası kaldırıldı.

Gizli API key/şifre yoktur.
