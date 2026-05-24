@echo off
chcp 65001 >nul
setlocal
cls
echo =====================================================
echo  Hayatımız Oyun - GitHub Temiz Gonderim / Build Fix
echo =====================================================
echo.
echo Bu dosya node_modules, dist ve eski agir dosyalari GitHub'dan da temizler.
echo Yeni surum degil; sadece hata duzeltme gonderimidir.
echo.
where git >nul 2>nul
if errorlevel 1 (
  echo Git bulunamadi. Once Git kurulmali.
  echo PowerShell: winget install --id Git.Git -e --source winget
  pause
  exit /b 1
)
if exist "node_modules" (
  echo node_modules klasoru bulundu, siliniyor...
  rmdir /s /q "node_modules"
)
if exist "dist" (
  echo dist klasoru bulundu, siliniyor...
  rmdir /s /q "dist"
)
if exist ".vercel" (
  echo .vercel klasoru bulundu, siliniyor...
  rmdir /s /q ".vercel"
)

echo.
echo Git temizleme basladi...
git init
git branch -M main
git remote remove origin >nul 2>nul
git remote add origin https://github.com/hayatimizoyunyoutube/HayatimizOyunYoutubeArsivi.git

echo Eski node_modules/dist GitHub takibinden kaldiriliyor...
git rm -r --cached node_modules dist .vercel >nul 2>nul

echo Tum degisiklikler ekleniyor...
git add -A

git commit -m "build hata duzeltme node_modules temizlendi"
git push -f origin main

echo.
echo Bitti. Vercel'de Deployments sayfasindan yeni redeploy yap.
echo Clear Build Cache secili olsun.
pause
