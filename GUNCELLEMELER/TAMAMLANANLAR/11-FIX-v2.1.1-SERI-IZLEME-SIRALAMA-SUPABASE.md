# v2.1.1 FIX - Seri İzleme, Seri Yönetimi ve Supabase Kayıt

Bu paket yeni sürüm değildir; v2.1.1 üzerine FIX olarak hazırlanmıştır.

## Eklenen / Düzeltilenler
- Seriler sayfasına **Tüm Seriyi İzle** butonu eklendi.
- `/izle?series=...` ile seri içindeki oyunları sırayla izleme görünümü eklendi.
- Yönetim paneline **Serileri Yönet** sayfası eklendi.
- Seri içindeki oyunları seçme / çıkarma eklendi.
- Seri adını düzenleme eklendi.
- Seri oyun sırası sürükle-bırak ile düzenlenebilir hale getirildi.
- Seri oyun sırası sayı yazarak düzenlenebilir hale getirildi.
- Mobil için yukarı/aşağı sıralama butonları eklendi.
- Seri düzenleme kayıtları local kayıt + Supabase kalıcı kayıt olarak çalışacak şekilde bağlandı.
- Supabase için yeni sıfırlama yapılmadı; mevcut `games.series_name`, `games.series_order`, `games.sort_order`, `games.collection_name` alanları kullanıldı.

## Schema Durumu
Schema gerekli değil. Yeni tablo veya zorunlu kolon eklenmedi.
