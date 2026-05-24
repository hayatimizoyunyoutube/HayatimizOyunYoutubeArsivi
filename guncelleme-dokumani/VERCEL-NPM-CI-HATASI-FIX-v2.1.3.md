# Vercel npm ci Hatası Fix - v2.1.3 fix.2

## Hata
Vercel build sırasında şu hata geliyordu:

```txt
npm error The `npm ci` command can only install with an existing package-lock.json or npm-shrinkwrap.json
npm error Clean install a project
```

## Neden oldu?
Önceki fix paketinde `vercel.json` içinde install komutu `npm ci --no-audit --no-fund` yapılmıştı. `npm ci` çalışması için GitHub'a yüklenen proje kökünde mutlaka `package-lock.json` bulunmalı. Vercel build anında lock dosyasını göremediği için kurulum başlamadan hata verdi.

## Yapılan düzeltme
`vercel.json` içindeki install komutu şu şekilde düzeltildi:

```json
"installCommand": "npm install --no-audit --no-fund"
```

Bu komut `package-lock.json` olmasa bile bağımlılıkları kurar ve Vercel build'i devam eder.

## Not
Sarı `Detected engines` uyarısı hata değildir. Asıl kırmızı hata `npm ci` hatasıydı.
