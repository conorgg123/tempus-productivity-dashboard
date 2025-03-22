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