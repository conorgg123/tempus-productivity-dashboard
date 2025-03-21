const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

// Global reference
let mainWindow;

// Store data in user's app data folder
const userDataPath = app.getPath('userData');
const dataFilePath = path.join(userDataPath, 'dashboard-data.json');

// Default data
const defaultData = {
  tasks: [
    { id: 1, title: 'Create productivity dashboard', completed: true },
    { id: 2, title: 'Add task management', completed: false },
    { id: 3, title: 'Implement notes feature', completed: false }
  ],
  notes: [
    { id: 1, title: 'Project Ideas', content: 'Build a productivity dashboard with Electron' }
  ],
  youtubeLinks: [
    { id: 1, title: 'Electron Tutorial', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' }
  ],
  events: [
    { id: 1, title: 'Team Meeting', date: '2023-06-15T10:00:00', description: 'Weekly team sync' }
  ]
};

// Load or initialize data
function loadData() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
      return data;
    } else {
      fs.writeFileSync(dataFilePath, JSON.stringify(defaultData));
      return defaultData;
    }
  } catch (error) {
    console.error('Error loading data:', error);
    return defaultData;
  }
}

function createWindow() {
  // Create browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    backgroundColor: '#f5f7fa',
    icon: path.join(__dirname, 'icon.png')
  });

  // Load index.html
  mainWindow.loadFile('index.html');
  
  // Open DevTools in development
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

// When Electron is ready
app.whenReady().then(() => {
  createWindow();
  
  // Set up IPC handlers for data operations
  ipcMain.handle('get-data', () => {
    return loadData();
  });
  
  ipcMain.handle('save-data', (event, data) => {
    try {
      fs.writeFileSync(dataFilePath, JSON.stringify(data));
      return { success: true };
    } catch (error) {
      console.error('Error saving data:', error);
      return { success: false, error: error.message };
    }
  });
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
