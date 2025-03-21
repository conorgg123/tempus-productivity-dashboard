# Simple PowerShell script to run the app locally without any server
Write-Host "========= STARTING PRODUCTIVITY DASHBOARD =========" -ForegroundColor Green

# Clean previous processes
Write-Host "Cleaning previous processes..." -ForegroundColor Yellow
taskkill /F /IM electron.exe /T 2>$null
Start-Sleep -Seconds 2

# Set environment variables
Write-Host "Setting up environment..." -ForegroundColor Yellow
$env:NODE_ENV = "production"

# Check if the "out" directory exists
if (Test-Path "out") {
    Write-Host "Static files already exist, starting app..." -ForegroundColor Green
} else {
    Write-Host "Building static files first..." -ForegroundColor Yellow
    npm install
    npm run build
}

# Run Electron directly
Write-Host "Starting Electron app..." -ForegroundColor Green
npx electron .

Write-Host "Done!" -ForegroundColor Green 