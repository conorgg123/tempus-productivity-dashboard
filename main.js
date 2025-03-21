const { app, BrowserWindow, dialog } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const http = require('http');

// Keep a global reference of the window object
let mainWindow;
let loadingScreen;
let retryCount = 0;
const MAX_RETRIES = 10;

// Function to check if a port is available
function checkPort(port) {
  return new Promise((resolve) => {
    const req = http.get({
      hostname: 'localhost',
      port: port,
      path: '/',
      timeout: 1000
    }, (res) => {
      console.log(`Port ${port} responded with status: ${res.statusCode}`);
      resolve(true);
      req.destroy();
    }).on('error', (err) => {
      console.log(`Port ${port} check failed: ${err.message}`);
      resolve(false);
      req.destroy();
    });
  });
}

// Create a simple loading screen
function createLoadingScreen() {
  const loading = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    transparent: false,
    alwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  loading.loadURL(
    url.format({
      pathname: path.join(__dirname, 'loading.html'),
      protocol: 'file:',
      slashes: true
    })
  );

  return loading;
}

// Create the loading.html file
function createLoadingFile() {
  const loadingPath = path.join(__dirname, 'loading.html');
  const loadingContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Loading...</title>
      <style>
        body {
          background-color: #f5f5f8;
          font-family: Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          margin: 0;
          color: #333;
          overflow: hidden;
        }
        .loader {
          text-align: center;
        }
        .spinner {
          border: 6px solid #f3f3f3;
          border-top: 6px solid #3498db;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 2s linear infinite;
          margin: 20px auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
      <script>
        // Fix for global is not defined
        if (typeof global === 'undefined') {
          window.global = window;
        }
      </script>
    </head>
    <body>
      <div class="loader">
        <h2>Loading Productivity Dashboard</h2>
        <div class="spinner"></div>
        <p>Please wait while the app is starting...</p>
        <p id="status">Initializing...</p>
        <script>
          let count = 0;
          setInterval(() => {
            const status = document.getElementById('status');
            count++;
            status.textContent = 'Initializing' + '.'.repeat(count % 4);
          }, 500);
        </script>
      </div>
    </body>
    </html>
  `;
  
  fs.writeFileSync(loadingPath, loadingContent);
}

async function createWindow() {
  // Create the loading file
  createLoadingFile();

  // Show loading screen
  loadingScreen = createLoadingScreen();
  
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    backgroundColor: '#f5f5f8',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: true
    }
  });

  // Check if we're in development or production
  const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;
  
  if (isDev) {
    // Development: try to connect to the Next.js dev server
    console.log('Running in development mode, checking for Next.js server...');
    const startUrl = await findAvailablePort();
    
    if (startUrl) {
      console.log(`Starting with URL: ${startUrl}`);
      
      // Setup retry behavior
      mainWindow.webContents.on('did-fail-load', async (_, __, errorDescription) => {
        if (retryCount < MAX_RETRIES) {
          retryCount++;
          console.log(`Failed to load (${retryCount}/${MAX_RETRIES}): ${errorDescription}`);
          
          // Try to find a port again
          const newUrl = await findAvailablePort();
          if (newUrl) {
            console.log(`Retrying with new URL: ${newUrl}`);
            setTimeout(() => mainWindow.loadURL(newUrl), 2000);
          } else {
            console.log('No available ports found on retry');
            setTimeout(() => mainWindow.loadURL(startUrl), 5000);
          }
        } else {
          console.error('Max retries reached. Showing error dialog');
          loadingScreen.close();
          dialog.showErrorBox('Loading Error', 
            `Failed to connect to Next.js server after multiple attempts.\n\nPlease make sure Next.js is running by executing:\nnpm run dev\n\nThen restart this application.`);
        }
      });
      
      // Try to load the URL
      try {
        await mainWindow.loadURL(startUrl);
        console.log('Successfully loaded URL');
        loadingScreen.close();
        mainWindow.show();
      } catch (error) {
        console.error('Initial load failed, waiting for retry handler:', error);
      }
      
      // Open DevTools for debugging
      mainWindow.webContents.openDevTools();
    } else {
      console.error('No Next.js server found on any port');
      
      // Instead of quitting, try to use static files
      console.log('Attempting to load from static files...');
      loadStaticFiles();
    }
  } else {
    // Production: load from the static export
    loadStaticFiles();
  }

  // Emitted when the window is closed
  mainWindow.on('closed', function () {
    mainWindow = null;
  });
}

// Utility function to load static files
async function loadStaticFiles() {
  console.log('Running in production mode, loading from static export');
  
  try {
    // Check if out directory exists
    const outDir = path.join(__dirname, 'out');
    const outIndexPath = path.join(outDir, 'index.html');
    
    if (fs.existsSync(outIndexPath)) {
      console.log(`Loading file: ${outIndexPath}`);
      
      // Load the file with file:// protocol
      const fileUrl = url.format({
        pathname: outIndexPath,
        protocol: 'file:',
        slashes: true
      });
      
      await mainWindow.loadURL(fileUrl);
      console.log('Successfully loaded from static export');
      loadingScreen.close();
      mainWindow.show();
      
      // Open DevTools for debugging in development
      if (process.env.NODE_ENV === 'development') {
        mainWindow.webContents.openDevTools();
      }
    } else {
      console.error(`Static file not found: ${outIndexPath}`);
      loadingScreen.close();
      dialog.showErrorBox('Loading Error', 
        `Could not find the application files.\n\nPlease run: npm run build\n\nThen restart this application.`);
      
      app.quit();
    }
  } catch (error) {
    console.error('Failed to load from static export:', error);
    
    loadingScreen.close();
    dialog.showErrorBox('Loading Error', 
      `Failed to load the application from the static export.\n\nError: ${error.message}\n\nPlease run: npm run build`);
    
    app.quit();
  }
}

// Find an available port
async function findAvailablePort() {
  // First try the environment variable
  const directUrl = process.env.ELECTRON_START_URL;
  if (directUrl) {
    console.log(`Using direct URL from environment: ${directUrl}`);
    return directUrl;
  }
  
  // Then try common Next.js ports
  for (const port of [3000, 3001, 3002, 3003, 3004, 3005, 3006, 3007, 3008, 3009]) {
    if (await checkPort(port)) {
      const portUrl = `http://localhost:${port}`;
      console.log(`Found server running on port ${port}`);
      return portUrl;
    }
  }
  
  return null;
}

// This method will be called when Electron has finished initialization
app.whenReady().then(createWindow);

// Quit when all windows are closed
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
}); 