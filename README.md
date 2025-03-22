# Tempus Productivity Dashboard

A modern desktop application built with Electron and a clean, professional UI that integrates YouTube link management, time tracking, task management, calendar functionality, and a beautiful dark mode interface.

![Tempus Dashboard](https://i.imgur.com/YourDashboardImage.png)

## Features

### Modern, Responsive UI
- Professional dark sidebar with color-coded categories
- Responsive card-based layout with subtle hover effects
- Beautiful gradient colors for different activity types
- Seamless dark/light mode toggle

### Dashboard
- Activity timeline with gradient-colored events
- Project and task progress tracking with visual indicators
- Time analytics with breakdown charts
- Quick access to YouTube bookmarks

### Calendar
- Modern calendar with week, day, and month views
- Professional UI with clear date navigation and view toggles
- Color-coded event cards for different activity types (meetings, design, focus sessions)
- Detailed event information including attendees and locations
- Interactive event management with modal dialog for event details
- Proper handling of overlapping events with intelligent positioning
- Week view with full day names and day numbers
- Time slots from 6am to 1pm for productive day planning

### YouTube Link Manager
- Save and organize YouTube links with thumbnails
- Categorize videos by type (Educational, Entertainment, etc.)
- Auto-fetches video metadata and thumbnails
- Filter and search functionality

### Task Management
- Track tasks with visual progress indicators
- Associate tasks with projects
- Set priorities and estimated time
- Mark tasks complete with satisfying visual feedback

### Projects and Tasks
- **Visual Progress Tracking**: Monitor task completion with intuitive progress bars showing percentage complete (0-100%)
- **Project Organization**: Group related tasks into custom projects with color-coding for easy identification
- **Priority Levels**: Assign High, Medium, or Low priority to tasks for better workload management
- **Time Estimation**: Add estimated time requirements to better plan your day and measure productivity
- **Completion Tracking**: Mark tasks as completed with a satisfying visual indicator and automatic progress updates
- **Filtering System**: Filter tasks by completion status, priority level, or project association
- **Drag and Drop Interface**: Easily reorganize tasks within projects using intuitive drag and drop functionality
- **Quick Actions**: Access common actions like edit, delete, or mark complete through convenient action buttons
- **Deadline Management**: Set and track task deadlines with visual indicators for approaching due dates
- **Progress History**: View historical data on task completion patterns and productivity trends

### Timer
- Track time spent on specific tasks or projects
- Start, pause, and reset functionality
- Visual time display with hours, minutes, and seconds
- Activity history for reviewing time usage

### Activity History
- Review past productivity sessions
- Weekly activity summary with visual charts
- Track patterns in your productivity over time
- Filter history by activity type or date range

### Settings & Personalization
- Toggle between light and dark mode
- Customize accent colors
- Profile settings
- Interface preferences

## Technologies Used

- **Electron**: Cross-platform desktop app framework
- **Modern HTML/CSS**: Responsive, professional UI components
- **JavaScript**: Core functionality and interactivity
- **CSS Variables**: Theming support for light/dark mode
- **Local Storage API**: Persistent data storage

## System Requirements

- **Operating System**: Windows, macOS, or Linux
- **Disk Space**: At least 250MB of free space
- **Memory**: 4GB RAM minimum, 8GB recommended
- **Processor**: Any modern processor (2013 or newer)

## Installation

### Prerequisites
- Node.js 14.0+ and npm 6.0+

### Setup

1. Clone the repository:
```
git clone https://github.com/yourusername/tempus-productivity-dashboard.git
```

2. Install dependencies:
```
cd tempus-productivity-dashboard
npm install
```

3. Run in development mode:
```
npm run dev
```

4. Build for production:
```
npm run dist
```

## Usage Guide

### Dashboard
- The main dashboard shows your daily activity overview
- View your focus time, task completion, and productivity metrics
- Check upcoming tasks and recent YouTube bookmarks
- Use the timeline to visualize your day's activities

### Calendar
1. Navigate to the Calendar section from the sidebar
2. Toggle between Day, Week, and Month views using the view buttons
3. Navigate between dates using the arrow buttons or "Today" button
4. View events color-coded by type (blue for design, orange for meetings, purple for focus sessions)
5. Click on an event to view detailed information including time, location, and attendees
6. Add new events using the floating "+" button
7. Edit or delete events through the event details modal
8. See overlapping events properly displayed side by side

### YouTube Manager
1. Add YouTube URLs to save for later viewing
2. Create custom categories to organize videos
3. Search and filter your video collection
4. Click thumbnails to open videos in your browser

### Projects & Tasks
1. Create new tasks with the "New Task" button
2. Assign tasks to projects and set deadlines
3. Track progress with the visual indicators
4. Mark tasks complete by clicking checkboxes
5. Filter tasks by project, priority, or completion status

### Timer
1. Start the timer to track time spent on activities
2. Pause when taking breaks or switching tasks
3. Reset the timer for new activities
4. View your current session time in a clear, readable format

### Activity History
1. Browse through your past productivity sessions
2. See a weekly summary of your activities
3. Analyze patterns in your work habits
4. Filter history by activity type or time period

### Settings
1. Toggle dark mode on/off
2. Customize application preferences
3. Manage your user profile
4. Set notification preferences

## Project Structure

```
tempus-productivity-dashboard/
├── out/                  # Production output files
│   ├── index.html        # Main dashboard page
│   ├── calendar.html     # Calendar interface
│   ├── projects-tasks.html # Projects & tasks manager
│   ├── timer.html        # Time tracking feature
│   ├── history.html      # Activity history
│   ├── youtube-manager.html # YouTube manager
│   ├── help.html         # Help & support
│   ├── settings.html     # Settings page
│   └── production-fix.css # Styles for production
├── src/                  # Source code
│   ├── components/       # UI components
│   ├── pages/            # Application pages
│   ├── styles/           # CSS modules
│   └── utils/            # Utility functions
├── main.js               # Electron main process
├── preload.js            # Electron preload script
└── package.json          # Project configuration
```

## Running in Production Mode

To run the application in production mode:

```
$env:NODE_ENV="production" ; npx electron .
```

This loads the optimized build from the `out` directory.

## Troubleshooting

### Common Issues

1. **White screen on startup**
   - Ensure all HTML files are correctly copied to the temp directory
   - Check console for any loading errors
   - Verify that main.js is properly copying all required files

2. **Page navigation not working**
   - Verify that HTML files are accessible in the temp directory
   - Check for correct relative paths in the HTML href attributes
   - Confirm that all sidebar links point to existing HTML files

3. **Dark mode not applying**
   - Make sure the CSS variables are properly loaded
   - Check that the toggle is correctly updating the theme class
   - Verify that the production-fix.css file contains all necessary style rules

4. **Cache errors in console**
   - These are common Electron cache errors that don't affect functionality
   - They typically happen when multiple instances of Electron are running
   - You can safely ignore "Unable to create cache" and "Access is denied" messages

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

Tempus Productivity Dashboard was created with a focus on elegant design and productivity enhancement. All data is stored locally for privacy.

---

Made with ❤️ for productivity enthusiasts
