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
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
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
          
          /* Card components */
          .card {
            background: var(--card-bg);
            border-radius: 12px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            padding: 20px;
            margin-bottom: 24px;
          }
          
          .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
          }
          
          .card-title {
            font-size: 16px;
            font-weight: 600;
            margin: 0;
          }
          
          /* Navigation */
          .nav-section {
            padding: 0 16px;
            margin-bottom: 16px;
          }
          
          .nav-section-title {
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: rgba(255,255,255,0.6);
            margin: 24px 0 8px 16px;
          }
          
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
          
          /* Timeline */
          .timeline-container {
            position: relative;
            margin-top: 16px;
            height: 140px;
            background: rgba(0,0,0,0.03);
            border-radius: 8px;
          }
          
          .timeline-scale {
            display: flex;
            position: relative;
            padding: 8px 0;
            justify-content: space-between;
            border-bottom: 1px solid var(--border-color);
          }
          
          .time-label {
            flex: 1;
            text-align: center;
            font-size: 12px;
            color: var(--text-secondary);
          }
          
          .timeline-events {
            position: relative;
            height: 100px;
            padding: 20px 0;
          }
          
          .timeline-event {
            position: absolute;
            height: 28px;
            top: 30px;
            border-radius: 4px;
            padding: 0 8px;
            display: flex;
            align-items: center;
            font-size: 12px;
            font-weight: 500;
            color: white;
          }
          
          .current-time {
            position: absolute;
            height: 100%;
            width: 2px;
            background-color: var(--primary-color);
            top: 0;
          }
          
          .current-time-label {
            position: absolute;
            top: -20px;
            background: var(--primary-color);
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 12px;
            transform: translateX(-50%);
          }
          
          /* Project item */
          .project-item {
            border-radius: 8px;
            border: 1px solid var(--border-color);
            margin-bottom: 16px;
            overflow: hidden;
          }
          
          .project-header {
            display: flex;
            align-items: center;
            padding: 16px;
            background: var(--card-bg);
          }
          
          .project-icon {
            width: 32px;
            height: 32px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            color: white;
          }
          
          .project-details {
            flex: 1;
          }
          
          .project-name {
            font-weight: 600;
            margin-bottom: 4px;
          }
          
          .project-progress-bar {
            height: 6px;
            background-color: rgba(0,0,0,0.05);
            border-radius: 3px;
            overflow: hidden;
          }
          
          .project-progress-fill {
            height: 100%;
            background-color: var(--primary-color);
          }
          
          .project-percentage {
            margin-left: 16px;
            font-weight: 600;
          }
          
          .project-tasks {
            border-top: 1px solid var(--border-color);
            padding: 8px 16px;
          }
          
          .task-item {
            display: flex;
            align-items: center;
            padding: 8px 0;
          }
          
          .task-checkbox {
            width: 18px;
            height: 18px;
            border-radius: 4px;
            border: 1px solid var(--border-color);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 12px;
            font-size: 12px;
            color: white;
          }
          
          .task-checkbox.completed {
            background-color: var(--primary-color);
            border-color: var(--primary-color);
          }
          
          .task-name {
            flex: 1;
            font-size: 14px;
          }
          
          .task-time {
            font-size: 12px;
            color: var(--text-secondary);
          }
          
          /* Tracking button */
          .tracking-btn {
            display: flex;
            align-items: center;
            background-color: #F3F4F6;
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
          }
          
          .tracking-btn.active {
            background-color: #EEF2FF;
            color: var(--primary-color);
            border-color: #C7D2FE;
          }
          
          .tracking-btn .material-icons {
            font-size: 16px;
            margin-right: 6px;
          }
          
          .tracking-btn.active .material-icons {
            color: var(--primary-color);
          }
          
          /* Buttons */
          .btn {
            background-color: #F3F4F6;
            border: 1px solid var(--border-color);
            color: var(--text-primary);
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: 500;
            cursor: pointer;
          }
          
          .btn-primary {
            background-color: var(--primary-color);
            color: white;
            border: none;
          }
          
          .view-toggle {
            display: flex;
            border: 1px solid var(--border-color);
            border-radius: 6px;
            overflow: hidden;
          }
          
          .view-btn {
            padding: 8px 16px;
            background: var(--card-bg);
            border: none;
            border-right: 1px solid var(--border-color);
            cursor: pointer;
            font-size: 14px;
          }
          
          .view-btn:last-child {
            border-right: none;
          }
          
          .view-btn.active {
            background-color: var(--primary-color);
            color: white;
          }
          
          /* Daily Summary */
          .summary-highlight {
            display: flex;
            align-items: flex-start;
            background-color: #EEF2FF;
            border-radius: 8px;
            padding: 16px;
            margin-bottom: 20px;
          }
          
          .summary-icon {
            font-size: 24px;
            margin-right: 16px;
            color: var(--primary-color);
          }
          
          .summary-text {
            font-size: 14px;
            line-height: 1.5;
            color: var(--text-primary);
            margin: 0;
          }
          
          /* Stats */
          .stats-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 20px;
          }
          
          .stat-item {
            background-color: var(--card-bg);
            border-radius: 8px;
            padding: 16px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          }
          
          .stat-title {
            font-size: 14px;
            color: var(--text-secondary);
            margin-bottom: 8px;
          }
          
          .stat-value {
            font-size: 24px;
            font-weight: 700;
          }
          
          .stat-unit {
            font-size: 14px;
            color: var(--text-secondary);
            margin-left: 4px;
          }
          
          /* Activity Breakdown */
          .breakdown-container {
            margin-top: 20px;
          }
          
          .breakdown-item {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
          }
          
          .breakdown-progress {
            flex: 1;
            height: 8px;
            background-color: #F3F4F6;
            border-radius: 4px;
            overflow: hidden;
            margin: 0 12px;
          }
          
          .breakdown-fill {
            height: 100%;
          }
          
          .breakdown-percent {
            font-weight: 600;
            width: 36px;
          }
          
          .breakdown-label {
            width: 60px;
            font-size: 14px;
            color: var(--text-secondary);
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
              <a class="nav-item active" href="#">
                <span class="material-icons nav-icon">dashboard</span>
                <span>Dashboard</span>
              </a>
              <a class="nav-item" href="#">
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
            
            <div class="nav-section" style="margin-top: auto;">
              <a class="nav-item" href="#">
                <span class="material-icons nav-icon">help</span>
                <span>Help</span>
              </a>
              <a class="nav-item" href="#">
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
            <header class="header">
              <div class="date-display" id="date-display">Wednesday, September 8, 2023</div>
              <div class="header-controls">
                <div class="view-toggle">
                  <button class="view-btn active">Day</button>
                  <button class="view-btn">Week</button>
                  <button class="view-btn">Month</button>
                </div>
                <button class="btn">Today</button>
                <button class="tracking-btn active">
                  <span class="material-icons">fiber_manual_record</span>
                  Active
                </button>
              </div>
            </header>
            
            <div class="content-area">
              <div class="dashboard-layout">
                <div class="left-column">
                  <div class="card">
                    <div class="card-header">
                      <h3 class="card-title">Timeline</h3>
                    </div>
                    <div class="timeline-container">
                      <div class="timeline-scale">
                        <div class="time-label">9:00</div>
                        <div class="time-label">11:00</div>
                        <div class="time-label">13:00</div>
                        <div class="time-label">15:00</div>
                        <div class="time-label">17:00</div>
                        <div class="time-label">19:00</div>
                      </div>
                      <div class="timeline-events">
                        <div class="current-time" style="left: 60%;">
                          <div class="current-time-label">19:41</div>
                        </div>
                        <div class="timeline-event" style="left: 10%; width: 15%; background-color: var(--break-color);">
                          Coding
                        </div>
                        <div class="timeline-event" style="left: 33%; width: 12%; background-color: var(--focus-color);">
                          Meeting
                        </div>
                        <div class="timeline-event" style="left: 53%; width: 20%; background-color: var(--design-color);">
                          Design
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div class="card">
                    <div class="card-header">
                      <h3 class="card-title">Projects & tasks</h3>
                    </div>
                    <div id="projects-list">
                      <!-- Dynamic content will be added here -->
                    </div>
                  </div>
                </div>
                
                <div class="right-column">
                  <div class="card">
                    <div class="card-header">
                      <h3 class="card-title">Daily Summary</h3>
                    </div>
                    <div class="summary-highlight">
                      <div class="summary-icon">⚡</div>
                      <p class="summary-text">
                        Today you had <strong>20%</strong> more meetings than usual, you closed <strong>2 tasks</strong> on two projects, but the focus was <strong>12%</strong> lower than yesterday.
                      </p>
                    </div>
                    
                    <div class="stats-container">
                      <div class="stat-item">
                        <div class="stat-title">Total time worked</div>
                        <div>
                          <span class="stat-value" id="total-time">6</span>
                          <span class="stat-unit">hr 18 min</span>
                        </div>
                      </div>
                      <div class="stat-item">
                        <div class="stat-title">Percent of work day</div>
                        <div>
                          <span class="stat-value" id="percent-day">79%</span>
                          <span class="stat-unit">of 8 hr 0 min</span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="breakdown-container">
                      <div class="breakdown-item">
                        <span class="breakdown-percent">62%</span>
                        <div class="breakdown-progress">
                          <div class="breakdown-fill" style="width: 62%; background-color: var(--focus-color);"></div>
                        </div>
                        <span class="breakdown-label">Focus</span>
                      </div>
                      <div class="breakdown-item">
                        <span class="breakdown-percent">15%</span>
                        <div class="breakdown-progress">
                          <div class="breakdown-fill" style="width: 15%; background-color: var(--design-color);"></div>
                        </div>
                        <span class="breakdown-label">Meetings</span>
                      </div>
                      <div class="breakdown-item">
                        <span class="breakdown-percent">11%</span>
                        <div class="breakdown-progress">
                          <div class="breakdown-fill" style="width: 11%; background-color: var(--break-color);"></div>
                        </div>
                        <span class="breakdown-label">Breaks</span>
                      </div>
                      <div class="breakdown-item">
                        <span class="breakdown-percent">12%</span>
                        <div class="breakdown-progress">
                          <div class="breakdown-fill" style="width: 12%; background-color: var(--other-color);"></div>
                        </div>
                        <span class="breakdown-label">Other</span>
                      </div>
                    </div>
                  </div>
                  
                  <div class="card">
                    <div class="card-header">
                      <h3 class="card-title">Apps & Websites</h3>
                    </div>
                    <div id="apps-list">
                      <!-- Dynamic content will be added here -->
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
        
        <script>
          // Set current date
          document.getElementById('date-display').textContent = new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
          
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
            // Update stats
            if (data.totalWorked) {
              document.getElementById('total-time').textContent = data.totalWorked.hours;
              document.getElementById('total-time').nextElementSibling.textContent = 'hr ' + data.totalWorked.minutes + ' min';
            }
            
            if (data.percentOfDay) {
              document.getElementById('percent-day').textContent = data.percentOfDay + '%';
            }
            
            // Render projects
            const projectsList = document.getElementById('projects-list');
            projectsList.innerHTML = '';
            
            if (data.projects && data.projects.length > 0) {
              data.projects.forEach(project => {
                const projectElement = document.createElement('div');
                projectElement.className = 'project-item';
                
                const projectHeader = document.createElement('div');
                projectHeader.className = 'project-header';
                
                const iconColor = project.name.includes('Finwall') ? 'var(--focus-color)' : 'var(--break-color)';
                
                projectHeader.innerHTML = 
                  '<div class="project-icon" style="background-color: ' + iconColor + '">' +
                  '<span class="material-icons">folder</span>' +
                  '</div>' +
                  '<div class="project-details">' +
                  '<div class="project-name">' + project.name + '</div>' +
                  '<div class="project-progress-bar">' +
                  '<div class="project-progress-fill" style="width: ' + project.percent + '%"></div>' +
                  '</div>' +
                  '</div>' +
                  '<div class="project-percentage">' + project.percent + '%</div>';
                
                projectElement.appendChild(projectHeader);
                
                // Add tasks if available
                if (project.tasks && project.tasks.length > 0) {
                  const tasksList = document.createElement('div');
                  tasksList.className = 'project-tasks';
                  
                  project.tasks.forEach(task => {
                    const taskItem = document.createElement('div');
                    taskItem.className = 'task-item';
                    
                    taskItem.innerHTML = 
                      '<div class="task-checkbox ' + (task.completed ? 'completed' : '') + '">' +
                      (task.completed ? '✓' : '') +
                      '</div>' +
                      '<div class="task-name">' + task.name + '</div>' +
                      '<div class="task-time">' + task.time + '</div>';
                    
                    tasksList.appendChild(taskItem);
                  });
                  
                  projectElement.appendChild(tasksList);
                }
                
                projectsList.appendChild(projectElement);
              });
            } else {
              projectsList.innerHTML = '<p style="padding: 16px; text-align: center;">No projects available.</p>';
            }
            
            // Render apps
            const appsList = document.getElementById('apps-list');
            appsList.innerHTML = '';
            
            if (data.apps && data.apps.length > 0) {
              data.apps.slice(0, 3).forEach(app => {
                const appItem = document.createElement('div');
                appItem.className = 'breakdown-item';
                appItem.style.padding = '8px 0';
                
                appItem.innerHTML = 
                  '<span class="breakdown-percent">' + app.percent + '%</span>' +
                  '<div class="breakdown-progress">' +
                  '<div class="breakdown-fill" style="width: ' + app.percent + '%; background-color: var(--design-color);"></div>' +
                  '</div>' +
                  '<span style="width: 120px; font-size: 14px;">' + app.name + '</span>' +
                  '<span style="font-size: 12px; color: var(--text-secondary);">' + app.time + '</span>';
                
                appsList.appendChild(appItem);
              });
              
              // Add categories section
              if (data.categories && data.categories.length > 0) {
                const categoriesTitle = document.createElement('h4');
                categoriesTitle.textContent = 'Top categories';
                categoriesTitle.style.margin = '20px 0 12px 0';
                categoriesTitle.style.fontSize = '14px';
                categoriesTitle.style.fontWeight = '600';
                
                appsList.appendChild(categoriesTitle);
                
                data.categories.forEach(category => {
                  const categoryItem = document.createElement('div');
                  categoryItem.className = 'breakdown-item';
                  categoryItem.style.padding = '8px 0';
                  
                  categoryItem.innerHTML = 
                    '<span class="breakdown-percent">' + category.percent + '%</span>' +
                    '<div class="breakdown-progress">' +
                    '<div class="breakdown-fill" style="width: ' + category.percent + '%; background-color: var(--focus-color);"></div>' +
                    '</div>' +
                    '<span style="width: 120px; font-size: 14px;">' + category.name + '</span>' +
                    '<span style="font-size: 12px; color: var(--text-secondary);">' + category.time + '</span>';
                  
                  appsList.appendChild(categoryItem);
                });
              }
            } else {
              appsList.innerHTML = '<p style="padding: 16px; text-align: center;">No app data available.</p>';
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
