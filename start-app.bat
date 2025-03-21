@echo off
echo Starting Productivity Dashboard...

REM Start Next.js in one window
start cmd /k "npm run dev"

REM Wait for Next.js to start
timeout /t 5

REM Start Electron in another window
start cmd /k "npm run electron"

echo Application started! You can close this window. 