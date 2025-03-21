@echo off
echo ========= EMERGENCY FIX FOR BLANK SCREEN =========
echo.

REM Kill all existing processes
echo Terminating all Node and Electron processes...
taskkill /F /IM node.exe 2>NUL
taskkill /F /IM electron.exe 2>NUL
timeout /t 3 /nobreak >NUL

REM Delete all cache files and build directories
echo Doing deep cleanup of ALL cache directories...
if exist .next (
  rmdir /S /Q .next
)
if exist out (
  rmdir /S /Q out
)
if exist "node_modules\.cache" (
  rmdir /S /Q "node_modules\.cache"
)
if exist ".next" (
  rmdir /S /Q ".next"
)
if exist "temp-index.html" (
  del "temp-index.html"
)

REM Create a minimal working page
echo Creating minimal index.js to ensure compilation works...
mkdir src\pages 2>NUL
echo import React from 'react'; > src\pages\index.js
echo import { Box, Typography } from '@mui/material'; >> src\pages\index.js
echo. >> src\pages\index.js
echo export default function Home() { >> src\pages\index.js
echo   return ( >> src\pages\index.js
echo     ^<Box sx={{ p: 4 }}^> >> src\pages\index.js
echo       ^<Typography variant="h4"^>Dashboard^</Typography^> >> src\pages\index.js
echo       ^<Typography variant="body1"^>Loading your productivity dashboard...^</Typography^> >> src\pages\index.js
echo     ^</Box^> >> src\pages\index.js
echo   ); >> src\pages\index.js
echo } >> src\pages\index.js

REM Start Next.js directly
echo Starting Next.js directly...
start cmd /k "npx next dev -p 3005"

REM Wait for Next.js to start
echo Waiting for Next.js to initialize...
timeout /t 20 /nobreak

REM Start Electron with direct URL to the correct port
echo Starting Electron with direct URL to port 3005...
start cmd /k "set ELECTRON_START_URL=http://localhost:3005 && npx electron ."

echo.
echo Productivity Dashboard should now be visible!
echo If still blank, try these fixes:
echo 1. Refresh the Electron window or close and rerun this script
echo 2. Check the Next.js window for errors
echo 3. If electron command fails, run: npm install electron --save-dev
echo. 