@echo off
echo Starting Productivity Dashboard...

REM Kill any existing processes
echo Terminating existing processes...
taskkill /F /IM node.exe 2>NUL
taskkill /F /IM electron.exe 2>NUL

REM Clean build cache
echo Cleaning build cache...
if exist .next rmdir /S /Q .next
if exist out rmdir /S /Q out

REM Build first to ensure all pages are generated
echo Building application...
call npm run build

REM Start Next.js in a new window
echo Starting Next.js development server...
start cmd /k "npx next dev"

REM Wait for server to start
echo Waiting 20 seconds for Next.js to initialize...
timeout /t 20 /nobreak

REM Start Electron in a new window with clear view of logs
echo Starting Electron window...
start cmd /k "npx electron ."

echo Productivity Dashboard should now be visible!
echo If you see a blank screen, check the Next.js window for errors.
echo You can close this command window. 