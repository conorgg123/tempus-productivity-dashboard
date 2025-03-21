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
    mainWindow.loadURL(\data:text/html,
      <html>
        <head><title>Error</title></head>
        <body>
          <h1>Static build not found</h1>
          <p>Please run: npm run build-static</p>
        </body>
      </html>
    \);
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
