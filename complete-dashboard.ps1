# COMPLETE PRODUCTIVITY DASHBOARD
Write-Host "========= CREATING COMPLETE PRODUCTIVITY DASHBOARD =========" -ForegroundColor Green

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

# Create enhanced package.json without BOM marker
Write-Host "3. Creating complete package.json..." -ForegroundColor Yellow
$packageContent = @"
{
  "name": "productivity-dashboard",
  "version": "1.0.0",
  "private": true,
  "main": "main.js",
  "scripts": {
    "start": "electron ."
  },
  "dependencies": {
    "react": "17.0.2",
    "react-dom": "17.0.2"
  },
  "devDependencies": {
    "electron": "^13.6.9"
  }
}
"@
$packageContent | Out-File -FilePath "package.json" -Encoding ascii

# Create enhanced main.js file
Write-Host "4. Creating enhanced Electron main.js file..." -ForegroundColor Yellow
$mainContent = @"
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
"@
$mainContent | Out-File -FilePath "main.js" -Encoding ascii

# Create HTML file with all features
Write-Host "5. Creating complete HTML file with all features..." -ForegroundColor Yellow
$htmlContent = @"
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Productivity Dashboard</title>
  <style>
    :root {
      --primary-color: #4a6ee0;
      --primary-light: #e6ecff;
      --secondary-color: #6c757d;
      --success-color: #28a745;
      --danger-color: #dc3545;
      --warning-color: #ffc107;
      --light-color: #f8f9fa;
      --dark-color: #343a40;
      --shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      --border-radius: 8px;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      background-color: #f5f7fa;
      color: #333;
      line-height: 1.6;
    }
    
    header {
      background-color: white;
      padding: 1rem 2rem;
      box-shadow: var(--shadow);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .logo {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--primary-color);
      display: flex;
      align-items: center;
    }
    
    .logo i {
      margin-right: 0.5rem;
    }
    
    nav ul {
      display: flex;
      list-style: none;
    }
    
    nav ul li {
      margin-left: 1.5rem;
    }
    
    nav ul li a {
      text-decoration: none;
      color: var(--dark-color);
      font-weight: 500;
      transition: color 0.3s;
    }
    
    nav ul li a:hover {
      color: var(--primary-color);
    }
    
    .container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;
    }
    
    .dashboard-header {
      margin-bottom: 2rem;
      text-align: center;
    }
    
    .dashboard-header h1 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
      color: var(--dark-color);
    }
    
    .dashboard-header p {
      font-size: 1.1rem;
      color: var(--secondary-color);
    }
    
    .dashboard-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
    }
    
    .card {
      background: white;
      border-radius: var(--border-radius);
      box-shadow: var(--shadow);
      overflow: hidden;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .card:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 15px rgba(0, 0, 0, 0.1);
    }
    
    .card-header {
      background-color: var(--primary-color);
      color: white;
      padding: 1rem 1.5rem;
      font-size: 1.2rem;
      font-weight: 600;
    }
    
    .card-body {
      padding: 1.5rem;
      min-height: 300px;
    }
    
    .task-list, .notes-list, .links-list, .events-list {
      list-style: none;
    }
    
    .task-list li, .notes-list li, .links-list li, .events-list li {
      padding: 0.75rem 0;
      border-bottom: 1px solid #eee;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .task-list li:last-child, .notes-list li:last-child, .links-list li:last-child, .events-list li:last-child {
      border-bottom: none;
    }
    
    .task-item {
      display: flex;
      align-items: center;
    }
    
    .task-checkbox {
      margin-right: 0.75rem;
      width: 18px;
      height: 18px;
    }
    
    .task-completed {
      text-decoration: line-through;
      color: var(--secondary-color);
    }
    
    .add-item {
      margin-top: 1rem;
      display: flex;
    }
    
    .add-item input {
      flex: 1;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: var(--border-radius) 0 0 var(--border-radius);
      font-size: 1rem;
    }
    
    .add-item button {
      background-color: var(--primary-color);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      cursor: pointer;
      border-radius: 0 var(--border-radius) var(--border-radius) 0;
      font-size: 1rem;
      transition: background-color 0.3s;
    }
    
    .add-item button:hover {
      background-color: #3a5dc9;
    }
    
    .btn {
      background-color: var(--primary-color);
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: var(--border-radius);
      cursor: pointer;
      font-size: 0.9rem;
      transition: background-color 0.3s;
    }
    
    .btn:hover {
      background-color: #3a5dc9;
    }
    
    .btn-danger {
      background-color: var(--danger-color);
    }
    
    .btn-danger:hover {
      background-color: #bd2130;
    }
    
    .youtube-thumbnail {
      width: 120px;
      height: 68px;
      object-fit: cover;
      margin-right: 1rem;
      border-radius: 4px;
    }
    
    .youtube-item {
      display: flex;
      align-items: center;
    }
    
    .youtube-details {
      flex: 1;
    }
    
    .youtube-title {
      font-weight: 500;
    }
    
    .youtube-url {
      font-size: 0.8rem;
      color: var(--secondary-color);
      word-break: break-all;
    }
    
    .calendar {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 0.5rem;
    }
    
    .calendar-header {
      grid-column: span 7;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    
    .calendar-day {
      text-align: center;
      padding: 0.5rem;
      background-color: var(--light-color);
      border-radius: 4px;
      font-size: 0.8rem;
      font-weight: 500;
    }
    
    .calendar-day.today {
      background-color: var(--primary-light);
      color: var(--primary-color);
      font-weight: bold;
    }
    
    .calendar-day.has-event {
      position: relative;
    }
    
    .calendar-day.has-event::after {
      content: '';
      position: absolute;
      bottom: 4px;
      left: 50%;
      transform: translateX(-50%);
      width: 4px;
      height: 4px;
      background-color: var(--primary-color);
      border-radius: 50%;
    }
    
    .modal {
      display: none;
      position: fixed;
      z-index: 100;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
    }
    
    .modal-content {
      background-color: white;
      margin: 10% auto;
      padding: 2rem;
      border-radius: var(--border-radius);
      max-width: 500px;
      box-shadow: var(--shadow);
      position: relative;
    }
    
    .close-modal {
      position: absolute;
      top: 1rem;
      right: 1rem;
      font-size: 1.5rem;
      cursor: pointer;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }
    
    .form-group input, .form-group textarea, .form-group select {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: var(--border-radius);
      font-size: 1rem;
    }
    
    .form-group textarea {
      min-height: 100px;
      resize: vertical;
    }
    
    .modal-footer {
      margin-top: 2rem;
      display: flex;
      justify-content: flex-end;
      gap: 1rem;
    }
    
    /* Responsive Design */
    @media (max-width: 768px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
      
      nav ul {
        display: none;
      }
    }
  </style>
</head>
<body>
  <header>
    <div class="logo">
      <i class="fas fa-tasks"></i> Productivity Dashboard
    </div>
    <nav>
      <ul>
        <li><a href="#" class="active">Dashboard</a></li>
        <li><a href="#">Settings</a></li>
        <li><a href="#">Help</a></li>
      </ul>
    </nav>
  </header>

  <div class="container">
    <div class="dashboard-header">
      <h1>Productivity Dashboard</h1>
      <p>Your personal productivity application</p>
    </div>

    <div class="dashboard-grid">
      <!-- Tasks -->
      <div class="card">
        <div class="card-header">Tasks</div>
        <div class="card-body">
          <ul class="task-list" id="task-list">
            <!-- Tasks will be loaded dynamically -->
          </ul>
          <div class="add-item">
            <input type="text" id="new-task-input" placeholder="Add a new task...">
            <button id="add-task-btn">Add</button>
          </div>
        </div>
      </div>

      <!-- Notes -->
      <div class="card">
        <div class="card-header">Notes</div>
        <div class="card-body">
          <ul class="notes-list" id="notes-list">
            <!-- Notes will be loaded dynamically -->
          </ul>
          <button class="btn" id="add-note-btn" style="margin-top: 1rem;">Add Note</button>
        </div>
      </div>

      <!-- YouTube Links -->
      <div class="card">
        <div class="card-header">YouTube Links</div>
        <div class="card-body">
          <ul class="links-list" id="youtube-list">
            <!-- YouTube links will be loaded dynamically -->
          </ul>
          <div class="add-item">
            <input type="text" id="new-youtube-input" placeholder="Add a YouTube URL...">
            <button id="add-youtube-btn">Add</button>
          </div>
        </div>
      </div>

      <!-- Calendar -->
      <div class="card">
        <div class="card-header">Calendar</div>
        <div class="card-body">
          <div class="calendar-header">
            <button class="btn" id="prev-month">Previous</button>
            <h3 id="current-month">June 2023</h3>
            <button class="btn" id="next-month">Next</button>
          </div>
          <div class="calendar" id="calendar-grid">
            <!-- Calendar days will be loaded dynamically -->
          </div>
          <button class="btn" id="add-event-btn" style="margin-top: 1rem;">Add Event</button>
        </div>
      </div>
    </div>
  </div>

  <!-- Add Note Modal -->
  <div class="modal" id="note-modal">
    <div class="modal-content">
      <span class="close-modal" id="close-note-modal">&times;</span>
      <h2>Add Note</h2>
      <div class="form-group">
        <label for="note-title">Title</label>
        <input type="text" id="note-title" placeholder="Note title">
      </div>
      <div class="form-group">
        <label for="note-content">Content</label>
        <textarea id="note-content" placeholder="Note content"></textarea>
      </div>
      <div class="modal-footer">
        <button class="btn" id="save-note-btn">Save</button>
      </div>
    </div>
  </div>

  <!-- Add Event Modal -->
  <div class="modal" id="event-modal">
    <div class="modal-content">
      <span class="close-modal" id="close-event-modal">&times;</span>
      <h2>Add Event</h2>
      <div class="form-group">
        <label for="event-title">Title</label>
        <input type="text" id="event-title" placeholder="Event title">
      </div>
      <div class="form-group">
        <label for="event-date">Date</label>
        <input type="datetime-local" id="event-date">
      </div>
      <div class="form-group">
        <label for="event-description">Description</label>
        <textarea id="event-description" placeholder="Event description"></textarea>
      </div>
      <div class="modal-footer">
        <button class="btn" id="save-event-btn">Save</button>
      </div>
    </div>
  </div>

  <!-- Font Awesome -->
  <script src="https://kit.fontawesome.com/a076d05399.js" crossorigin="anonymous"></script>
  
  <!-- Main Script -->
  <script>
    // Global data object
    let dashboardData = {
      tasks: [],
      notes: [],
      youtubeLinks: [],
      events: []
    };

    // DOM Elements
    const taskList = document.getElementById('task-list');
    const newTaskInput = document.getElementById('new-task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    
    const notesList = document.getElementById('notes-list');
    const addNoteBtn = document.getElementById('add-note-btn');
    const noteModal = document.getElementById('note-modal');
    const closeNoteModal = document.getElementById('close-note-modal');
    const noteTitleInput = document.getElementById('note-title');
    const noteContentInput = document.getElementById('note-content');
    const saveNoteBtn = document.getElementById('save-note-btn');
    
    const youtubeList = document.getElementById('youtube-list');
    const newYoutubeInput = document.getElementById('new-youtube-input');
    const addYoutubeBtn = document.getElementById('add-youtube-btn');
    
    const calendarGrid = document.getElementById('calendar-grid');
    const currentMonthEl = document.getElementById('current-month');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const addEventBtn = document.getElementById('add-event-btn');
    const eventModal = document.getElementById('event-modal');
    const closeEventModal = document.getElementById('close-event-modal');
    const eventTitleInput = document.getElementById('event-title');
    const eventDateInput = document.getElementById('event-date');
    const eventDescriptionInput = document.getElementById('event-description');
    const saveEventBtn = document.getElementById('save-event-btn');

    // Calendar variables
    let currentDate = new Date();
    
    // Electron IPC handling (if available)
    let electron;
    try {
      electron = require('electron');
    } catch (e) {
      console.log('Electron not available, using localStorage');
    }

    // Load data from storage
    async function loadData() {
      try {
        if (electron && electron.ipcRenderer) {
          // Load from Electron's IPC
          dashboardData = await electron.ipcRenderer.invoke('get-data');
        } else {
          // Fallback to localStorage
          const savedData = localStorage.getItem('dashboardData');
          if (savedData) {
            dashboardData = JSON.parse(savedData);
          } else {
            // Default data
            dashboardData = {
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
            saveData();
          }
        }
        
        renderAllComponents();
      } catch (error) {
        console.error('Error loading data:', error);
      }
    }

    // Save data to storage
    async function saveData() {
      try {
        if (electron && electron.ipcRenderer) {
          // Save using Electron's IPC
          await electron.ipcRenderer.invoke('save-data', dashboardData);
        } else {
          // Fallback to localStorage
          localStorage.setItem('dashboardData', JSON.stringify(dashboardData));
        }
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }

    // Render all components
    function renderAllComponents() {
      renderTasks();
      renderNotes();
      renderYoutubeLinks();
      renderCalendar();
    }

    // Generate a unique ID
    function generateId() {
      return Date.now();
    }

    // Tasks
    function renderTasks() {
      taskList.innerHTML = '';
      dashboardData.tasks.forEach(task => {
        const li = document.createElement('li');
        
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTaskCompletion(task.id));
        
        const span = document.createElement('span');
        span.textContent = task.title;
        if (task.completed) {
          span.className = 'task-completed';
        }
        
        taskItem.appendChild(checkbox);
        taskItem.appendChild(span);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteTask(task.id));
        
        li.appendChild(taskItem);
        li.appendChild(deleteBtn);
        
        taskList.appendChild(li);
      });
    }

    function addTask() {
      const title = newTaskInput.value.trim();
      if (title) {
        const newTask = {
          id: generateId(),
          title: title,
          completed: false
        };
        
        dashboardData.tasks.push(newTask);
        saveData();
        renderTasks();
        
        newTaskInput.value = '';
      }
    }

    function toggleTaskCompletion(taskId) {
      const task = dashboardData.tasks.find(t => t.id === taskId);
      if (task) {
        task.completed = !task.completed;
        saveData();
        renderTasks();
      }
    }

    function deleteTask(taskId) {
      dashboardData.tasks = dashboardData.tasks.filter(t => t.id !== taskId);
      saveData();
      renderTasks();
    }

    // Notes
    function renderNotes() {
      notesList.innerHTML = '';
      
      dashboardData.notes.forEach(note => {
        const li = document.createElement('li');
        
        const noteInfo = document.createElement('div');
        const title = document.createElement('h4');
        title.textContent = note.title;
        
        const preview = document.createElement('p');
        preview.textContent = note.content.length > 50 
          ? note.content.substring(0, 50) + '...' 
          : note.content;
        
        noteInfo.appendChild(title);
        noteInfo.appendChild(preview);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteNote(note.id));
        
        li.appendChild(noteInfo);
        li.appendChild(deleteBtn);
        
        notesList.appendChild(li);
      });
    }

    function addNote() {
      const title = noteTitleInput.value.trim();
      const content = noteContentInput.value.trim();
      
      if (title && content) {
        const newNote = {
          id: generateId(),
          title: title,
          content: content
        };
        
        dashboardData.notes.push(newNote);
        saveData();
        renderNotes();
        
        noteTitleInput.value = '';
        noteContentInput.value = '';
        noteModal.style.display = 'none';
      }
    }

    function deleteNote(noteId) {
      dashboardData.notes = dashboardData.notes.filter(n => n.id !== noteId);
      saveData();
      renderNotes();
    }

    // YouTube Links
    function renderYoutubeLinks() {
      youtubeList.innerHTML = '';
      
      dashboardData.youtubeLinks.forEach(link => {
        const li = document.createElement('li');
        
        const youtubeItem = document.createElement('div');
        youtubeItem.className = 'youtube-item';
        
        // Extract video ID from YouTube URL
        let videoId = '';
        try {
          const url = new URL(link.url);
          if (url.hostname.includes('youtube.com')) {
            videoId = url.searchParams.get('v');
          } else if (url.hostname.includes('youtu.be')) {
            videoId = url.pathname.substr(1);
          }
        } catch (e) {
          console.error('Invalid URL:', link.url);
        }
        
        // Create thumbnail if video ID was extracted
        if (videoId) {
          const thumbnail = document.createElement('img');
          thumbnail.className = 'youtube-thumbnail';
          thumbnail.src = \`https://img.youtube.com/vi/\${videoId}/mqdefault.jpg\`;
          youtubeItem.appendChild(thumbnail);
        }
        
        const details = document.createElement('div');
        details.className = 'youtube-details';
        
        const title = document.createElement('div');
        title.className = 'youtube-title';
        title.textContent = link.title || 'Untitled Video';
        
        const urlEl = document.createElement('div');
        urlEl.className = 'youtube-url';
        urlEl.textContent = link.url;
        
        details.appendChild(title);
        details.appendChild(urlEl);
        youtubeItem.appendChild(details);
        
        const openBtn = document.createElement('button');
        openBtn.className = 'btn';
        openBtn.textContent = 'Open';
        openBtn.addEventListener('click', () => {
          // Open URL in default browser
          if (electron && electron.shell) {
            electron.shell.openExternal(link.url);
          } else {
            window.open(link.url, '_blank');
          }
        });
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-danger';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteYoutubeLink(link.id));
        
        li.appendChild(youtubeItem);
        
        const btnGroup = document.createElement('div');
        btnGroup.style.display = 'flex';
        btnGroup.style.gap = '0.5rem';
        btnGroup.appendChild(openBtn);
        btnGroup.appendChild(deleteBtn);
        
        li.appendChild(btnGroup);
        
        youtubeList.appendChild(li);
      });
    }

    function addYoutubeLink() {
      const url = newYoutubeInput.value.trim();
      
      if (url) {
        // Try to get video title from meta data (not possible without server)
        // For now, just extract from URL or use default
        let title = 'YouTube Video';
        try {
          const urlObj = new URL(url);
          if (urlObj.searchParams.get('v')) {
            title = 'YouTube Video ' + urlObj.searchParams.get('v');
          } else if (urlObj.hostname.includes('youtu.be')) {
            title = 'YouTube Video ' + urlObj.pathname.substr(1);
          }
        } catch (e) {
          console.error('Invalid URL:', url);
        }
        
        const newLink = {
          id: generateId(),
          title: title,
          url: url
        };
        
        dashboardData.youtubeLinks.push(newLink);
        saveData();
        renderYoutubeLinks();
        
        newYoutubeInput.value = '';
      }
    }

    function deleteYoutubeLink(linkId) {
      dashboardData.youtubeLinks = dashboardData.youtubeLinks.filter(l => l.id !== linkId);
      saveData();
      renderYoutubeLinks();
    }

    // Calendar
    function renderCalendar() {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      // Update header text
      currentMonthEl.textContent = new Date(year, month, 1).toLocaleDateString('default', { month: 'long', year: 'numeric' });
      
      // Clear calendar grid
      calendarGrid.innerHTML = '';
      
      // Add day headers
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      dayNames.forEach(day => {
        const dayHeader = document.createElement('div');
        dayHeader.className = 'calendar-day';
        dayHeader.textContent = day;
        dayHeader.style.fontWeight = 'bold';
        calendarGrid.appendChild(dayHeader);
      });
      
      // Get first day of month and number of days
      const firstDay = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      // Add empty cells for days before first of month
      for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        calendarGrid.appendChild(emptyDay);
      }
      
      // Add days of the month
      const today = new Date();
      for (let day = 1; day <= daysInMonth; day++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        dayEl.textContent = day;
        
        // Check if this is today
        if (today.getFullYear() === year && today.getMonth() === month && today.getDate() === day) {
          dayEl.classList.add('today');
        }
        
        // Check if there are events on this day
        const eventsOnDay = dashboardData.events.filter(event => {
          const eventDate = new Date(event.date);
          return eventDate.getFullYear() === year && 
                 eventDate.getMonth() === month && 
                 eventDate.getDate() === day;
        });
        
        if (eventsOnDay.length > 0) {
          dayEl.classList.add('has-event');
          dayEl.title = eventsOnDay.map(e => e.title).join(', ');
          
          // Make clickable to show events
          dayEl.style.cursor = 'pointer';
          dayEl.addEventListener('click', () => showEventsForDay(year, month, day));
        }
        
        calendarGrid.appendChild(dayEl);
      }
    }

    function showEventsForDay(year, month, day) {
      const eventsOnDay = dashboardData.events.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getFullYear() === year && 
               eventDate.getMonth() === month && 
               eventDate.getDate() === day;
      });
      
      if (eventsOnDay.length > 0) {
        const formattedDate = new Date(year, month, day).toLocaleDateString();
        const eventsList = eventsOnDay.map(e => {
          const time = new Date(e.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          return \`- \${e.title} (\${time}): \${e.description || 'No description'}\`;
        }).join('\\n');
        
        alert(\`Events on \${formattedDate}:\\n\${eventsList}\`);
      }
    }

    function addEvent() {
      const title = eventTitleInput.value.trim();
      const date = eventDateInput.value;
      const description = eventDescriptionInput.value.trim();
      
      if (title && date) {
        const newEvent = {
          id: generateId(),
          title: title,
          date: date,
          description: description
        };
        
        dashboardData.events.push(newEvent);
        saveData();
        renderCalendar();
        
        eventTitleInput.value = '';
        eventDateInput.value = '';
        eventDescriptionInput.value = '';
        eventModal.style.display = 'none';
      }
    }

    function navigateMonth(offset) {
      currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
      renderCalendar();
    }

    // Event Listeners
    document.addEventListener('DOMContentLoaded', () => {
      // Initialize the app
      loadData();
      
      // Task event listeners
      addTaskBtn.addEventListener('click', addTask);
      newTaskInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
          addTask();
        }
      });
      
      // Note event listeners
      addNoteBtn.addEventListener('click', () => {
        noteModal.style.display = 'block';
      });
      closeNoteModal.addEventListener('click', () => {
        noteModal.style.display = 'none';
      });
      saveNoteBtn.addEventListener('click', addNote);
      
      // YouTube event listeners
      addYoutubeBtn.addEventListener('click', addYoutubeLink);
      newYoutubeInput.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
          addYoutubeLink();
        }
      });
      
      // Calendar event listeners
      prevMonthBtn.addEventListener('click', () => navigateMonth(-1));
      nextMonthBtn.addEventListener('click', () => navigateMonth(1));
      
      addEventBtn.addEventListener('click', () => {
        eventModal.style.display = 'block';
      });
      closeEventModal.addEventListener('click', () => {
        eventModal.style.display = 'none';
      });
      saveEventBtn.addEventListener('click', addEvent);
      
      // Close modals when clicking outside
      window.addEventListener('click', e => {
        if (e.target === noteModal) {
          noteModal.style.display = 'none';
        }
        if (e.target === eventModal) {
          eventModal.style.display = 'none';
        }
      });
    });
  </script>
</body>
</html>
"@
$htmlContent | Out-File -FilePath "index.html" -Encoding ascii

# Install dependencies
Write-Host "6. Installing dependencies..." -ForegroundColor Yellow
npm install

# Create icon file (simple placeholder)
Write-Host "7. Creating application icon..." -ForegroundColor Yellow
$iconContent = @"
<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#4a6ee0"/>
  <text x="50" y="60" font-family="Arial" font-size="50" text-anchor="middle" fill="white">PD</text>
</svg>
"@
$iconContent | Out-File -FilePath "icon.svg" -Encoding ascii

# Run the app
Write-Host "8. Starting the complete productivity dashboard..." -ForegroundColor Green
npx electron . 