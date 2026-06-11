# Hayatımız Oyun v4.0.2 - YouTube Episodes Reset Fix

Bu paket yeni özellik eklemeden önce temel veri akışını düzeltir.

## Yapılan kesin düzeltmeler

- Supabase `games` tablosu reset uyumlu yeni schema ile düzenlendi.
- Supabase `episodes` tablosu eklendi.
- YouTube oynatma listesi çekme `playlistItems.list` endpoint mantığına kilitlendi.
- Playlistten gelen gerçek videolar artık doğrudan `episodes` tablosuna yazılır.
- `games-list` çıktısı artık `games + episodes` birlikte döndürür.
- Oyun kaydetme/güncelleme sırasında formdaki bölümler Supabase `episodes` tablosuna da işlenir.
- Steam App ID ile Steam kapak/tarih/meta çekme akışı korundu.
- RAWG/meta çekme akışı korundu.
- Kanal logosu/thumbnail sahte fallback üretimi yerine gerçek veri yoksa mevcut liste korunur.
- Yönetim panelinde tablo ve buton taşmaları azaltıldı; yatay kaydırma sadece tablo içinde kaldı.

## Supabase kurulumu

1. Supabase SQL Editor aç.
2. `schema.sql` içeriğini çalıştır.
3. Bu dosya istek üzerine reset yapar: `games` ve `episodes` boş başlar.
4. Vercel Environment Variables içinde şunlar olmalı:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `YOUTUBE_API_KEY`
   - RAWG kullanıyorsan `RAWG_API_KEY`

## YouTube kontrol

Oyun düzenleme ekranında playlist URL girip **Oynatma Listesi Çek** dediğinde:

- API `playlistItems.list` ile videoları çeker.
- Video başlığı, video ID, thumbnail ve URL normalize edilir.
- Sonuçlar `episodes` tablosuna kaydedilir.
- Oyun kartında bölüm sayısı güncellenir.

## Sürüm etiketi

Aktif paket: `v4.0.2-youtube-episodes-reset-fix`
