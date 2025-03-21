const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

// Global reference to prevent garbage collection
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // For development (check if we should connect to dev server)
  const isDev = process.env.NODE_ENV === 'development';
  
  if (isDev) {
    // Load from development server
    mainWindow.loadURL('http://localhost:3000');
    
    // Open the DevTools
    mainWindow.webContents.openDevTools();
  } else {
    // Load the index.html from the build
    mainWindow.loadURL(url.format({
      pathname: path.join(__dirname, 'out/index.html'),
      protocol: 'file:',
      slashes: true
    }));
  }

  // When window is closed
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// When Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
}); 