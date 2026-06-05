# Schema Durumu — v4.0.0

✅ schema.sql gerekli.

Sebep:
- Supabase aktif sürüm kaydı v4.0.0 yapılır.
- Results/status çıktısı v4.0.0 başarılı görünür.
- Bakım modu açılış için kapalı ayarlanır.
- Eksik kolonlar güvenli eklenir.
- Veri silmez.


## v4.0.0 FIX - Oyun Kaydetme
- Oyun ekleme/güncelleme sonrası mevcut oyunların kaybolması engellendi.
- Supabase boş veriyle yerel listeyi ezmez.
- Schema gerekli değil.
