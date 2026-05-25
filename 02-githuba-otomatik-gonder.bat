@echo off
setlocal EnableExtensions
chcp 65001 >nul
cd /d "%~dp0"
cls
echo ================================================
echo HAYATIMIZ OYUN - GITHUB TEMIZ FORCE PUSH 02
echo ================================================
echo.
echo Bu dosya package.json aramaz.
echo npm install veya npm run build calistirmaz.
echo Klasordeki mevcut icerigi GitHub main uzerine force push yapar.
echo.
set REPO=https://github.com/hayatimizoyunyoutube/HayatimizOyunYoutubeArsivi.git

where git >nul 2>nul
if errorlevel 1 (
  echo HATA: Git bulunamadi. Once Git for Windows kur.
  pause
  exit /b 1
)

if not exist ".git" (
  echo .git yok, yeni git deposu olusturuluyor...
  git init
)

git config --global --add safe.directory "%CD%" >nul 2>nul
git branch -M main

git remote remove origin >nul 2>nul
git remote add origin %REPO%

echo.
echo Dosyalar Git'e ekleniyor...
git add -A

echo.
echo Commit olusturuluyor...
git commit -m "temiz yukleme" >nul 2>nul
if errorlevel 1 (
  git commit --allow-empty -m "temiz yukleme" >nul 2>nul
)

echo.
echo GitHub'a temiz force push yapiliyor...
git push -f origin main
if errorlevel 1 (
  echo.
  echo HATA: GitHub push basarisiz oldu.
  echo GitHub hesabina giris/token/izin kontrol et.
  pause
  exit /b 1
)

echo.
echo TAMAM: GitHub temiz yukleme bitti.
echo Sonra Vercel > Deployments > Redeploy > Clear Build Cache yap.
pause
