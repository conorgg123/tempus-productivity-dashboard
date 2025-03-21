# Minimal PowerShell script to fix all issues and run the app
Write-Host "========= MINIMAL FIX SCRIPT =========" -ForegroundColor Green

# Stop existing processes
Write-Host "1. Stopping processes..." -ForegroundColor Yellow
taskkill /F /IM electron.exe /T 2>$null
taskkill /F /IM node.exe /T 2>$null
Start-Sleep -Seconds 2

# Clean build files
Write-Host "2. Cleaning build files..." -ForegroundColor Yellow
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }
if (Test-Path "out") { Remove-Item -Recurse -Force "out" }

# Install dependencies
Write-Host "3. Installing exact dependencies..." -ForegroundColor Yellow
npm install --save autoprefixer@10.3.7 postcss@8.3.11 tailwindcss@2.2.19

# Create postcss.config.js
Write-Host "4. Creating PostCSS config..." -ForegroundColor Yellow
@"
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
"@ | Out-File -FilePath "postcss.config.js" -Encoding utf8

# Build separately with forced settings
Write-Host "5. Building with forced settings..." -ForegroundColor Yellow
$env:NODE_OPTIONS = "--no-warnings"
npm run build

Write-Host "6. Exporting to static files..." -ForegroundColor Yellow
npm run export

# Check if build was successful
if (Test-Path "out/index.html") {
    Write-Host "7. Build successful! Starting Electron..." -ForegroundColor Green
    $env:NODE_ENV = "production"
    npx electron .
} else {
    Write-Host "Build failed. Check errors above." -ForegroundColor Red
} 