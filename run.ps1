Write-Host "Starting Productivity Dashboard..." -ForegroundColor Green

# Kill any existing processes
Write-Host "Stopping previous processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name electron -ErrorAction SilentlyContinue | Stop-Process -Force

# Remove cached files that might be causing issues
Write-Host "Clearing cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
}

# Run Next.js and Electron separately to avoid timing issues
Write-Host "Starting Next.js..." -ForegroundColor Cyan
$nextProcess = Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm run dev" -PassThru

# Wait for Next.js to start
Write-Host "Waiting for Next.js to start (20 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 20

# Start Electron pointing directly to port 3006
Write-Host "Starting Electron..." -ForegroundColor Green
Start-Process -FilePath "cmd.exe" -ArgumentList "/c electron ." -NoNewWindow

Write-Host "Application should now be running!" -ForegroundColor Green
Write-Host "If you don't see the Electron window, check for errors in the command window" -ForegroundColor Yellow 