@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Hayatımız Oyun - VS Code Localhost Önizleme
cls
echo =====================================================
echo   Hayatımız Oyun - Localhost Önizleme / FIX26
echo =====================================================
echo.
echo Bu dosya siteyi yayınlamadan önce bilgisayarında açar.
echo Adres: http://localhost:5173
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo [HATA] Node.js bulunamadı. Önce Node.js LTS kur.
  echo https://nodejs.org
  pause
  exit /b 1
)
where code >nul 2>nul
if not errorlevel 1 (
  echo VS Code açılıyor...
  start "" code .
) else (
  echo VS Code komutu bulunamadı. Sorun değil, localhost yine açılacak.
)
if not exist node_modules (
  echo.
  echo Paketler kuruluyor. Bu sadece ilk açılışta biraz sürebilir...
  call npm install
  if errorlevel 1 (
    echo [HATA] npm install başarısız oldu.
    pause
    exit /b 1
  )
)
echo.
echo Tarayıcı açılıyor...
start "" http://localhost:5173
echo.
echo Local sunucu başlatılıyor. Kapatmak için bu pencerede CTRL + C yap.
call npm run local
pause
