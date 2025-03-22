// Check if running in Electron
export const isElectron = () => {
  return typeof window !== 'undefined' && window.electron !== undefined;
};

// Load data from storage
export const loadData = async (key, defaultValue = null) => {
  if (typeof window === 'undefined') {
    return defaultValue;
  }

  try {
    // Try localStorage first
    const localData = localStorage.getItem(key);
    if (localData) {
      return JSON.parse(localData);
    }

    // If running in Electron, try to load from file
    if (isElectron()) {
      const fileData = await window.electron.loadFromFile(`${key}.json`);
      if (fileData) {
        // Save to localStorage for future quick access
        localStorage.setItem(key, JSON.stringify(fileData));
        return fileData;
      }
    }
    
    return defaultValue;
  } catch (error) {
    console.error(`Error loading data for key ${key}:`, error);
    return defaultValue;
  }
};

// Save data to storage
export const saveData = (key, data) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    // Always save to localStorage for immediate access
    localStorage.setItem(key, JSON.stringify(data));
    
    // If running in Electron, also save to file for persistence
    if (isElectron()) {
      window.electron.saveToFile(`${key}.json`, data);
    }
  } catch (error) {
    console.error(`Error saving data for key ${key}:`, error);
  }
};

// Get item from storage with a default value
export const getItem = (key, defaultValue = null) => {
  if (typeof window === 'undefined') {
    return defaultValue;
  }

  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error getting item for key ${key}:`, error);
    return defaultValue;
  }
};

// Set item in storage
export const setItem = (key, value) => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.setItem(key, JSON.stringify(value));
    
    // If running in Electron, also save to file for persistence
    if (isElectron()) {
      window.electron.saveToFile(`${key}.json`, value);
    }
  } catch (error) {
    console.error(`Error setting item for key ${key}:`, error);
  }
}; 