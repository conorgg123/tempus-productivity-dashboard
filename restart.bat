@echo off
echo Restarting the Productivity Dashboard...

:: Kill any running processes
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM electron.exe /T 2>nul
timeout /t 2 /nobreak >nul

:: Clean cache directories
if exist ".next" (
  echo Cleaning .next directory...
  rmdir /s /q .next
)

if exist "node_modules\.cache" (
  echo Cleaning node_modules\.cache...
  rmdir /s /q node_modules\.cache
)

:: Start Next.js server
echo Starting Next.js server...
start cmd /k "npx next dev -p 3005"

:: Wait for Next.js to start
echo Waiting for Next.js to initialize (15 seconds)...
timeout /t 15 /nobreak >nul

:: Start Electron
echo Starting Electron...
start cmd /k "npx electron ."

echo Application started successfully!
echo.
echo If you see a blank screen:
echo 1. Wait a few seconds for Next.js to fully initialize
echo 2. Check if there are errors in the Next.js console window
echo 3. Try refreshing the Electron window (Ctrl+R)
echo. 