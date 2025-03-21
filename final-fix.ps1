# COMPLETE FIX SCRIPT - Addresses all environment issues
Write-Host "========= COMPLETE FIX SCRIPT =========" -ForegroundColor Green

# Kill any existing processes
Write-Host "1. Stopping processes..." -ForegroundColor Yellow
taskkill /F /IM electron.exe /T 2>$null
taskkill /F /IM node.exe /T 2>$null
Start-Sleep -Seconds 2

# Clean build directories
Write-Host "2. Cleaning build files..." -ForegroundColor Yellow
if (Test-Path ".next") { Remove-Item -Recurse -Force ".next" }
if (Test-Path "out") { Remove-Item -Recurse -Force "out" }
if (Test-Path "node_modules\.cache") { Remove-Item -Recurse -Force "node_modules\.cache" }

# Create a completely new package.json with known working versions
Write-Host "3. Creating new package.json with known working versions..." -ForegroundColor Yellow
@"
{
  "name": "next-productivity-dashboard",
  "version": "0.1.0",
  "private": true,
  "main": "main.js",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "export": "next export -o out",
    "build-static": "next build && next export -o out",
    "start": "next start",
    "electron": "electron ."
  },
  "dependencies": {
    "next": "11.1.4",
    "react": "17.0.2",
    "react-dom": "17.0.2"
  },
  "devDependencies": {
    "electron": "13.6.9"
  }
}
"@ | Out-File -FilePath "package.json" -Encoding utf8

# Create a minimal Next.js config
Write-Host "4. Creating simple Next.js config..." -ForegroundColor Yellow
@"
module.exports = {
  reactStrictMode: true,
  images: {
    disableStaticImages: true
  },
  webpack: (config) => {
    return config;
  }
}
"@ | Out-File -FilePath "next.config.js" -Encoding utf8

# Create a minimal Electron main file
Write-Host "5. Creating simple Electron main file..." -ForegroundColor Yellow
@"
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

// Global reference to prevent garbage collection
let mainWindow;

// Check if out/index.html exists
function checkForStaticBuild() {
  const indexPath = path.join(__dirname, 'out', 'index.html');
  return fs.existsSync(indexPath);
}

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Load the index.html
  if (checkForStaticBuild()) {
    mainWindow.loadFile(path.join(__dirname, 'out', 'index.html'));
  } else {
    // Show error message if static build doesn't exist
    mainWindow.loadURL(\`data:text/html,
      <html>
        <head><title>Error</title></head>
        <body>
          <h1>Static build not found</h1>
          <p>Please run: npm run build-static</p>
        </body>
      </html>
    \`);
  }

  // Show DevTools
  mainWindow.webContents.openDevTools();
}

// When app is ready
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
"@ | Out-File -FilePath "main.js" -Encoding utf8

# Create a simple index page
Write-Host "6. Creating simple index page..." -ForegroundColor Yellow
if (-not (Test-Path "src/pages")) {
    New-Item -ItemType Directory -Path "src/pages" -Force | Out-Null
}
@"
export default function Home() {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1>Productivity Dashboard</h1>
      <p>Welcome to your productivity app</p>
    </div>
  )
}
"@ | Out-File -FilePath "src/pages/index.js" -Encoding utf8

# Install dependencies
Write-Host "7. Installing dependencies..." -ForegroundColor Yellow
npm install

# Set environment variables to fix OpenSSL and __dirname
Write-Host "8. Setting environment variables..." -ForegroundColor Yellow
$env:NODE_OPTIONS = "--openssl-legacy-provider"

# Build step
Write-Host "9. Building the app..." -ForegroundColor Yellow
npm run build

# Check if build was successful - look for specifically the .next/build-manifest.json file
if (Test-Path ".next/build-manifest.json") {
    Write-Host "10. Build successful! Exporting to static HTML..." -ForegroundColor Green
    npm run export
    
    # Check if export was successful
    if (Test-Path "out/index.html") {
        Write-Host "11. Export successful! Starting Electron..." -ForegroundColor Green
        $env:NODE_ENV = "production"
        npx electron .
    } else {
        Write-Host "Export failed. Please check the errors above." -ForegroundColor Red
    }
} else {
    Write-Host "Build failed. Please check the errors above." -ForegroundColor Red
} 