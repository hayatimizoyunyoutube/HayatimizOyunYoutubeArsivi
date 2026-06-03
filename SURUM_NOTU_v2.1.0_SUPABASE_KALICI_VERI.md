# Sürüm Notu - v2.1.0 Supabase Kalıcı Veri Geri Dönüş

Bu sürümde oyun verisi için Supabase kalıcı kayıt sistemi kontrollü şekilde geri getirildi. Site local stabil yapıyı korur; Supabase API veya environment değişkenlerinde hata varsa kullanıcı boş ekran görmez, local güvenli mod devam eder.

## Schema Durumu
Gerekli. `supabase/schema.sql` çalıştırılmalı. Dosya sıfırlamaz, `DROP TABLE` içermez ve mevcut verileri silmez.
