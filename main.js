const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const os = require('os');

// Global reference
let mainWindow;

// Store data in user's app data folder
const userDataPath = app.getPath('userData');
const dataFilePath = path.join(userDataPath, 'dashboard-data.json');

// Default data for today's activities
const defaultData = {
  date: new Date().toISOString().split('T')[0],
  totalWorked: {
    hours: 6,
    minutes: 18
  },
  percentOfDay: 79,
  taskBreakdown: {
    focus: 62,
    meetings: 15,
    breaks: 11,
    other: 12
  },
  projects: [
    { id: 1, name: "Finwall app", percent: 49, time: "3 hr 26 min", tasks: [
      { id: 101, name: "DS12 - Dark version", time: "1 hr 51 min", completed: false },
      { id: 102, name: "DS42 - Settings section", time: "55 min", completed: true },
      { id: 103, name: "System update", time: "40 min", completed: false }
    ]},
    { id: 2, name: "Finwall website", percent: 32, time: "1 hr 47 min", tasks: [] },
    { id: 3, name: "X Terminal", percent: 14, time: "46 min", tasks: [] },
    { id: 4, name: "Li.Fi", percent: 5, time: "19 min", tasks: [] }
  ],
  apps: [
    { id: 1, name: "Figma", percent: 47, time: "2 hr 58 min" },
    { id: 2, name: "Adobe Photoshop", percent: 12, time: "46 min" },
    { id: 3, name: "zoom.us", percent: 12, time: "45 min" },
    { id: 4, name: "Slack", percent: 7, time: "26 min" },
    { id: 5, name: "pinterest.com", percent: 6, time: "23 min" },
    { id: 6, name: "HEY", percent: 3, time: "11 min" },
    { id: 7, name: "nicelydone.com", percent: 3, time: "11 min" },
    { id: 8, name: "twitter.com", percent: 2, time: "8 min" },
    { id: 9, name: "crunchbase.com", percent: 2, time: "7 min" },
    { id: 10, name: "instagram.com", percent: 1, time: "4 min" },
    { id: 11, name: "Other", percent: 5, time: "19 min" }
  ],
  categories: [
    { id: 1, name: "Design", percent: 59, time: "3 hr 44 min" },
    { id: 2, name: "Video Conference", percent: 12, time: "45 min" },
    { id: 3, name: "Work Messaging", percent: 10, time: "37 min" }
  ],
  timelineBlocks: [
    { start: "09:00", end: "09:45", type: "design" },
    { start: "10:15", end: "11:30", type: "meeting" },
    { start: "11:45", end: "12:30", type: "design" },
    { start: "13:00", end: "14:15", type: "development" },
    { start: "14:30", end: "15:15", type: "break" },
    { start: "16:00", end: "17:45", type: "design" },
    { start: "18:15", end: "19:00", type: "meeting" }
  ]
};

// Load or initialize data
function loadData() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const data = JSON.parse(fs.readFileSync(dataFilePath, 'utf8'));
      return data;
    } else {
      // Initialize with minimal structure instead of mock data
      const initialData = {
        date: new Date().toISOString().split('T')[0],
        totalWorked: {
          hours: 0,
          minutes: 0
        },
        percentOfDay: 0,
        taskBreakdown: {
          focus: 0,
          meetings: 0,
          breaks: 0,
          other: 0
        },
        projects: [],
        apps: [],
        categories: [],
        timelineBlocks: []
      };
      fs.writeFileSync(dataFilePath, JSON.stringify(initialData));
      return initialData;
    }
  } catch (error) {
    console.error('Error loading data:', error);
    // Return empty data structure on error
    return {
      date: new Date().toISOString().split('T')[0],
      totalWorked: { hours: 0, minutes: 0 },
      percentOfDay: 0,
      taskBreakdown: { focus: 0, meetings: 0, breaks: 0, other: 0 },
      projects: [],
      apps: [],
      categories: [],
      timelineBlocks: []
    };
  }
}

function createWindow() {
  // Create browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'public/favicon.ico')
  });

  // Load initial data
  const initialData = loadData();

  // Make data available to renderer process
  global.sharedData = {
    initialData
  };

  // Check if in development mode
  const isDev = !app.isPackaged && process.env.NODE_ENV !== 'production';
  console.log('NODE_ENV:', process.env.NODE_ENV);
  console.log('Is development mode:', isDev);

  // Load the app
  let startUrl;
  
  if (isDev) {
    // In development mode, try to connect to the Next.js server
    startUrl = 'http://localhost:3005';
    console.log('Running in development mode, connecting to Next.js server at:', startUrl);
    mainWindow.loadURL(startUrl);
  } else {
    // In production mode, create a basic HTML page that loads our app
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Tempus Productivity</title>
        <style>
          body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            background: #f5f5f5;
          }
          .dashboard-container {
            display: flex;
            flex-direction: column;
            height: 100vh;
          }
          .sidebar {
            width: 250px;
            background: #2c3e50;
            color: white;
            padding: 20px;
          }
          .main-content {
            display: flex;
            flex: 1;
          }
          .content-area {
            flex: 1;
            padding: 20px;
          }
          h1, h2 {
            margin-top: 0;
          }
          .loading-screen {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            flex-direction: column;
          }
          .loading-spinner {
            border: 4px solid rgba(0, 0, 0, 0.1);
            border-radius: 50%;
            border-top: 4px solid #3498db;
            width: 50px;
            height: 50px;
            animation: spin 1s linear infinite;
            margin-bottom: 20px;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        </style>
      </head>
      <body>
        <div class="dashboard-container">
          <div class="main-content">
            <div class="sidebar">
              <h2>Tempus</h2>
              <nav>
                <ul style="list-style: none; padding: 0;">
                  <li style="margin-bottom: 10px;"><a href="#" style="color: white; text-decoration: none;">Dashboard</a></li>
                  <li style="margin-bottom: 10px;"><a href="#" style="color: white; text-decoration: none;">Calendar</a></li>
                  <li style="margin-bottom: 10px;"><a href="#" style="color: white; text-decoration: none;">Daily Focus</a></li>
                  <li style="margin-bottom: 10px;"><a href="#" style="color: white; text-decoration: none;">Todo List</a></li>
                  <li style="margin-bottom: 10px;"><a href="#" style="color: white; text-decoration: none;">YouTube Manager</a></li>
                </ul>
              </nav>
            </div>
            <div class="content-area">
              <h1>Your Productivity Dashboard</h1>
              <p>Today's overview: <span id="current-date"></span></p>
              
              <div id="projects-container">
                <h2>Projects & Tasks</h2>
                <div id="projects-list"></div>
              </div>
            </div>
          </div>
        </div>

        <script>
          document.getElementById('current-date').textContent = new Date().toLocaleDateString();
          
          // Load data from the Electron API
          window.addEventListener('DOMContentLoaded', () => {
            if (window.api && window.api.getPersonalData) {
              const data = window.api.getPersonalData();
              if (data) {
                renderDashboard(data);
              }
            }
          });
          
          function renderDashboard(data) {
            const projectsList = document.getElementById('projects-list');
            projectsList.innerHTML = '';
            
            if (data.projects && data.projects.length > 0) {
              data.projects.forEach(project => {
                const projectElement = document.createElement('div');
                projectElement.style.backgroundColor = '#fff';
                projectElement.style.padding = '15px';
                projectElement.style.borderRadius = '8px';
                projectElement.style.marginBottom = '15px';
                projectElement.style.boxShadow = '0 2px 5px rgba(0,0,0,0.1)';
                
                const projectHeader = document.createElement('div');
                projectHeader.style.display = 'flex';
                projectHeader.style.justifyContent = 'space-between';
                projectHeader.style.marginBottom = '10px';
                
                const projectName = document.createElement('h3');
                projectName.textContent = project.name;
                projectName.style.margin = '0';
                
                const projectTime = document.createElement('span');
                projectTime.textContent = project.time;
                
                projectHeader.appendChild(projectName);
                projectHeader.appendChild(projectTime);
                
                const progressBar = document.createElement('div');
                progressBar.style.height = '6px';
                progressBar.style.backgroundColor = '#f0f0f0';
                progressBar.style.borderRadius = '3px';
                progressBar.style.overflow = 'hidden';
                progressBar.style.marginBottom = '10px';
                
                const progressFill = document.createElement('div');
                progressFill.style.height = '100%';
                progressFill.style.width = project.percent + '%';
                progressFill.style.backgroundColor = '#4a6efa';
                
                progressBar.appendChild(progressFill);
                
                projectElement.appendChild(projectHeader);
                projectElement.appendChild(progressBar);
                
                // Add tasks if available
                if (project.tasks && project.tasks.length > 0) {
                  const tasksList = document.createElement('div');
                  tasksList.style.borderTop = '1px solid #f0f0f0';
                  tasksList.style.paddingTop = '10px';
                  
                  project.tasks.forEach(task => {
                    const taskItem = document.createElement('div');
                    taskItem.style.display = 'flex';
                    taskItem.style.justifyContent = 'space-between';
                    taskItem.style.marginBottom = '8px';
                    
                    const taskName = document.createElement('div');
                    taskName.textContent = task.name;
                    
                    const taskTime = document.createElement('div');
                    taskTime.textContent = task.time;
                    taskTime.style.color = '#666';
                    
                    taskItem.appendChild(taskName);
                    taskItem.appendChild(taskTime);
                    
                    tasksList.appendChild(taskItem);
                  });
                  
                  projectElement.appendChild(tasksList);
                }
                
                projectsList.appendChild(projectElement);
              });
            } else {
              projectsList.innerHTML = '<p>No projects available.</p>';
            }
          }
        </script>
      </body>
      </html>
    `;
    
    const tempPath = path.join(os.tmpdir(), 'tempus-productivity.html');
    fs.writeFileSync(tempPath, htmlContent);
    
    const fileUrl = url.format({
      pathname: tempPath,
      protocol: 'file:',
      slashes: true
    });
    
    console.log('Running in production mode with temporary HTML file');
    console.log('Loading from:', fileUrl);
    
    mainWindow.loadURL(fileUrl);
  }
  
  // Register error handler for page load failures
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });
  
  // Open DevTools in development mode
  if (isDev) {
    mainWindow.webContents.openDevTools();
  } else {
    // Temporarily open DevTools in production for debugging
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Handle file operations
ipcMain.on('save-to-file', (event, { filename, data }) => {
  const userDataPath = app.getPath('userData');
  const filePath = path.join(userDataPath, filename);
  
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    event.reply('file-saved', { success: true });
  } catch (error) {
    console.error('Error saving file:', error);
    event.reply('file-saved', { success: false, error: error.message });
  }
});

ipcMain.on('load-from-file', (event, filename) => {
  const userDataPath = app.getPath('userData');
  const filePath = path.join(userDataPath, filename);
  
  try {
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      event.reply('load-file-reply', data);
    } else {
      event.reply('load-file-reply', null);
    }
  } catch (error) {
    console.error('Error loading file:', error);
    event.reply('load-file-reply', null);
  }
});

// When Electron is ready
app.on('ready', createWindow);

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
