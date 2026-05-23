@echo off
chcp 65001 >nul
setlocal
cls
echo =====================================================
echo  Hayatımız Oyun - GitHub Otomatik Gonder
 echo =====================================================
echo.
echo Bu dosya mevcut klasordeki site dosyalarini GitHub'a force push yapar.
echo Remote repo: https://github.com/hayatimizoyunyoutube/HayatimizOyunYoutubeArsivi.git
echo.
where git >nul 2>nul
if errorlevel 1 (
  echo Git bulunamadi. Once Git kurulmali.
  echo Kurulum icin PowerShell: winget install --id Git.Git -e --source winget
  pause
  exit /b 1
)
if not exist "package.json" (
  echo UYARI: package.json bulunamadi. ZIP dosyalarini proje kokune cikardigindan emin ol.
  echo.
)
set /p MSG=Commit mesaji yaz veya bos birak: 
if "%MSG%"=="" set MSG=v2.1.4.3 ui assets bat update

echo.
echo Git islemleri basladi...
git init
git branch -M main
git remote remove origin >nul 2>nul
git remote add origin https://github.com/hayatimizoyunyoutube/HayatimizOyunYoutubeArsivi.git
git add .
git commit -m "%MSG%"
git push -f origin main

echo.
echo GitHub gonderme islemi bitti.
echo Sonra Vercel'de Redeploy ^> Clear Build Cache yap.
pause
