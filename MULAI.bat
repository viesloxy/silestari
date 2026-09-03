@echo off
title Si Lestari - Launcher
echo ============================================
echo   SI LESTARI - Menjalankan semua server
echo ============================================
echo.
echo [1/2] Menjalankan PocketBase (jendela baru)...
start "PocketBase - JANGAN TUTUP" cmd /k "cd /d "%~dp0apps\pocketbase" && pocketbase.exe serve --http=127.0.0.1:8090"

timeout /t 3 /nobreak >nul

echo [2/2] Menjalankan Next.js (jendela baru)...
start "Next.js Dev - JANGAN TUTUP" cmd /k "cd /d "%~dp0apps\web" && npm run dev"

echo.
echo Menunggu server siap lalu membuka browser...
timeout /t 8 /nobreak >nul
start "" http://localhost:3000

echo.
echo ============================================
echo   SELESAI! Dua jendela server terbuka.
echo   - PocketBase : http://127.0.0.1:8090  (admin: /_/)
echo   - Aplikasi   : http://localhost:3000
echo.
echo   Biarkan KEDUA jendela tetap terbuka
echo   selama aplikasi dipakai. Untuk berhenti:
echo   tutup kedua jendela tersebut.
echo ============================================
pause
