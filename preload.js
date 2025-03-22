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