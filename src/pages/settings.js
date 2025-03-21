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

// Utils
import { getItem, setItem, clearAll } from '../utils/localStorage';

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resetAlert, setResetAlert] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = getItem('app-settings', {});
    if (savedSettings.darkMode !== undefined) {
      setDarkMode(savedSettings.darkMode);
    }
  }, []);

  const handleDarkModeToggle = (event) => {
    const isDarkMode = event.target.checked;
    setDarkMode(isDarkMode);
    
    // Save to localStorage
    const currentSettings = getItem('app-settings', {});
    const newSettings = { ...currentSettings, darkMode: isDarkMode };
    
    setItem('app-settings', newSettings);
    
    // Show success message
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
    }, 3000);
  };

  const handleResetData = () => {
    clearAll();
    setResetAlert(true);
    setTimeout(() => {
      setResetAlert(false);
    }, 3000);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Customize your experience
        </Typography>
      </Box>

      {saveSuccess && (
        <Alert severity="success" sx={{ mb: 4 }}>
          Settings saved successfully
        </Alert>
      )}

      {resetAlert && (
        <Alert severity="info" sx={{ mb: 4 }}>
          All data has been reset. Refresh the page to see the changes.
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DarkModeIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6">Appearance</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={handleDarkModeToggle}
                    name="dark-mode"
                    color="primary"
                  />
                }
                label="Dark Mode"
              />
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Toggle between light and dark themes
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <DeleteForeverIcon sx={{ mr: 1, color: 'error.main' }} />
                <Typography variant="h6">Data Management</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" sx={{ mb: 2 }}>
                Warning: This will permanently delete all your data, including tasks, reminders, and settings.
              </Typography>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteForeverIcon />}
                onClick={handleResetData}
              >
                Reset All Data
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
} 