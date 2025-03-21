@echo off
echo ========= FIXING GLOBAL IS NOT DEFINED ERROR =========
echo Terminating existing processes...
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM electron.exe /T 2>nul
timeout /t 2 /nobreak >nul

echo Cleaning build directories...
if exist ".next" rmdir /s /q .next
if exist "node_modules\.cache" rmdir /s /q node_modules\.cache

echo Starting Next.js...
start cmd /k "npx next dev"

echo Waiting for Next.js to initialize (15 seconds)...
timeout /t 15 /nobreak >nul

echo Starting Electron...
start cmd /k "set NODE_OPTIONS=--no-warnings && npx electron ."

echo Application started!
echo.
echo If you still see "global is not defined" errors:
echo 1. Try refreshing the Electron window (Ctrl+R)
echo 2. Check the browser console for other errors
echo 3. Make sure your Next.js server is running properly
echo. 