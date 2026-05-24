@echo off
chcp 65001 >nul
title Hayatımız Oyun - Vercel 404 Kontrol
echo.
echo ===============================
echo  VERCEL 404 KOK KLASOR KONTROL
echo ===============================
echo.
cd /d "%~dp0"
echo Klasor: %cd%
echo.
if not exist package.json (
  echo HATA: package.json bu klasorde yok.
  echo ZIP icindeki dosyalari tek tek proje klasorunun KOKUNE cikarmalisin.
  pause
  exit /b 1
)
if not exist index.html (
  echo HATA: index.html bu klasorde yok.
  pause
  exit /b 1
)
if not exist vercel.json (
  echo HATA: vercel.json bu klasorde yok.
  pause
  exit /b 1
)
if not exist src\main.js (
  echo HATA: src\main.js yok.
  pause
  exit /b 1
)
if not exist api\index.js (
  echo HATA: api\index.js yok.
  pause
  exit /b 1
)
echo KOK DOSYALAR TAMAM.
echo.
call npm install
if errorlevel 1 goto fail
call npm run build
if errorlevel 1 goto fail
echo.
echo BUILD BASARILI. Simdi GitHub'a temiz push yapabilirsin.
pause
exit /b 0
:fail
echo.
echo HATA: npm install veya build basarisiz.
pause
exit /b 1
