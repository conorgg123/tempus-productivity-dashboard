@echo off
echo Starting Productivity Dashboard...

REM Kill any existing processes
echo Terminating existing processes...
taskkill /F /IM node.exe 2>NUL
taskkill /F /IM electron.exe 2>NUL

REM Clean .next directory
echo Cleaning build cache...
if exist .next (
  rmdir /S /Q .next
)

REM Start Next.js in a new window
echo Starting Next.js...
start cmd /k "npm run dev"

REM Wait for Next.js to start
echo Waiting 15 seconds for Next.js to initialize...
timeout /t 15 /nobreak

REM Start Electron
echo Starting Electron...
start cmd /c "electron ."

echo Application should now be running!
echo If you don't see the application window, check the command windows for errors. 