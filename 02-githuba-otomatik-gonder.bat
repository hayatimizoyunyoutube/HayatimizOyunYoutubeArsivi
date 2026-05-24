@echo off
chcp 65001 >nul
title Hayatımız Oyun - GitHub Temiz Force Push
cd /d "%~dp0"

echo.
echo GitHub'a temiz yukleme basliyor...
echo DİKKAT: Bu islem GitHub main branch icerigini bu klasorle degistirir.
echo.

if not exist package.json (
  echo HATA: package.json yok. Yanlis klasordesin.
  pause
  exit /b 1
)

git init
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/hayatimizoyunyoutube/HayatimizOyunYoutubeArsivi.git
git add .
git commit -m "v2.2.3 FIX 7 Vercel 404 final root fix"
git push -f origin main

echo.
echo GitHub push tamamlandiysa Vercel > Redeploy > Clear Build Cache yap.
pause
