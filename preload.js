const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'api', {
    send: (channel, data) => {
      // whitelist channels
      const validChannels = ['reload-app', 'save-settings'];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    receive: (channel, func) => {
      const validChannels = ['app-ready', 'settings-saved'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender` 
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    }
  }
);

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  console.log('Preload script loaded');
  
  // Add global polyfill to fix "global is not defined" errors
  if (typeof global === 'undefined') {
    window.global = window;
  }
  
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