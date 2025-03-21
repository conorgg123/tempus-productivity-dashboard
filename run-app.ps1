Write-Host "Starting Productivity Dashboard..." -ForegroundColor Green

# Kill any existing processes
Write-Host "Stopping existing processes..." -ForegroundColor Yellow
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force
Get-Process -Name electron -ErrorAction SilentlyContinue | Stop-Process -Force

# Clean cache and build directories
Write-Host "Cleaning cache..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
}
if (Test-Path "out") {
    Remove-Item -Path "out" -Recurse -Force -ErrorAction SilentlyContinue
}

# Start Next.js and wait
Write-Host "Starting Next.js..." -ForegroundColor Cyan
Start-Process -FilePath "cmd.exe" -ArgumentList "/k npx next dev" -NoNewWindow
Write-Host "Waiting for Next.js to start (10 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Start Electron
Write-Host "Starting Electron..." -ForegroundColor Green
Start-Process -FilePath "cmd.exe" -ArgumentList "/k npx electron ." -NoNewWindow

Write-Host "Application started! The window should appear shortly." -ForegroundColor Green
Write-Host "If you see a blank screen, type 'reload()' in the developer tools console (F12)." -ForegroundColor Yellow 