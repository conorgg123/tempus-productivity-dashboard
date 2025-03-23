const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  "api", {
    send: (channel, data) => {
      // whitelist channels
      let validChannels = ["toMain"];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    receive: (channel, func) => {
      let validChannels = ["fromMain"];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender` 
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    // Expose any other methods or properties you need
    platform: process.platform,
    saveToFile: (filename, data) => {
      ipcRenderer.send('save-to-file', { filename, data });
    },
    loadFromFile: (filename) => {
      return new Promise((resolve) => {
        ipcRenderer.once('load-file-reply', (event, data) => {
          resolve(data);
        });
        ipcRenderer.send('load-from-file', filename);
      });
    },
    getPersonalData: () => {
      // Access the shared data from the main process
      if (global.sharedData && global.sharedData.initialData) {
        return global.sharedData.initialData;
      }
      return null;
    },
    getBasePath: () => {
      // Access the base path for static assets
      if (global.sharedData && global.sharedData.basePath) {
        return global.sharedData.basePath;
      }
      return null;
    },
    // Add YouTube manager API methods
    saveYouTubeLink: (link) => {
      return new Promise((resolve) => {
        ipcRenderer.once('youtube-link-saved', (event, result) => {
          resolve(result);
        });
        ipcRenderer.send('save-youtube-link', link);
      });
    },
    getYouTubeLinks: () => {
      return new Promise((resolve) => {
        ipcRenderer.once('youtube-links', (event, links) => {
          resolve(links);
        });
        ipcRenderer.send('get-youtube-links');
      });
    },
    deleteYouTubeLink: (linkId) => {
      return new Promise((resolve) => {
        ipcRenderer.once('youtube-link-deleted', (event, result) => {
          resolve(result);
        });
        ipcRenderer.send('delete-youtube-link', linkId);
      });
    },
    getYouTubeCategories: () => {
      return new Promise((resolve) => {
        ipcRenderer.once('youtube-categories', (event, categories) => {
          resolve(categories);
        });
        ipcRenderer.send('get-youtube-categories');
      });
    },
    saveYouTubeCategory: (category) => {
      return new Promise((resolve) => {
        ipcRenderer.once('youtube-category-saved', (event, result) => {
          resolve(result);
        });
        ipcRenderer.send('save-youtube-category', category);
      });
    },
    // Calendar API methods
    getCalendarEvents: () => {
      return new Promise((resolve) => {
        ipcRenderer.once('calendar-events', (event, events) => {
          resolve(events);
        });
        ipcRenderer.send('get-calendar-events');
      });
    },
    saveCalendarEvents: (events) => {
      return new Promise((resolve) => {
        ipcRenderer.once('calendar-events-saved', (event, result) => {
          resolve(result);
        });
        ipcRenderer.send('save-calendar-events', events);
      });
    },
    addCalendarEvent: (event) => {
      return new Promise((resolve) => {
        ipcRenderer.once('calendar-event-added', (event, result) => {
          resolve(result);
        });
        ipcRenderer.send('add-calendar-event', event);
      });
    },
    updateCalendarEvent: (eventId, eventData) => {
      return new Promise((resolve) => {
        ipcRenderer.once('calendar-event-updated', (event, result) => {
          resolve(result);
        });
        ipcRenderer.send('update-calendar-event', { id: eventId, data: eventData });
      });
    },
    deleteCalendarEvent: (eventId) => {
      return new Promise((resolve) => {
        ipcRenderer.once('calendar-event-deleted', (event, result) => {
          resolve(result);
        });
        ipcRenderer.send('delete-calendar-event', eventId);
      });
    },
    // Settings API methods
    getSettings: () => {
      return new Promise((resolve) => {
        ipcRenderer.once('settings', (event, settings) => {
          resolve(settings);
        });
        ipcRenderer.send('get-settings');
      });
    },
    saveSettings: (settings) => {
      return new Promise((resolve) => {
        ipcRenderer.once('settings-saved', (event, result) => {
          resolve(result);
        });
        ipcRenderer.send('save-settings', settings);
      });
    }
  }
);

// Define global for renderer process
if (typeof global === 'undefined') {
  window.global = window;
}

// Expose APIs from Node to the renderer process
window.addEventListener('DOMContentLoaded', () => {
  // Ensure global is available
  if (typeof global === 'undefined') {
    window.global = window;
  }
  
  console.log('Preload script loaded');
  
  // Add process.env for React and other libraries
  if (!window.process) {
    window.process = { env: { NODE_ENV: process.env.NODE_ENV } };
  }
  
  // Example: Add version info to the UI if needed
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };
  
  for (const dependency of ['chrome', 'node', 'electron']) {
    try {
      replaceText(`${dependency}-version`, process.versions[dependency]);
    } catch (e) {
      console.error(`Unable to set ${dependency} version: ${e}`);
    }
  }
});

// Add additional debugging
console.log('Preload script executing');

// Log errors more verbosely
window.addEventListener('error', (event) => {
  console.error('Uncaught error:', event.error);
  console.error('Error details:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

// Log uncaught promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Expose platform info to renderer
contextBridge.exposeInMainWorld('platform', {
  isElectron: true,
  isDev: process.env.NODE_ENV === 'development',
  version: process.versions.electron
});

// Display ready message when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded');
  
  // Add visible error reporter to the page
  const errorReporter = document.createElement('div');
  errorReporter.id = 'electron-error-reporter';
  errorReporter.style.cssText = `
    display: none;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(255, 0, 0, 0.8);
    color: white;
    padding: 10px;
    font-family: monospace;
    z-index: 9999;
    max-height: 150px;
    overflow: auto;
  `;
  document.body.appendChild(errorReporter);
  
  // Override console.error to also display in the error reporter
  const originalConsoleError = console.error;
  console.error = function() {
    originalConsoleError.apply(console, arguments);
    
    const errorMsg = Array.from(arguments).join(' ');
    errorReporter.style.display = 'block';
    errorReporter.innerHTML += `<div>${new Date().toISOString()} - ERROR: ${errorMsg}</div>`;
  };
}); 