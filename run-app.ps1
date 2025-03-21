# PowerShell script to properly build and run the app
Write-Host "========= BUILDING AND RUNNING PRODUCTIVITY DASHBOARD =========" -ForegroundColor Green
Write-Host ""

# Kill any existing processes
Write-Host "Terminating existing processes..." -ForegroundColor Yellow
taskkill /F /IM electron.exe /T 2>$null
taskkill /F /IM node.exe /T 2>$null
Start-Sleep -Seconds 2

# Clean build directories
Write-Host "Cleaning build artifacts..." -ForegroundColor Yellow
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }
if (Test-Path "out") { Remove-Item -Recurse -Force "out" }
if (Test-Path "node_modules\.cache") { Remove-Item -Recurse -Force "node_modules\.cache" }

# Install dependencies explicitly
Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install --save-dev autoprefixer@10.4.14 postcss@8.4.27 tailwindcss@3.3.3

# Create postcss.config.js if it doesn't exist
if (-not (Test-Path "postcss.config.js")) {
    Write-Host "Creating PostCSS config..." -ForegroundColor Yellow
    @"
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
"@ | Out-File -FilePath "postcss.config.js" -Encoding utf8
}

# Create tailwind.config.js if it doesn't exist
if (-not (Test-Path "tailwind.config.js")) {
    Write-Host "Creating Tailwind config..." -ForegroundColor Yellow
    @"
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
"@ | Out-File -FilePath "tailwind.config.js" -Encoding utf8
}

# Build the application
Write-Host "Building static files..." -ForegroundColor Green
npm run build

# Check if build was successful
if (Test-Path "out\index.html") {
    # Start Electron in production mode
    Write-Host "Starting Electron in production mode..." -ForegroundColor Green
    $env:NODE_ENV = "production"
    Start-Process -FilePath "npx" -ArgumentList "electron ." -NoNewWindow
    
    Write-Host "App started successfully!" -ForegroundColor Green
} else {
    Write-Host "Build failed. Static files not created." -ForegroundColor Red
    Write-Host "Check the error messages above for details." -ForegroundColor Red
} 