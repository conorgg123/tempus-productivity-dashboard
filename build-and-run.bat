@echo off
echo ========= PRODUCTIVITY DASHBOARD =========
echo.
echo Step 1: Installing dependencies...
call npm install autoprefixer postcss tailwindcss

echo.
echo Step 2: Cleaning up...
taskkill /F /IM electron.exe /T 2>nul
if exist ".next" rmdir /s /q .next
if exist "out" rmdir /s /q out
if exist "node_modules\.cache" rmdir /s /q node_modules\.cache

echo.
echo Step 3: Building static files...
call npm run build

echo.
echo Step 4: Starting Electron in production mode...
set NODE_ENV=production
start cmd /k "npx electron ."

echo.
echo App started! You can close this window. 