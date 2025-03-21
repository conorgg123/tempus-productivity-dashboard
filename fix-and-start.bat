@echo off
echo ========= FIXING AND STARTING PRODUCTIVITY DASHBOARD =========
echo.

REM Kill any existing processes
echo Terminating existing processes...
taskkill /F /IM node.exe 2>NUL
taskkill /F /IM electron.exe 2>NUL
timeout /t 2 /nobreak >NUL

REM Clean build directories to fix pages-manifest issues
echo Cleaning build directories...
if exist .next rmdir /S /Q .next
if exist out rmdir /S /Q out
if exist node_modules\.cache rmdir /S /Q node_modules\.cache
timeout /t 1 /nobreak >NUL

REM Install missing dependencies if needed
echo Ensuring dependencies are installed...
call npm install --no-fund

REM Generate a simple index.html for Electron to load first
echo Creating temporary index.html...
echo ^<!DOCTYPE html^>^<html^>^<head^>^<title^>Loading...^</title^>^</head^>^<body^>^<h1^>Loading Dashboard...^</h1^>^</body^>^</html^> > index.html

REM Build the app properly
echo Building Next.js app...
call npm run build
if %ERRORLEVEL% NEQ 0 (
  echo Build failed, trying to fix build issues...
  call npx next build
)
timeout /t 1 /nobreak >NUL

REM Start Next.js in a new window
echo Starting Next.js server...
start cmd /k "npx next dev"

REM Wait for the server to start
echo Waiting for Next.js to initialize (15 seconds)...
timeout /t 15 /nobreak >NUL

REM Start Electron with npx to ensure it's found
echo Starting Electron window...
start cmd /k "npx electron ."

echo.
echo Application should now be running!
echo If you still see a blank screen in the Electron window, type 'reload' in the Electron window.
echo.
echo You can close this command window if the app is running correctly. 