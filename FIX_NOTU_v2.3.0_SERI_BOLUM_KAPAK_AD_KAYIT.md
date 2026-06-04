# 🎬 FIX v2.3.0 — Seri Bölüm Kapak / Ad Kayıt Koruma

## Yapılanlar

- 🎬 Playlistten çekilen bölüm adları kayıt ederken korunur.
- 🖼️ YouTube bölüm kapakları oyun/site kapağıyla ezilmez.
- 💾 Supabase'e `episodes` alanı kapak, ad, videoId ve videoUrl ile yazılır.
- 🔁 Supabase yenilemede eski doğru bölüm listesi silinmez.
- 🛡️ Bölüm görseli yoksa önce oyun kapağı, en son site kapağı kullanılır.

## Schema Durumu

**schema.sql gerekli değil** ✅

Yeni tablo/kolon yoktur; sadece bölüm kayıt ve gösterim mantığı düzeltilmiştir.
