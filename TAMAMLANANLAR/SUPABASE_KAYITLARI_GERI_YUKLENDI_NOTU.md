# Supabase Kayıtları Geri Yüklendi

Bu paket ultra statik deploy paketinden farklıdır. `src`, `api`, `package.json` ve `supabase` klasörleri tekrar pakete dahil edildi.

Böylece site oyunları tekrar Supabase `games` tablosundan çeker.

Önemli:
- Demo/rastgele oyun listesi kapatıldı.
- Supabase bağlantısı yoksa rastgele oyun gösterilmez.
- Oyun Arşivi ve Seriler tekrar kompakt 4 kolon yapıya alındı.
- Bu paket için Vercel normal Vite build yapar; ultra statik paket gibi kaynak dosyaları çıkarmaz.
