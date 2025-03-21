@echo off
setlocal enabledelayedexpansion

echo ========= STARTING PRODUCTIVITY DASHBOARD =========
echo Terminating existing processes...
taskkill /F /IM node.exe /T 2>nul
taskkill /F /IM electron.exe /T 2>nul
timeout /t 2 /nobreak >nul

echo Cleaning build directories...
if exist ".next" rmdir /s /q .next
if exist "node_modules\.cache" rmdir /s /q node_modules\.cache

echo Installing required packages if needed...
call npm install --no-fund

echo Starting Next.js server...
start cmd /k "npx next dev"

echo Waiting for Next.js to initialize (20 seconds)...
timeout /t 20 /nobreak >nul

echo Finding Next.js port...
set NEXT_PORT=
for /f "tokens=5" %%p in ('netstat -ano ^| findstr "LISTENING" ^| findstr ":300[0-9]"') do (
  for /f "tokens=2 delims=:" %%q in ("%%p") do (
    set NEXT_PORT=%%q
    echo Found Next.js on port: !NEXT_PORT!
  )
)

if defined NEXT_PORT (
  echo Starting Electron with port !NEXT_PORT!...
  start cmd /k "set ELECTRON_START_URL=http://localhost:!NEXT_PORT! && npx electron ."
) else (
  echo No Next.js port found, trying default ports...
  start cmd /k "set ELECTRON_START_URL=http://localhost:3000 && npx electron ."
)

echo Application should now be running!
echo If you still have issues:
echo 1. Try refreshing the Electron window (Ctrl+R)
echo 2. Check the Next.js window for errors
echo 3. Make sure electron is installed (npm install electron --save-dev)
echo. 