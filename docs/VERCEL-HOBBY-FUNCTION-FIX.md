# Vercel Hobby Serverless Function Fix

Bu paket, Vercel Hobby planındaki şu hatayı düzeltmek için hazırlandı:

```txt
No more than 12 Serverless Functions can be added to a Deployment on the Hobby plan.
```

## Sorun

Önceki birleşik pakette `api/` klasöründe 13 ayrı JavaScript dosyası vardı. Vercel her `api/*.js` dosyasını ayrı Serverless Function saydığı için Hobby plan limiti aşıldı.

## Çözüm

Tüm API dosyaları tek router altında birleştirildi:

```txt
api/index.js
```

Artık Vercel tarafında tek Serverless Function kullanılır.

## Desteklenen route örnekleri

```txt
/api/status
/api/auto-games
/api/auto-sync
/api/archive-export
/api/smart-search?q=oyun
/api/ai-recommendations
/api/watch-progress
/api/notification-feed
/api/theme-presets
/api/automation-studio
/api/test-center
/api/ui-health
/api/error-reports
/api/api-status
```

Aynı route'lar query yöntemiyle de çalışır:

```txt
/api?route=auto-games
/api?route=smart-search&q=oyun
```

## Kurulum

1. Proje klasöründe `.git` hariç her şeyi sil.
2. Bu ZIP içindeki dosyaları direkt proje köküne çıkar.
3. GitHub'a force push yap.
4. Vercel'de Redeploy > Clear Build Cache ile yeniden deploy et.
