const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const os = require('os');

// Global reference
let mainWindow;
let darkMode = false;

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
        timelineBlocks: [],
        youtubeLinks: [
          {
            link: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            title: 'Introduction to Productivity Systems',
            category: 'Educational',
            duration: '12:30',
            added_on: new Date().toISOString()
          },
          {
            link: 'https://www.youtube.com/watch?v=jNQXAC9IVRw',
            title: 'Time Management Tips',
            category: 'Educational',
            duration: '8:45',
            added_on: new Date().toISOString()
          }
        ],
        youtubeCategories: ["All", "Watch Later", "Educational", "Entertainment", "Music", "Coding", "Speech Tips"],
        calendarEvents: [
          {
            id: '1',
            title: 'Team Meeting',
            date: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 10, 0).toISOString(),
            endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 15, 11, 30).toISOString(),
            type: 'meeting',
            description: 'Weekly team sync'
          },
          {
            id: '2',
            title: 'Design Sprint',
            date: new Date(new Date().getFullYear(), new Date().getMonth(), 18, 9, 0).toISOString(),
            endDate: new Date(new Date().getFullYear(), new Date().getMonth(), 18, 17, 0).toISOString(),
            type: 'design',
            description: 'Design new features'
          }
        ],
        settings: {
          darkMode: false,
          accentColor: '#6366f1',
          notifications: true,
          soundEffects: false,
          calendarView: 'month',
          weekStart: '0',
          displayName: 'John Doe',
          email: 'john@example.com'
        }
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
      timelineBlocks: [],
      youtubeLinks: [],
      youtubeCategories: ["All", "Watch Later", "Educational", "Entertainment"],
      calendarEvents: [],
      settings: {
        darkMode: false,
        accentColor: '#6366f1',
        notifications: true,
        soundEffects: false,
        calendarView: 'month',
        weekStart: '0'
      }
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
    // In production mode, copy the HTML files from the output directory to the temp directory
    const tempDir = os.tmpdir();
    const outDir = path.join(__dirname, 'out');
    
    // Create an array of HTML files to copy
    const filesToCopy = [
      { 
        source: path.join(outDir, 'index.html'),
        dest: path.join(tempDir, 'index.html')
      },
      { 
        source: path.join(outDir, 'calendar.html'),
        dest: path.join(tempDir, 'calendar.html')
      },
      { 
        source: path.join(outDir, 'settings.html'),
        dest: path.join(tempDir, 'settings.html')
      },
      { 
        source: path.join(outDir, 'youtube-manager.html'),
        dest: path.join(tempDir, 'youtube-manager.html')
      },
      { 
        source: path.join(outDir, 'projects-tasks.html'),
        dest: path.join(tempDir, 'projects-tasks.html')
      },
      { 
        source: path.join(outDir, 'timer.html'),
        dest: path.join(tempDir, 'timer.html')
      },
      { 
        source: path.join(outDir, 'history.html'),
        dest: path.join(tempDir, 'history.html')
      },
      { 
        source: path.join(outDir, 'help.html'),
        dest: path.join(tempDir, 'help.html')
      },
      { 
        source: path.join(outDir, 'production-fix.css'),
        dest: path.join(tempDir, 'production-fix.css')
      }
    ];
    
    // Copy each file
    filesToCopy.forEach(file => {
      try {
        if (fs.existsSync(file.source)) {
          fs.copyFileSync(file.source, file.dest);
          console.log(`Successfully copied ${file.source} to ${file.dest}`);
        } else {
          console.error(`Source file does not exist: ${file.source}`);
        }
      } catch (error) {
        console.error(`Error copying file ${file.source}: ${error.message}`);
      }
    });
    
    // Create template HTML
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Tempus Productivity</title>
        <base href="${url.format({pathname: tempDir, protocol: 'file:', slashes: true})}">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
        <link rel="stylesheet" href="production-fix.css">
        <style>
          :root {
            --primary-color: #6366f1;
            --focus-color: #9C27B0;
            --meeting-color: #f59e0b;
            --design-color: #2196F3;
            --break-color: #4CAF50;
            --other-color: #FF9800;
            --sidebar-bg: #1e293b;
            --body-bg: #f8fafc;
            --card-bg: #ffffff;
            --border-color: #e2e8f0;
            --text-primary: #1e293b;
            --text-secondary: #64748b;
            --text-light: #f8fafc;
          }
          
          body, html {
            margin: 0;
            padding: 0;
            height: 100%;
            width: 100%;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            background: var(--body-bg);
            color: var(--text-primary);
          }
          
          * {
            box-sizing: border-box;
          }
          
          h1, h2, h3, h4, h5, h6 {
            margin-top: 0;
            font-weight: 600;
          }
          
          /* Layout */
          .app-container {
            display: flex;
            height: 100vh;
          }
          
          .sidebar {
            width: 230px;
            background: var(--sidebar-bg);
            color: var(--text-light);
            padding: 20px 0;
            display: flex;
            flex-direction: column;
            overflow-y: auto;
          }
          
          .logo {
            display: flex;
            align-items: center;
            padding: 0 20px 20px 20px;
            margin-bottom: 10px;
            font-size: 24px;
            font-weight: 700;
          }
          
          .logo-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            background: #6366f1;
            border-radius: 8px;
            margin-right: 10px;
          }
          
          .main-content {
            flex: 1;
            padding: 0;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
          }
          
          .header {
            padding: 16px 24px;
            border-bottom: 1px solid var(--border-color);
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: var(--card-bg);
          }
          
          .date-display {
            font-size: 18px;
            font-weight: 600;
          }
          
          .header-controls {
            display: flex;
            gap: 10px;
          }
          
          .content-area {
            flex: 1;
            padding: 24px;
          }
          
          .dashboard-layout {
            display: grid;
            grid-template-columns: 2fr 1fr;
            gap: 24px;
          }
          
          /* Navigation */
          .nav-item {
            display: flex;
            align-items: center;
            padding: 10px 16px;
            border-radius: 8px;
            margin-bottom: 4px;
            cursor: pointer;
            text-decoration: none;
            color: rgba(255,255,255,0.8);
            transition: background-color 0.2s;
          }
          
          .nav-item:hover {
            background-color: rgba(255,255,255,0.1);
          }
          
          .nav-item.active {
            background-color: rgba(255,255,255,0.1);
            color: white;
          }
          
          .nav-icon {
            margin-right: 12px;
            font-size: 20px;
          }
        </style>
      </head>
      <body>
        <div class="app-container">
          <aside class="sidebar">
            <div class="logo">
              <div class="logo-icon">
                <span style="color: white;">T</span>
              </div>
              <span>tempus.</span>
            </div>
            
            <div class="nav-section">
              <a class="nav-item active" href="index.html">
                <span class="material-icons nav-icon">dashboard</span>
                <span>Dashboard</span>
              </a>
              <a class="nav-item" href="calendar.html">
                <span class="material-icons nav-icon">calendar_today</span>
                <span>Calendar</span>
              </a>
            </div>
            
            <div class="nav-section">
              <div class="nav-section-title">Productivity</div>
              <a class="nav-item" href="#">
                <span class="material-icons nav-icon">folder</span>
                <span>Projects & tasks</span>
              </a>
              <a class="nav-item" href="#">
                <span class="material-icons nav-icon">timer</span>
                <span>Timer</span>
              </a>
              <a class="nav-item" href="#">
                <span class="material-icons nav-icon">history</span>
                <span>History</span>
              </a>
            </div>
            
            <div class="nav-section">
              <div class="nav-section-title">Resources</div>
              <a class="nav-item" href="youtube-manager.html">
                <span class="material-icons nav-icon">video_library</span>
                <span>YouTube Manager</span>
              </a>
            </div>
            
            <div class="nav-section" style="margin-top: auto;">
              <a class="nav-item" href="#">
                <span class="material-icons nav-icon">help</span>
                <span>Help</span>
              </a>
              <a class="nav-item" href="settings.html">
                <span class="material-icons nav-icon">settings</span>
                <span>Settings</span>
              </a>
              <a class="nav-item" href="#">
                <span class="material-icons nav-icon">logout</span>
                <span>Log Out</span>
              </a>
            </div>
          </aside>
          
          <main class="main-content">
            <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100%;">
              <h2>Welcome to Tempus Productivity Dashboard</h2>
              <p>Please use the sidebar to navigate to different sections of the app.</p>
              <div style="margin-top: 20px;">
                <a href="index.html" style="background-color: var(--primary-color); color: white; padding: 8px 16px; border-radius: 5px; text-decoration: none; margin: 0 10px;">Dashboard</a>
                <a href="calendar.html" style="background-color: var(--primary-color); color: white; padding: 8px 16px; border-radius: 5px; text-decoration: none; margin: 0 10px;">Calendar</a>
                <a href="youtube-manager.html" style="background-color: var(--primary-color); color: white; padding: 8px 16px; border-radius: 5px; text-decoration: none; margin: 0 10px;">YouTube Manager</a>
                <a href="settings.html" style="background-color: var(--primary-color); color: white; padding: 8px 16px; border-radius: 5px; text-decoration: none; margin: 0 10px;">Settings</a>
              </div>
            </div>
          </main>
        </div>
      </body>
      </html>
    `;
    
    // First try to load the index.html file
    const indexPath = path.join(tempDir, 'index.html');
    let fileToLoad;
    
    if (fs.existsSync(indexPath)) {
      // If index.html exists, load it
      fileToLoad = url.format({
        pathname: indexPath,
        protocol: 'file:',
        slashes: true
      });
      console.log('Loading index.html from:', fileToLoad);
    } else {
      // Otherwise create and load a fallback HTML file
      const fallbackPath = path.join(tempDir, 'fallback.html');
      fs.writeFileSync(fallbackPath, htmlContent);
      
      fileToLoad = url.format({
        pathname: fallbackPath,
        protocol: 'file:',
        slashes: true
      });
      console.log('Loading fallback HTML from:', fileToLoad);
    }
    
    mainWindow.loadURL(fileToLoad);
  }
  
  // Register error handler for page load failures
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });
  
  // Load dark mode preference from settings if it exists
  loadSettings();
  
  // IPC handlers for settings
  ipcMain.handle('get-dark-mode', () => {
    return darkMode;
  });
  
  ipcMain.handle('set-dark-mode', (event, value) => {
    darkMode = value;
    saveSettings();
    return true;
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

// Add IPC handlers for YouTube manager
ipcMain.on('save-youtube-link', (event, link) => {
  try {
    // Load existing data
    const data = loadData();
    
    // Ensure the youtubeLinks array exists
    if (!data.youtubeLinks) {
      data.youtubeLinks = [];
    }
    
    // Add the new link with an ID
    const newLink = {
      ...link,
      id: Date.now().toString(), // Simple unique ID
      added_on: new Date().toISOString()
    };
    
    data.youtubeLinks.push(newLink);
    
    // Save updated data
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    
    // Return success result with the new link
    event.reply('youtube-link-saved', { success: true, link: newLink });
  } catch (error) {
    console.error('Error saving YouTube link:', error);
    event.reply('youtube-link-saved', { success: false, error: error.message });
  }
});

ipcMain.on('get-youtube-links', (event) => {
  try {
    const data = loadData();
    event.reply('youtube-links', data.youtubeLinks || []);
  } catch (error) {
    console.error('Error getting YouTube links:', error);
    event.reply('youtube-links', []);
  }
});

ipcMain.on('delete-youtube-link', (event, linkId) => {
  try {
    // Load existing data
    const data = loadData();
    
    // Check if youtubeLinks exists
    if (!data.youtubeLinks) {
      event.reply('youtube-link-deleted', { success: false, error: 'No YouTube links found' });
      return;
    }
    
    // Find the index of the link to delete
    const index = data.youtubeLinks.findIndex(link => link.id === linkId);
    
    if (index === -1) {
      event.reply('youtube-link-deleted', { success: false, error: 'Link not found' });
      return;
    }
    
    // Remove the link
    data.youtubeLinks.splice(index, 1);
    
    // Save updated data
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    
    // Return success result
    event.reply('youtube-link-deleted', { success: true });
  } catch (error) {
    console.error('Error deleting YouTube link:', error);
    event.reply('youtube-link-deleted', { success: false, error: error.message });
  }
});

ipcMain.on('get-youtube-categories', (event) => {
  try {
    const data = loadData();
    event.reply('youtube-categories', data.youtubeCategories || ["All", "Watch Later", "Educational", "Entertainment"]);
  } catch (error) {
    console.error('Error getting YouTube categories:', error);
    event.reply('youtube-categories', ["All", "Watch Later", "Educational", "Entertainment"]);
  }
});

ipcMain.on('save-youtube-category', (event, category) => {
  try {
    // Load existing data
    const data = loadData();
    
    // Ensure the youtubeCategories array exists
    if (!data.youtubeCategories) {
      data.youtubeCategories = ["All", "Watch Later", "Educational", "Entertainment"];
    }
    
    // Check if category already exists
    if (data.youtubeCategories.includes(category)) {
      event.reply('youtube-category-saved', { success: false, error: 'Category already exists' });
      return;
    }
    
    // Add the new category
    data.youtubeCategories.push(category);
    
    // Save updated data
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    
    // Return success result
    event.reply('youtube-category-saved', { success: true, categories: data.youtubeCategories });
  } catch (error) {
    console.error('Error saving YouTube category:', error);
    event.reply('youtube-category-saved', { success: false, error: error.message });
  }
});

// Calendar events handlers
ipcMain.on('get-calendar-events', (event) => {
  try {
    const data = loadData();
    event.reply('calendar-events', data.calendarEvents || []);
  } catch (error) {
    console.error('Error getting calendar events:', error);
    event.reply('calendar-events', []);
  }
});

ipcMain.on('save-calendar-events', (event, events) => {
  try {
    // Load existing data
    const data = loadData();
    
    // Update calendar events
    data.calendarEvents = events;
    
    // Save updated data
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    
    // Return success result
    event.reply('calendar-events-saved', { success: true });
  } catch (error) {
    console.error('Error saving calendar events:', error);
    event.reply('calendar-events-saved', { success: false, error: error.message });
  }
});

ipcMain.on('add-calendar-event', (event, eventData) => {
  try {
    // Load existing data
    const data = loadData();
    
    // Ensure the calendarEvents array exists
    if (!data.calendarEvents) {
      data.calendarEvents = [];
    }
    
    // Add the new event with an ID if it doesn't have one
    const newEvent = {
      ...eventData,
      id: eventData.id || Date.now().toString() // Use provided ID or generate a new one
    };
    
    data.calendarEvents.push(newEvent);
    
    // Save updated data
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    
    // Return success result with the new event
    event.reply('calendar-event-added', { success: true, event: newEvent });
  } catch (error) {
    console.error('Error adding calendar event:', error);
    event.reply('calendar-event-added', { success: false, error: error.message });
  }
});

ipcMain.on('update-calendar-event', (event, { id, data: eventData }) => {
  try {
    // Load existing data
    const data = loadData();
    
    // Check if calendarEvents exists
    if (!data.calendarEvents) {
      event.reply('calendar-event-updated', { success: false, error: 'No calendar events found' });
      return;
    }
    
    // Find the index of the event to update
    const index = data.calendarEvents.findIndex(event => event.id === id);
    
    if (index === -1) {
      event.reply('calendar-event-updated', { success: false, error: 'Event not found' });
      return;
    }
    
    // Update the event
    data.calendarEvents[index] = {
      ...data.calendarEvents[index],
      ...eventData,
      id // Ensure ID remains the same
    };
    
    // Save updated data
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    
    // Return success result
    event.reply('calendar-event-updated', { success: true, event: data.calendarEvents[index] });
  } catch (error) {
    console.error('Error updating calendar event:', error);
    event.reply('calendar-event-updated', { success: false, error: error.message });
  }
});

ipcMain.on('delete-calendar-event', (event, eventId) => {
  try {
    // Load existing data
    const data = loadData();
    
    // Check if calendarEvents exists
    if (!data.calendarEvents) {
      event.reply('calendar-event-deleted', { success: false, error: 'No calendar events found' });
      return;
    }
    
    // Find the index of the event to delete
    const index = data.calendarEvents.findIndex(event => event.id === eventId);
    
    if (index === -1) {
      event.reply('calendar-event-deleted', { success: false, error: 'Event not found' });
      return;
    }
    
    // Remove the event
    data.calendarEvents.splice(index, 1);
    
    // Save updated data
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    
    // Return success result
    event.reply('calendar-event-deleted', { success: true });
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    event.reply('calendar-event-deleted', { success: false, error: error.message });
  }
});

// Settings handlers
ipcMain.on('get-settings', (event) => {
  try {
    const data = loadData();
    event.reply('settings', data.settings || {});
  } catch (error) {
    console.error('Error getting settings:', error);
    event.reply('settings', {});
  }
});

ipcMain.on('save-settings', (event, settings) => {
  try {
    // Load existing data
    const data = loadData();
    
    // Update settings
    data.settings = settings;
    
    // Save updated data
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
    
    // Return success result
    event.reply('settings-saved', { success: true });
  } catch (error) {
    console.error('Error saving settings:', error);
    event.reply('settings-saved', { success: false, error: error.message });
  }
});

function loadSettings() {
  try {
    const userDataPath = app.getPath('userData');
    const settingsPath = path.join(userDataPath, 'settings.json');
    
    if (fs.existsSync(settingsPath)) {
      const data = fs.readFileSync(settingsPath, 'utf8');
      const settings = JSON.parse(data);
      darkMode = settings.darkMode || false;
    }
  } catch (err) {
    console.error('Error loading settings:', err);
  }
}

function saveSettings() {
  try {
    const userDataPath = app.getPath('userData');
    const settingsPath = path.join(userDataPath, 'settings.json');
    
    const settings = {
      darkMode: darkMode
    };
    
    fs.writeFileSync(settingsPath, JSON.stringify(settings));
  } catch (err) {
    console.error('Error saving settings:', err);
  }
}

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
