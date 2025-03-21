@echo off
echo ========= STARTING PRODUCTIVITY DASHBOARD =========
echo.

REM Kill any existing processes
echo Terminating existing processes...
taskkill /F /IM node.exe 2>NUL
taskkill /F /IM electron.exe 2>NUL
timeout /t 2 /nobreak >NUL

REM Clean cache directories that cause permission issues
echo Cleaning cache directories...
IF EXIST .next (
  rmdir /S /Q .next
)
IF EXIST out (
  rmdir /S /Q out
)
IF EXIST "node_modules\.cache" (
  rmdir /S /Q "node_modules\.cache"
)
timeout /t 1 /nobreak >NUL

REM Create starter index.html to display while Next.js loads
echo Creating temporary loading page...
echo ^<!DOCTYPE html^>^<html^>^<head^>^<title^>Loading...^</title^>^<style^>body{font-family:Arial;display:flex;justify-content:center;align-items:center;height:100vh;background:#f5f5f8;color:#333}^</style^>^</head^>^<body^>^<div^>^<h2^>Loading Productivity Dashboard...^</h2^>^<p^>Please wait while Next.js initializes^</p^>^</div^>^</body^>^</html^> > index.html

REM Start Next.js in one window
echo Starting Next.js server with NPX...
start cmd /k "npx next dev"

REM Wait for Next.js to initialize
echo Waiting for Next.js to initialize (20 seconds)...
timeout /t 20 /nobreak >NUL

REM Start Electron with npx in a separate window
echo Starting Electron...
start cmd /k "npx electron ."

echo.
echo Application should now be running!
echo If you still have issues:
echo 1. Try refreshing the Electron window
echo 2. Check the Next.js window for errors
echo 3. Run "PowerShell -ExecutionPolicy Bypass -File .\fix-permissions.ps1" with admin rights
echo. 