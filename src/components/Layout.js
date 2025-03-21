import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, AppBar, Toolbar, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Head from 'next/head';

// Components
import NavigationDrawer from './NavigationDrawer';
import createAppTheme from './ThemeConfig';

// Utils
import { getItem } from '../utils/localStorage';

const drawerWidth = 240;

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Load settings from localStorage
    const savedSettings = getItem('app-settings', {});
    if (savedSettings.darkMode !== undefined) {
      setDarkMode(savedSettings.darkMode);
    }
    
    // Listen for storage events to update theme if changed in another tab
    const handleStorageChange = (e) => {
      if (e.key === 'app-settings') {
        try {
          const newSettings = JSON.parse(e.newValue);
          if (newSettings && newSettings.darkMode !== undefined) {
            setDarkMode(newSettings.darkMode);
          }
        } catch (error) {
          console.error('Error parsing settings from localStorage', error);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Only render on client side to avoid hydration issues
  if (!mounted) {
    return null;
  }

  // Create a theme instance based on dark mode preference
  const theme = createAppTheme(darkMode);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Head>
        <title>Productivity Dashboard</title>
        <meta name="description" content="A comprehensive productivity management tool" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Box sx={{ display: 'flex' }}>
        {/* App Bar */}
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            bgcolor: 'background.paper',
            color: 'text.primary',
            boxShadow: 'none',
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { sm: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Navigation Drawer */}
        <NavigationDrawer 
          mobileOpen={mobileOpen}
          handleDrawerToggle={handleDrawerToggle}
          drawerWidth={drawerWidth}
        />

        {/* Main Content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 0,
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            minHeight: '100vh',
            bgcolor: 'background.default',
          }}
        >
          <Toolbar /> {/* Spacer for AppBar */}
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default Layout; 