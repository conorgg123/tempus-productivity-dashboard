import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  Switch,
  FormControlLabel,
  Card,
  CardContent,
  Grid,
  Divider,
  Button,
  Alert
} from '@mui/material';
import {
  DarkMode as DarkModeIcon,
  Settings as SettingsIcon,
  DeleteForever as DeleteForeverIcon
} from '@mui/icons-material';
import Head from 'next/head';
import Layout from '@/components/Layout';
import styles from '@/styles/Settings.module.css';
import { loadData, saveData, isElectron } from '@/utils/storage';

// Utils
import { getItem, setItem, clearAll } from '../utils/localStorage';

export default function Settings() {
  const [settings, setSettings] = useState({
    theme: 'light',
    notificationEnabled: true,
    autoStartTracking: true,
    workHoursStart: '09:00',
    workHoursEnd: '17:00',
    breakReminders: true,
    breakFrequency: 60, // minutes
    language: 'en',
    dataExportFormat: 'json'
  });

  const [exportPath, setExportPath] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    async function loadSettings() {
      const data = await loadData('user-settings', {
        theme: 'light',
        notificationEnabled: true,
        autoStartTracking: true,
        workHoursStart: '09:00',
        workHoursEnd: '17:00',
        breakReminders: true,
        breakFrequency: 60, // minutes
        language: 'en',
        dataExportFormat: 'json'
      });
      
      setSettings(data);
    }
    
    loadSettings();
  }, []);

  const handleSettingsChange = (setting, value) => {
    const updatedSettings = {
      ...settings,
      [setting]: value
    };
    
    setSettings(updatedSettings);
    saveData('user-settings', updatedSettings);
  };

  const handleExportData = async () => {
    if (!isElectron()) {
      alert('Data export is only available in the desktop app');
      return;
    }

    setIsExporting(true);
    
    try {
      // In Electron, we would use IPC to trigger a file save dialog
      window.electron.saveToFile('all-data.json', JSON.stringify({
        settings: await loadData('user-settings'),
        dashboard: await loadData('dashboard-data'),
        youtube: {
          links: (await loadData('youtube-links')).links || [],
          categories: (await loadData('youtube-categories')).categories || []
        }
      }));
      
      setExportPath('all-data.json');
      alert('Data exported successfully!');
    } catch (error) {
      console.error('Error exporting data:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImportData = async () => {
    if (!isElectron()) {
      alert('Data import is only available in the desktop app');
      return;
    }

    try {
      const data = await window.electron.loadFromFile();
      
      if (data) {
        // Import all the data
        if (data.settings) {
          saveData('user-settings', data.settings);
          setSettings(data.settings);
        }
        
        if (data.dashboard) {
          saveData('dashboard-data', data.dashboard);
        }
        
        if (data.youtube) {
          if (data.youtube.links) {
            saveData('youtube-links', { links: data.youtube.links });
          }
          
          if (data.youtube.categories) {
            saveData('youtube-categories', { categories: data.youtube.categories });
          }
        }
        
        alert('Data imported successfully!');
      }
    } catch (error) {
      console.error('Error importing data:', error);
      alert('Failed to import data. Please try again.');
    }
  };

  return (
    <Layout>
      <Head>
        <title>Settings - Tempus Dashboard</title>
      </Head>
      
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h2>Settings</h2>
          <p>Configure your dashboard preferences</p>
        </div>
      </div>
      
      <div className={styles.settingsContainer}>
        <div className={styles.settingsSection}>
          <h3>Appearance</h3>
          
          <div className={styles.settingItem}>
            <label htmlFor="theme">Theme</label>
            <select 
              id="theme" 
              className={styles.select}
              value={settings.theme}
              onChange={(e) => handleSettingsChange('theme', e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>
          
          <div className={styles.settingItem}>
            <label htmlFor="language">Language</label>
            <select 
              id="language" 
              className={styles.select}
              value={settings.language}
              onChange={(e) => handleSettingsChange('language', e.target.value)}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
              <option value="zh">Chinese</option>
            </select>
          </div>
        </div>
        
        <div className={styles.settingsSection}>
          <h3>Work Hours</h3>
          
          <div className={styles.settingItem}>
            <label htmlFor="workHoursStart">Start Time</label>
            <input 
              type="time" 
              id="workHoursStart" 
              className={styles.timeInput}
              value={settings.workHoursStart}
              onChange={(e) => handleSettingsChange('workHoursStart', e.target.value)}
            />
          </div>
          
          <div className={styles.settingItem}>
            <label htmlFor="workHoursEnd">End Time</label>
            <input 
              type="time" 
              id="workHoursEnd" 
              className={styles.timeInput}
              value={settings.workHoursEnd}
              onChange={(e) => handleSettingsChange('workHoursEnd', e.target.value)}
            />
          </div>
        </div>
        
        <div className={styles.settingsSection}>
          <h3>Notifications</h3>
          
          <div className={styles.settingItem}>
            <label htmlFor="notificationEnabled">Enable Notifications</label>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                id="notificationEnabled"
                checked={settings.notificationEnabled}
                onChange={(e) => handleSettingsChange('notificationEnabled', e.target.checked)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
          
          <div className={styles.settingItem}>
            <label htmlFor="breakReminders">Break Reminders</label>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                id="breakReminders"
                checked={settings.breakReminders}
                onChange={(e) => handleSettingsChange('breakReminders', e.target.checked)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
          
          {settings.breakReminders && (
            <div className={styles.settingItem}>
              <label htmlFor="breakFrequency">Break Frequency (minutes)</label>
              <input 
                type="number" 
                id="breakFrequency" 
                className={styles.numberInput}
                min="15"
                max="120"
                step="15"
                value={settings.breakFrequency}
                onChange={(e) => handleSettingsChange('breakFrequency', parseInt(e.target.value))}
              />
            </div>
          )}
        </div>
        
        <div className={styles.settingsSection}>
          <h3>Tracking</h3>
          
          <div className={styles.settingItem}>
            <label htmlFor="autoStartTracking">Auto-start Tracking</label>
            <label className={styles.switch}>
              <input 
                type="checkbox" 
                id="autoStartTracking"
                checked={settings.autoStartTracking}
                onChange={(e) => handleSettingsChange('autoStartTracking', e.target.checked)}
              />
              <span className={styles.slider}></span>
            </label>
          </div>
        </div>
        
        <div className={styles.settingsSection}>
          <h3>Data Management</h3>
          
          <div className={styles.settingItem}>
            <label htmlFor="dataExportFormat">Export Format</label>
            <select 
              id="dataExportFormat" 
              className={styles.select}
              value={settings.dataExportFormat}
              onChange={(e) => handleSettingsChange('dataExportFormat', e.target.value)}
            >
              <option value="json">JSON</option>
              <option value="csv">CSV</option>
            </select>
          </div>
          
          <div className={styles.buttonGroup}>
            <button 
              className={styles.actionBtn}
              onClick={handleExportData}
              disabled={isExporting}
            >
              {isExporting ? 'Exporting...' : 'Export Data'}
            </button>
            
            <button 
              className={styles.actionBtn}
              onClick={handleImportData}
            >
              Import Data
            </button>
          </div>
          
          {exportPath && (
            <div className={styles.successMessage}>
              Data exported to: {exportPath}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
} 