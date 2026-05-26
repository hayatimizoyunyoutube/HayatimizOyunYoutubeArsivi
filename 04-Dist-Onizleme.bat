@echo off
chcp 65001 >nul
cd /d "%~dp0"
title Hayatımız Oyun - Dist Önizleme
cls
echo Hazır dist klasörünü localde kontrol eder.
echo Adres: http://localhost:4173
echo.
if not exist node_modules call npm install
start "" http://localhost:4173
call npm run preview
pause
