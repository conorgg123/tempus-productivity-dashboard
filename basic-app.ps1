# MINIMAL SOLUTION: Basic Electron App without Next.js dependencies
Write-Host "========= CREATING BASIC ELECTRON APP =========" -ForegroundColor Green

# Stop existing processes
Write-Host "1. Stopping processes..." -ForegroundColor Yellow
taskkill /F /IM electron.exe /T 2>$null
Start-Sleep -Seconds 2

# Clean slate - remove all Node.js related files
Write-Host "2. Creating clean slate..." -ForegroundColor Yellow
$filesToRemove = @("package.json", "package-lock.json", "next.config.js", "postcss.config.js", "tailwind.config.js", ".next")
foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        Remove-Item -Recurse -Force $file
        Write-Host "   Removed: $file" -ForegroundColor Gray
    }
}

# Create minimal package.json without BOM marker
Write-Host "3. Creating minimal package.json..." -ForegroundColor Yellow
$packageContent = @"
{
  "name": "productivity-dashboard",
  "version": "1.0.0",
  "private": true,
  "main": "main.js",
  "scripts": {
    "start": "electron ."
  },
  "devDependencies": {
    "electron": "^13.6.9"
  }
}
"@
$packageContent | Out-File -FilePath "package.json" -Encoding ascii

# Create simple main.js file
Write-Host "4. Creating Electron main.js file..." -ForegroundColor Yellow
$mainContent = @"
const { app, BrowserWindow } = require('electron');
const path = require('path');

// Global reference
let mainWindow;

function createWindow() {
  // Create browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  // Load index.html
  mainWindow.loadFile('index.html');
  
  // Open DevTools
  mainWindow.webContents.openDevTools();
}

// When Electron is ready
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
"@
$mainContent | Out-File -FilePath "main.js" -Encoding ascii

# Create a simple HTML file
Write-Host "5. Creating simple HTML file..." -ForegroundColor Yellow
$htmlContent = @"
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Productivity Dashboard</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #f5f7fa;
      color: #333;
    }
    h1 {
      font-size: 2.5rem;
      margin-bottom: 1rem;
      color: #4a6ee0;
    }
    p {
      font-size: 1.2rem;
      margin-bottom: 2rem;
    }
    .dashboard {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 20px;
      max-width: 800px;
    }
    .card {
      background: white;
      border-radius: 8px;
      padding: 20px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: transform 0.3s ease;
    }
    .card:hover {
      transform: translateY(-5px);
    }
    .card h2 {
      color: #4a6ee0;
      margin-top: 0;
    }
  </style>
</head>
<body>
  <h1>Productivity Dashboard</h1>
  <p>Your personal productivity application</p>
  
  <div class="dashboard">
    <div class="card">
      <h2>Tasks</h2>
      <p>Manage your daily tasks and to-dos</p>
    </div>
    <div class="card">
      <h2>Notes</h2>
      <p>Keep track of important information</p>
    </div>
    <div class="card">
      <h2>Calendar</h2>
      <p>Schedule and manage your appointments</p>
    </div>
    <div class="card">
      <h2>YouTube Links</h2>
      <p>Save and organize important videos</p>
    </div>
  </div>

  <script>
    // Add JavaScript functionality here
    document.addEventListener('DOMContentLoaded', () => {
      console.log('App loaded successfully');
    });
  </script>
</body>
</html>
"@
$htmlContent | Out-File -FilePath "index.html" -Encoding ascii

# Install dependencies
Write-Host "6. Installing minimal dependencies..." -ForegroundColor Yellow
npm install

# Run the app
Write-Host "7. Starting Electron app..." -ForegroundColor Green
npx electron . 