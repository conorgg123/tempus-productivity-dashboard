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
- Visual timeline for scheduling with elegant design
- Color-coded event cards for different activity types
- Create and edit events with intuitive controls

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
2. Toggle between Day, Week, and Month views
3. Click on a time slot to add a new event
4. Color-code events by category (Focus, Meeting, Break, etc.)
5. Drag events to reschedule (in Week/Day views)

### YouTube Manager
1. Add YouTube URLs to save for later viewing
2. Create custom categories to organize videos
3. Search and filter your video collection
4. Click thumbnails to open videos in your browser

### Tasks
1. Create new tasks with the "New Task" button
2. Assign tasks to projects and set deadlines
3. Track progress with the visual indicators
4. Mark tasks complete by clicking checkboxes

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
│   ├── youtube-manager.html # YouTube manager
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

2. **Page navigation not working**
   - Verify that HTML files are accessible in the temp directory
   - Check for correct relative paths in the HTML href attributes

3. **Dark mode not applying**
   - Make sure the CSS variables are properly loaded
   - Check that the toggle is correctly updating the theme class

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Credits

Tempus Productivity Dashboard was created with a focus on elegant design and productivity enhancement. All data is stored locally for privacy.

---

Made with ❤️ for productivity enthusiasts
