@echo off
echo ========= RUNNING APP LOCALLY (NO SERVER) =========
echo.
echo Step 1: Building static files...
call npm run build

echo.
echo Step 2: Terminating any existing processes...
taskkill /F /IM electron.exe /T 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Step 3: Starting Electron in local mode...
set NODE_ENV=production
start cmd /k "npx electron ."

echo.
echo App is now running in local mode without any server!
echo The app is loading completely from static files.
echo You can close this window.
echo. 