/**
 * Utility functions for localStorage operations
 */

/**
 * Get item from localStorage with error handling
 * @param {string} key - The localStorage key
 * @param {any} defaultValue - Default value if key doesn't exist or on error
 * @returns {any} - The stored value or default value
 */
export const getItem = (key, defaultValue) => {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage`, error);
    return defaultValue;
  }
};

/**
 * Set item in localStorage with error handling
 * @param {string} key - The localStorage key
 * @param {any} value - Value to store (will be JSON stringified)
 * @returns {boolean} - Success status
 */
export const setItem = (key, value) => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error setting item ${key} in localStorage`, error);
    return false;
  }
};

/**
 * Remove item from localStorage with error handling
 * @param {string} key - The localStorage key to remove
 * @returns {boolean} - Success status
 */
export const removeItem = (key) => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing item ${key} from localStorage`, error);
    return false;
  }
};

/**
 * Clear all items from localStorage with error handling
 * @returns {boolean} - Success status
 */
export const clearAll = () => {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    window.localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage', error);
    return false;
  }
}; 