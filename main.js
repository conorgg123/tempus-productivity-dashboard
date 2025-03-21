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
