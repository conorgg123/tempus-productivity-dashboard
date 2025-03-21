@echo off
echo ========= PRODUCTIVITY DASHBOARD =========
echo.
echo Starting application...

:: Install any missing dependencies
echo Installing dependencies...
call npm install --no-fund

:: Clean any previous build artifacts
echo Cleaning previous build files...
if exist ".next" rmdir /s /q .next
if exist "node_modules\.cache" rmdir /s /q node_modules\.cache

:: Kill any running processes
echo Terminating existing processes...
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM electron.exe /T 2>nul
timeout /t 2 /nobreak >nul

:: Start the app with the electron-dev script
echo Starting Next.js and Electron...
npm run electron-dev

echo.
echo If the application doesn't start:
echo 1. Make sure you have Node.js installed
echo 2. Check for any error messages in the window
echo 3. Try running: npm install electron --save-dev
echo.
echo Application process started. You can close this window. 