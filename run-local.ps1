# PowerShell script to run the app locally without any server
Write-Host "========= RUNNING APP LOCALLY (NO SERVER) =========" -ForegroundColor Green
Write-Host ""

Write-Host "Step 1: Building static files..." -ForegroundColor Yellow
npm run build

Write-Host ""
Write-Host "Step 2: Terminating any existing processes..." -ForegroundColor Yellow
taskkill /F /IM electron.exe /T 2>$null
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "Step 3: Starting Electron in local mode..." -ForegroundColor Green
$env:NODE_ENV = "production"
Start-Process -FilePath "cmd.exe" -ArgumentList "/c npx electron ." -NoNewWindow

Write-Host ""
Write-Host "App is now running in local mode without any server!" -ForegroundColor Green
Write-Host "The app is loading completely from static files."
Write-Host "You can close this window." 