# Tempus Productivity Dashboard

A sleek, modern productivity management application built with Electron that helps you organize projects, track tasks, manage time, and boost your productivity.

![Tempus Dashboard](./screenshots/dashboard.png)

## Features

### Projects & Tasks Management
- **Project Organization**: Create, edit, and delete projects with customizable colors
- **Task Tracking**: Add tasks with detailed information including priority, estimated time, and deadlines
- **Progress Visualization**: Track project completion with interactive progress bars
- **Priority Levels**: Assign High, Medium, or Low priority to tasks
- **Filtering**: Filter tasks by status, priority, or project
- **Persistent Storage**: All data is saved locally using localStorage

### Time Management
- **Pomodoro Timer**: Focus using the built-in work/break timer
- **Task Timing**: Track time spent on specific tasks
- **History**: View your productivity patterns over time

### Additional Tools
- **Calendar**: Schedule and manage your tasks with the integrated calendar
- **YouTube Manager**: Organize educational videos and resources
- **Dashboard Overview**: Get a quick view of your productivity status

## Installation

### Prerequisites
- Node.js (v14+)
- npm (v6+)

### Setup
1. Clone the repository:
```bash
git clone https://github.com/conorgg123/tempus-productivity-dashboard.git
```

2. Navigate to the project directory:
```bash
cd tempus-productivity-dashboard
```

3. Install dependencies:
```bash
npm install
```

4. Run the application:
```bash
# For development mode with hot-reload
npm run dev

# For production mode
npm run start
```

## Usage Guide

### Managing Projects

1. **Create a Project**:
   - Click the "New Project" button in the header
   - Enter a project name
   - Choose a color for the project
   - Click "Save Project"

2. **Edit a Project**:
   - Hover over a project card
   - Click the edit (pencil) icon
   - Modify the project name or color
   - Click "Save Project"

3. **Delete a Project**:
   - Hover over a project card
   - Click the delete (trash) icon
   - Confirm deletion when prompted

### Managing Tasks

1. **Create a Task**:
   - Click the "New Task" button in the header
   - Enter task details (name, priority, estimated time, etc.)
   - Select the project it belongs to
   - Click "Create Task"

2. **Edit a Task**:
   - Hover over a task
   - Click the edit (pencil) icon
   - Update the task information
   - Click "Save Task"

3. **Complete a Task**:
   - Click the checkbox next to a task to mark it as complete
   - The project progress will automatically update

4. **Delete a Task**:
   - Hover over a task
   - Click the delete (trash) icon
   - Confirm deletion when prompted

### Using the Timer

1. Navigate to the Timer section using the sidebar
2. Set your work and break durations
3. Click "Start" to begin your focus session
4. The timer will notify you when to take breaks and when to resume work

## Troubleshooting

### Common Issues

**Application Won't Start**:
- Ensure you're in the correct directory (`next-productivity-dashboard`)
- Try running as administrator if you encounter permission errors
- Check if Electron is properly installed with `npx electron -v`

**Changes Not Saving**:
- Make sure your browser supports localStorage
- Check if you have sufficient disk space
- Try clearing the application cache

**Display Issues**:
- Make sure you're using the latest version of the application
- Try refreshing the page or restarting the application
- Check if your display settings are affecting the interface

## Development

### Project Structure
```
next-productivity-dashboard/
├── out/                # HTML/CSS/JS output files
│   ├── index.html      # Main dashboard
│   ├── projects-tasks.html  # Projects & Tasks management
│   ├── timer.html      # Pomodoro timer
│   └── ...
├── src/                # Source files
├── main.js             # Electron main process
├── package.json        # Project dependencies and scripts
└── README.md           # This documentation
```

### Technologies Used
- Electron
- HTML5/CSS3/JavaScript
- localStorage for data persistence
- Material Icons
- Inter font family

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Thanks to all contributors who have helped improve Tempus
- Inspired by productivity methodologies like GTD and Pomodoro
- Built with modern web technologies for optimal performance

---

Made with ❤️ by Conor G.
