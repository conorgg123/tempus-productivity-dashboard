# Fix for OpenSSL error with Node.js v22+
Write-Host "========= FIXING NODE.JS OPENSSL ERROR =========" -ForegroundColor Green

# Kill any existing processes
Write-Host "1. Stopping processes..." -ForegroundColor Yellow
taskkill /F /IM electron.exe /T 2>$null
taskkill /F /IM node.exe /T 2>$null
Start-Sleep -Seconds 2

# Clean build directories
Write-Host "2. Cleaning build files..." -ForegroundColor Yellow
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }
if (Test-Path "out") { Remove-Item -Recurse -Force "out" }

# Set environment variables to fix OpenSSL error
Write-Host "3. Setting NODE_OPTIONS to allow legacy OpenSSL..." -ForegroundColor Yellow
$env:NODE_OPTIONS = "--openssl-legacy-provider"

# Separate build and export steps with error checking
Write-Host "4. Building app (with legacy OpenSSL)..." -ForegroundColor Yellow
npm run build

# Check if build was successful
if (Test-Path ".next" -PathType Container) {
    Write-Host "5. Build successful, exporting static files..." -ForegroundColor Green
    npm run export
    
    # Check if export was successful
    if (Test-Path "out/index.html") {
        Write-Host "6. Export successful, starting Electron..." -ForegroundColor Green
        $env:NODE_ENV = "production"
        npx electron .
    } else {
        Write-Host "Export failed. Check errors above." -ForegroundColor Red
    }
} else {
    Write-Host "Build failed. Check errors above." -ForegroundColor Red
} 