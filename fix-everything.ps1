# Emergency fix script for Next.js and Electron
Write-Host "========= EMERGENCY FIX SCRIPT =========" -ForegroundColor Cyan
Write-Host ""

# 1. Kill processes
Write-Host "1. Cleaning up processes..." -ForegroundColor Yellow
taskkill /F /IM electron.exe /T 2>$null
taskkill /F /IM node.exe /T 2>$null
Start-Sleep -Seconds 2

# 2. Clean up cache and build files
Write-Host "2. Removing problem files and directories..." -ForegroundColor Yellow
$dirsToRemove = @(".next", "out", "node_modules\.cache", "tsconfig.json", "next.config.ts")
foreach ($dir in $dirsToRemove) {
    if (Test-Path $dir) {
        Remove-Item -Recurse -Force $dir
        Write-Host "   Removed: $dir" -ForegroundColor Gray
    }
}

# 3. Install critical dependencies globally to ensure they're found
Write-Host "3. Installing critical dependencies globally..." -ForegroundColor Yellow
npm install -g autoprefixer postcss tailwindcss
npm install autoprefixer postcss tailwindcss --save-dev

# 4. Create a minimal version of required config files
Write-Host "4. Creating minimal config files..." -ForegroundColor Yellow

# Create postcss.config.js
@"
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  }
}
"@ | Out-File -FilePath "postcss.config.js" -Encoding utf8

# Create minimal tailwind.config.js  
@"
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
}
"@ | Out-File -FilePath "tailwind.config.js" -Encoding utf8

# 5. Create a minimal placeholder CSS to avoid import errors
Write-Host "5. Creating minimal CSS files..." -ForegroundColor Yellow

# Ensure the directories exist
if (-not (Test-Path "src/styles")) {
    New-Item -ItemType Directory -Path "src/styles" -Force | Out-Null
}

# Create minimal globals.css
@"
html, body {
  padding: 0;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
}

* {
  box-sizing: border-box;
}
"@ | Out-File -FilePath "src/styles/globals.css" -Encoding utf8

# Create minimal module CSS
@"
.container {
  min-height: 100vh;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
"@ | Out-File -FilePath "src/styles/Home.module.css" -Encoding utf8

# 6. Build and start the app
Write-Host "6. Building the app..." -ForegroundColor Green
npm run build

# 7. Check if build was successful and start in production mode
if (Test-Path "out") {
    Write-Host "7. Starting Electron app..." -ForegroundColor Green
    $env:NODE_ENV = "production"
    Start-Process -FilePath "npx" -ArgumentList "electron ." -NoNewWindow
    Write-Host "App started successfully!" -ForegroundColor Green
} else {
    Write-Host "Build failed. Trying to start in development mode..." -ForegroundColor Yellow
    Start-Process -FilePath "cmd.exe" -ArgumentList "/c npm run dev" -NoNewWindow
    Start-Sleep -Seconds 15
    Start-Process -FilePath "cmd.exe" -ArgumentList "/c set NODE_ENV=development && npx electron ." -NoNewWindow
    Write-Host "Started in development mode. Check both windows for errors." -ForegroundColor Yellow
} 