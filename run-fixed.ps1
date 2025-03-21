# PowerShell script to build and run the Electron app
Write-Host "========= BUILDING AND RUNNING FIXED APP =========" -ForegroundColor Green
Write-Host "This script addresses all errors previously encountered" -ForegroundColor Yellow
Write-Host ""

# Kill any existing processes
Write-Host "1. Cleaning up processes..." -ForegroundColor Cyan
taskkill /F /IM electron.exe /T 2>$null
taskkill /F /IM node.exe /T 2>$null
Start-Sleep -Seconds 2

# Check if files exist and ensure all required directories are present
Write-Host "2. Setting up directory structure..." -ForegroundColor Cyan
$dirs = @("src/styles", "src/pages", "src/components", "public")
foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "   Created directory: $dir" -ForegroundColor Gray
    }
}

# Install required dependencies explicitly
Write-Host "3. Installing dependencies..." -ForegroundColor Cyan
npm install autoprefixer@10.3.7 postcss@8.3.11 tailwindcss@2.2.19 --save-dev

# Build the static files
Write-Host "4. Building the application..." -ForegroundColor Cyan
npm run build
npm run export

# Verify the build succeeded
if (Test-Path "out/index.html") {
    Write-Host "5. Build successful! Starting the application..." -ForegroundColor Green
    
    # Set production environment
    $env:NODE_ENV = "production"
    
    # Run Electron pointing to the static files
    npx electron .
    
    Write-Host "Application started successfully!" -ForegroundColor Green
} else {
    Write-Host "5. Build failed. Please check the error messages above." -ForegroundColor Red
    Write-Host "   You can try running: npm run build" -ForegroundColor Yellow
    Write-Host "   Then: npm run export" -ForegroundColor Yellow
    Write-Host "   Then: npx electron ." -ForegroundColor Yellow
} 