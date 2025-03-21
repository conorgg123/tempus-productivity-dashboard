# TEMPUS-STYLE PRODUCTIVITY DASHBOARD
Write-Host "========= CREATING TEMPUS-STYLE DASHBOARD =========" -ForegroundColor Green

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

# Create package.json without BOM marker
Write-Host "3. Creating package.json..." -ForegroundColor Yellow
$packageContent = @"
{
  "name": "tempus-productivity-dashboard",
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

# Create main.js file
Write-Host "4. Creating Electron main.js file..." -ForegroundColor Yellow
$mainContent = @"
const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

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
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    backgroundColor: '#ffffff'
  });

  // Load index.html
  mainWindow.loadFile('index.html');
  
  // Open DevTools in development mode
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }
}

// When Electron is ready
app.whenReady().then(() => {
  createWindow();
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
"@
$mainContent | Out-File -FilePath "main.js" -Encoding ascii

# Create HTML file with Tempus layout
Write-Host "5. Creating HTML file with Tempus layout..." -ForegroundColor Yellow
$htmlContent = @"
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>tempus.</title>
  <style>
    :root {
      --primary-color: #7646f4;
      --primary-light: #f0eaff;
      --secondary-color: #6c757d;
      --success-color: #28a745;
      --danger-color: #dc3545;
      --light-color: #f8f9fa;
      --dark-color: #343a40;
      --border-color: #e5e5e5;
      --bg-color: #ffffff;
      --sidebar-width: 240px;
      --header-height: 64px;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    }
    
    body {
      background-color: var(--bg-color);
      color: #333;
      line-height: 1.6;
      overflow-x: hidden;
    }
    
    /* Sidebar */
    .sidebar {
      position: fixed;
      left: 0;
      top: 0;
      bottom: 0;
      width: var(--sidebar-width);
      background-color: #ffffff;
      border-right: 1px solid var(--border-color);
      padding: 20px 0;
      z-index: 100;
    }
    
    .sidebar-logo {
      padding: 0 20px 20px;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
    }
    
    .sidebar-logo img {
      width: 40px;
      height: 40px;
      margin-right: 10px;
    }
    
    .sidebar-logo h1 {
      font-size: 1.5rem;
      font-weight: bold;
      color: #000;
    }
    
    .sidebar-nav {
      list-style: none;
    }
    
    .sidebar-nav li {
      margin-bottom: 5px;
    }
    
    .sidebar-nav a {
      display: flex;
      align-items: center;
      padding: 12px 20px;
      text-decoration: none;
      color: #666;
      font-weight: 500;
      transition: all 0.3s;
    }
    
    .sidebar-nav a.active {
      background-color: #f5f5f5;
      color: #000;
      border-left: 3px solid var(--primary-color);
    }
    
    .sidebar-nav a:hover {
      background-color: #f5f5f5;
      color: #000;
    }
    
    .sidebar-nav .nav-icon {
      margin-right: 10px;
      font-size: 18px;
      width: 24px;
      text-align: center;
    }
    
    .sidebar-footer {
      position: absolute;
      bottom: 20px;
      width: 100%;
      padding: 0 20px;
    }
    
    /* Main content */
    .main-content {
      margin-left: var(--sidebar-width);
      min-height: 100vh;
      padding: 20px;
    }
    
    /* Header */
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 20px;
      border-bottom: 1px solid var(--border-color);
      margin-bottom: 20px;
    }
    
    .header-date {
      font-size: 1.5rem;
      font-weight: 500;
    }
    
    .header-tracking {
      display: flex;
      align-items: center;
      font-size: 0.9rem;
      color: #666;
    }
    
    .tracking-dot {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background-color: var(--success-color);
      margin-right: 6px;
    }
    
    .header-controls {
      display: flex;
      align-items: center;
    }
    
    .view-tabs {
      display: flex;
      background-color: #f5f5f5;
      border-radius: 6px;
      margin-right: 20px;
    }
    
    .view-tab {
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
    }
    
    .view-tab.active {
      background-color: white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .today-btn {
      padding: 8px 16px;
      background-color: white;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      cursor: pointer;
      font-size: 0.9rem;
      margin-right: 10px;
    }
    
    .nav-btn {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: white;
      border: 1px solid var(--border-color);
      border-radius: 6px;
      cursor: pointer;
      font-size: 1rem;
      margin-right: 5px;
    }
    
    /* Timeline section */
    .section {
      margin-bottom: 30px;
    }
    
    .section-title {
      font-size: 1.1rem;
      font-weight: 500;
      margin-bottom: 15px;
    }
    
    .timeline-container {
      background-color: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    
    .timeline {
      display: flex;
      height: 100px;
      position: relative;
      margin-top: 20px;
      margin-bottom: 20px;
    }
    
    .timeline-hour {
      flex: 1;
      text-align: center;
      font-size: 0.8rem;
      color: #888;
      position: relative;
    }
    
    .timeline-hour::before {
      content: '';
      position: absolute;
      top: -20px;
      left: 50%;
      height: 150px;
      width: 1px;
      background-color: #eee;
    }
    
    .timeline-block {
      position: absolute;
      top: 0;
      height: 100%;
      background-color: black;
      opacity: 0.8;
      border-radius: 4px;
    }
    
    .timeline-block.design {
      background-color: #4a6ee0;
    }
    
    .timeline-block.meeting {
      background-color: #a651e7;
    }
    
    .timeline-block.development {
      background-color: #6db56d;
    }
    
    .timeline-block.break {
      background-color: #e76c6c;
    }
    
    .timeline-legend {
      display: flex;
      justify-content: center;
      margin-top: 15px;
    }
    
    .timeline-legend-item {
      display: flex;
      align-items: center;
      margin: 0 10px;
      font-size: 0.8rem;
    }
    
    .legend-color {
      width: 30px;
      height: 10px;
      border-radius: 2px;
      margin-right: 5px;
    }
    
    /* Dashboard grid */
    .dashboard-grid {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 20px;
    }
    
    .dashboard-column {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    
    /* Summary section */
    .summary-container {
      background-color: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    
    .summary-header {
      margin-bottom: 20px;
      font-size: 1.2rem;
      font-weight: bold;
    }
    
    .summary-content {
      margin-bottom: 20px;
    }
    
    .summary-stat {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
    }
    
    .summary-stat-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background-color: var(--primary-light);
      color: var(--primary-color);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 10px;
      font-size: 0.8rem;
    }
    
    .highlight {
      font-weight: bold;
      padding: 0 4px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }
    
    .metrics-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-top: 30px;
    }
    
    .metric-box {
      background-color: white;
      border-radius: 8px;
      padding: 15px;
    }
    
    .metric-title {
      font-size: 0.8rem;
      color: #888;
      margin-bottom: 8px;
    }
    
    .metric-value {
      font-size: 1.8rem;
      font-weight: bold;
    }
    
    .metric-label {
      font-size: 0.8rem;
      color: #888;
    }
    
    /* Progress circle */
    .progress-container {
      position: relative;
      width: 120px;
      height: 120px;
    }
    
    .progress-circle {
      transform: rotate(-90deg);
      width: 100%;
      height: 100%;
    }
    
    .progress-circle-bg {
      fill: none;
      stroke: #f0f0f0;
      stroke-width: 10;
    }
    
    .progress-circle-value {
      fill: none;
      stroke-width: 10;
      stroke-linecap: round;
      transition: stroke-dasharray 0.3s ease;
    }
    
    .progress-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      font-size: 1.5rem;
      font-weight: bold;
    }
    
    /* Tasks and apps section */
    .list-container {
      background-color: white;
      border-radius: 10px;
      padding: 20px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
    }
    
    .list-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .list-title {
      font-size: 1.1rem;
      font-weight: 500;
    }
    
    .list-actions {
      display: flex;
    }
    
    .list-action {
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: white;
      border: 1px solid var(--border-color);
      border-radius: 50%;
      cursor: pointer;
      margin-left: 5px;
    }
    
    .list-item {
      padding: 10px 0;
      border-bottom: 1px solid #f5f5f5;
    }
    
    .list-item:last-child {
      border-bottom: none;
    }
    
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
    
    .item-name {
      font-weight: 500;
    }
    
    .item-time {
      font-size: 0.9rem;
      color: #888;
    }
    
    .progress-bar {
      height: 6px;
      background-color: #f0f0f0;
      border-radius: 3px;
      overflow: hidden;
    }
    
    .progress-value {
      height: 100%;
      background-color: var(--primary-color);
      border-radius: 3px;
    }
    
    /* Tasks list */
    .task-list {
      padding-left: 30px;
      margin-top: 8px;
    }
    
    .task-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 6px 0;
      font-size: 0.9rem;
    }
    
    .task-checkbox {
      margin-right: 8px;
    }
    
    .task-name {
      flex: 1;
    }
    
    .task-completed {
      text-decoration: line-through;
      color: #aaa;
    }
    
    /* Charts */
    .chart-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
    }
    
    .donut-chart {
      width: 100px;
      height: 100px;
      position: relative;
    }
    
    .chart-label {
      text-align: center;
      margin-top: 5px;
      font-size: 0.9rem;
    }
    
    .chart-value {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 1.2rem;
      font-weight: bold;
    }
    
    /* Categories */
    .categories-container {
      margin-top: 20px;
    }
    
    .category-item {
      margin-bottom: 15px;
    }
    
    .category-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;
    }
    
    .category-name {
      font-weight: 500;
    }
    
    .category-time {
      font-size: 0.9rem;
      color: #888;
    }
    
    /* Helper classes */
    .mt-2 {
      margin-top: 10px;
    }
    
    .mt-4 {
      margin-top: 20px;
    }
    
    /* Icon placeholders */
    .icon {
      font-size: 1.2rem;
      display: inline-block;
      width: 24px;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="sidebar">
    <div class="sidebar-logo">
      <div style="width: 40px; height: 40px; background-color: #7646f4; border-radius: 8px; margin-right: 10px;"></div>
      <h1>tempus.</h1>
    </div>
    
    <ul class="sidebar-nav">
      <li><a href="#" class="active"><span class="nav-icon">📊</span> Dashboard</a></li>
      <li><a href="#"><span class="nav-icon">📅</span> Calendar</a></li>
      <li><a href="#"><span class="nav-icon">📁</span> Projects & tasks</a></li>
      <li><a href="#"><span class="nav-icon">⏱️</span> Timer</a></li>
      <li><a href="#"><span class="nav-icon">📜</span> History</a></li>
    </ul>
    
    <div class="sidebar-footer">
      <ul class="sidebar-nav">
        <li><a href="#"><span class="nav-icon">❓</span> Help</a></li>
        <li><a href="#"><span class="nav-icon">⚙️</span> Settings</a></li>
        <li><a href="#"><span class="nav-icon">🚪</span> Log Out</a></li>
      </ul>
    </div>
  </div>
  
  <div class="main-content">
    <div class="header">
      <div class="header-date">Wednesday, September 8, 2023</div>
      <div class="header-tracking">
        <span class="tracking-dot"></span>
        Active
      </div>
      <div class="header-controls">
        <div class="view-tabs">
          <div class="view-tab active">Day</div>
          <div class="view-tab">Week</div>
          <div class="view-tab">Month</div>
        </div>
        <button class="today-btn">Today</button>
        <button class="nav-btn">←</button>
        <button class="nav-btn">→</button>
        <button class="nav-btn">⚙️</button>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Timeline</div>
      <div class="timeline-container">
        <div class="timeline" id="timeline">
          <div class="timeline-hour">9:00</div>
          <div class="timeline-hour">10:00</div>
          <div class="timeline-hour">11:00</div>
          <div class="timeline-hour">12:00</div>
          <div class="timeline-hour">13:00</div>
          <div class="timeline-hour">14:00</div>
          <div class="timeline-hour">15:00</div>
          <div class="timeline-hour">16:00</div>
          <div class="timeline-hour">17:00</div>
          <div class="timeline-hour">18:00</div>
          <div class="timeline-hour">19:00</div>
          <div class="timeline-hour">20:00</div>
          <!-- Timeline blocks will be added dynamically -->
        </div>
        <div class="timeline-legend">
          <div class="timeline-legend-item">
            <div class="legend-color" style="background-color: #4a6ee0;"></div>
            <span>Design</span>
          </div>
          <div class="timeline-legend-item">
            <div class="legend-color" style="background-color: #a651e7;"></div>
            <span>Meetings</span>
          </div>
          <div class="timeline-legend-item">
            <div class="legend-color" style="background-color: #6db56d;"></div>
            <span>Development</span>
          </div>
          <div class="timeline-legend-item">
            <div class="legend-color" style="background-color: #e76c6c;"></div>
            <span>Breaks</span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="dashboard-grid">
      <div class="dashboard-column">
        <!-- Projects & Tasks section -->
        <div class="list-container">
          <div class="list-header">
            <div class="list-title">Projects & tasks</div>
            <div class="list-actions">
              <button class="list-action">⋯</button>
            </div>
          </div>
          
          <div id="projects-list">
            <!-- Projects will be loaded dynamically -->
          </div>
        </div>
        
        <!-- Apps & Websites section -->
        <div class="list-container">
          <div class="list-header">
            <div class="list-title">Apps & Websites</div>
            <div class="list-actions">
              <button class="list-action">⋯</button>
            </div>
          </div>
          
          <div id="apps-list">
            <!-- Apps will be loaded dynamically -->
          </div>
        </div>
      </div>
      
      <div class="dashboard-column">
        <!-- Daily Summary section -->
        <div class="summary-container">
          <div class="summary-header">Daily Summary</div>
          <div class="summary-content">
            <div class="summary-stat">
              <div class="summary-stat-icon">⚡</div>
              <div>
                Today you had <span class="highlight">20%</span> more meetings than usual, you closed <span class="highlight">2 tasks</span> on two projects, but the focus was <span class="highlight">12%</span> lower than yesterday.
              </div>
            </div>
          </div>
          
          <div class="metrics-grid">
            <div class="metric-box">
              <div class="metric-title">Total time worked</div>
              <div class="metric-value">6 hr 18 min</div>
            </div>
            
            <div class="metric-box">
              <div class="metric-title">Percent of work day</div>
              <div style="display: flex; align-items: center;">
                <svg class="progress-circle" viewBox="0 0 36 36">
                  <path class="progress-circle-bg"
                    d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path class="progress-circle-value" style="stroke: #7646f4; stroke-dasharray: 79, 100;"
                    d="M18 2.0845
                    a 15.9155 15.9155 0 0 1 0 31.831
                    a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div style="margin-left: 10px;">
                  <div class="metric-value">79%</div>
                  <div class="metric-label">of 8 hr 0 min</div>
                </div>
              </div>
            </div>
          </div>
          
          <div class="chart-container mt-4">
            <div>
              <div class="donut-chart">
                <svg width="100" height="100" viewBox="0 0 42 42">
                  <circle cx="21" cy="21" r="16" fill="transparent" stroke="#f0f0f0" stroke-width="3"></circle>
                  <circle cx="21" cy="21" r="16" fill="transparent" stroke="#7646f4" stroke-width="3" stroke-dasharray="62.8 100" stroke-dashoffset="25"></circle>
                  <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="10" fill="#000">62%</text>
                </svg>
              </div>
              <div class="chart-label">Focus</div>
            </div>
            
            <div>
              <div class="donut-chart">
                <svg width="100" height="100" viewBox="0 0 42 42">
                  <circle cx="21" cy="21" r="16" fill="transparent" stroke="#f0f0f0" stroke-width="3"></circle>
                  <circle cx="21" cy="21" r="16" fill="transparent" stroke="#aaa" stroke-width="3" stroke-dasharray="15 100" stroke-dashoffset="25"></circle>
                  <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="10" fill="#000">15%</text>
                </svg>
              </div>
              <div class="chart-label">Meetings</div>
            </div>
            
            <div>
              <div class="donut-chart">
                <svg width="100" height="100" viewBox="0 0 42 42">
                  <circle cx="21" cy="21" r="16" fill="transparent" stroke="#f0f0f0" stroke-width="3"></circle>
                  <circle cx="21" cy="21" r="16" fill="transparent" stroke="#aaa" stroke-width="3" stroke-dasharray="11 100" stroke-dashoffset="25"></circle>
                  <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="10" fill="#000">11%</text>
                </svg>
              </div>
              <div class="chart-label">Breaks</div>
            </div>
            
            <div>
              <div class="donut-chart">
                <svg width="100" height="100" viewBox="0 0 42 42">
                  <circle cx="21" cy="21" r="16" fill="transparent" stroke="#f0f0f0" stroke-width="3"></circle>
                  <circle cx="21" cy="21" r="16" fill="transparent" stroke="#aaa" stroke-width="3" stroke-dasharray="12 100" stroke-dashoffset="25"></circle>
                  <text x="50%" y="50%" text-anchor="middle" dy=".3em" font-size="10" fill="#000">12%</text>
                </svg>
              </div>
              <div class="chart-label">Other</div>
            </div>
          </div>
          
          <div class="mt-4">
            <div class="metric-title">Top categories</div>
            <div class="categories-container" id="categories-list">
              <!-- Categories will be loaded dynamically -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    // Load dashboard data
    let dashboardData;
    
    function loadData() {
      try {
        // For Electron environment
        if (typeof require !== 'undefined') {
          const electron = require('electron');
          const fs = require('fs');
          const app = electron.remote ? electron.remote.app : electron.app;
          const path = require('path');
          
          // Try to load from user data folder
          const userDataPath = app.getPath('userData');
          const dataFilePath = path.join(userDataPath, 'dashboard-data.json');
          
          if (fs.existsSync(dataFilePath)) {
            dashboardData = JSON.parse(fs.readFileSync(dataFilePath));
          } else {
            // Use default data
            dashboardData = getDefaultData();
          }
        } else {
          // For browser testing, use hardcoded data
          dashboardData = getDefaultData();
        }
        
        // Render all components
        renderProjects();
        renderApps();
        renderCategories();
        renderTimeline();
        
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to default data
        dashboardData = getDefaultData();
        renderProjects();
        renderApps();
        renderCategories();
        renderTimeline();
      }
    }
    
    function getDefaultData() {
      return {
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
    }
    
    function renderProjects() {
      const projectsList = document.getElementById('projects-list');
      projectsList.innerHTML = '';
      
      dashboardData.projects.forEach(project => {
        const projectEl = document.createElement('div');
        projectEl.className = 'list-item';
        
        const hasTasks = project.tasks && project.tasks.length > 0;
        
        projectEl.innerHTML = \`
          <div class="item-header">
            <div class="item-name">
              <span class="icon">📁</span> \${project.name}
            </div>
            <div class="item-time">\${project.percent}% · \${project.time}</div>
          </div>
          <div class="progress-bar">
            <div class="progress-value" style="width: \${project.percent}%"></div>
          </div>
        \`;
        
        if (hasTasks) {
          const tasksEl = document.createElement('div');
          tasksEl.className = 'task-list';
          
          project.tasks.forEach(task => {
            const taskEl = document.createElement('div');
            taskEl.className = 'task-item';
            taskEl.innerHTML = \`
              <div style="display: flex; align-items: center;">
                <input type="checkbox" class="task-checkbox" \${task.completed ? 'checked' : ''}>
                <span class="task-name \${task.completed ? 'task-completed' : ''}">\${task.name}</span>
              </div>
              <div class="task-time">\${task.time}</div>
            \`;
            
            // Add event listener to checkbox
            taskEl.querySelector('.task-checkbox').addEventListener('change', (e) => {
              const nameEl = taskEl.querySelector('.task-name');
              if (e.target.checked) {
                nameEl.classList.add('task-completed');
              } else {
                nameEl.classList.remove('task-completed');
              }
            });
            
            tasksEl.appendChild(taskEl);
          });
          
          projectEl.appendChild(tasksEl);
        }
        
        projectsList.appendChild(projectEl);
      });
    }
    
    function renderApps() {
      const appsList = document.getElementById('apps-list');
      appsList.innerHTML = '';
      
      dashboardData.apps.forEach(app => {
        const appEl = document.createElement('div');
        appEl.className = 'list-item';
        
        appEl.innerHTML = \`
          <div class="item-header">
            <div class="item-name">\${app.name}</div>
            <div class="item-time">\${app.percent}% · \${app.time}</div>
          </div>
          <div class="progress-bar">
            <div class="progress-value" style="width: \${app.percent}%"></div>
          </div>
        \`;
        
        appsList.appendChild(appEl);
      });
    }
    
    function renderCategories() {
      const categoriesList = document.getElementById('categories-list');
      categoriesList.innerHTML = '';
      
      dashboardData.categories.forEach(category => {
        const categoryEl = document.createElement('div');
        categoryEl.className = 'category-item';
        
        categoryEl.innerHTML = \`
          <div class="category-header">
            <div class="category-name">\${category.name}</div>
            <div class="category-time">\${category.time}</div>
          </div>
          <div class="progress-bar">
            <div class="progress-value" style="width: \${category.percent}%"></div>
          </div>
        \`;
        
        categoriesList.appendChild(categoryEl);
      });
    }
    
    function renderTimeline() {
      const timeline = document.getElementById('timeline');
      
      // Calculate time range (9:00 - 20:00 = 11 hours = 660 minutes)
      const startHour = 9;
      const endHour = 20;
      const totalMinutes = (endHour - startHour) * 60;
      const timelineWidth = timeline.clientWidth;
      
      dashboardData.timelineBlocks.forEach(block => {
        // Convert times to minutes since start
        const startTime = block.start.split(':');
        const endTime = block.end.split(':');
        
        const startMinutes = (parseInt(startTime[0]) - startHour) * 60 + parseInt(startTime[1]);
        const endMinutes = (parseInt(endTime[0]) - startHour) * 60 + parseInt(endTime[1]);
        const duration = endMinutes - startMinutes;
        
        // Calculate positions
        const startPos = (startMinutes / totalMinutes) * timelineWidth;
        const width = (duration / totalMinutes) * timelineWidth;
        
        // Create block element
        const blockEl = document.createElement('div');
        blockEl.className = \`timeline-block \${block.type}\`;
        blockEl.style.left = \`\${startPos}px\`;
        blockEl.style.width = \`\${width}px\`;
        
        timeline.appendChild(blockEl);
      });
    }
    
    // Initialize data on page load
    document.addEventListener('DOMContentLoaded', loadData);
  </script>
</body>
</html>
"@
$htmlContent | Out-File -FilePath "index.html" -Encoding ascii

# Install dependencies
Write-Host "6. Installing dependencies..." -ForegroundColor Yellow
npm install

# Run the app
Write-Host "7. Starting the Tempus-style dashboard..." -ForegroundColor Green
npx electron . 