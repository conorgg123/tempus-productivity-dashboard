import React, { useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box, AppBar, Toolbar, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '@/styles/Layout.module.css';

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
  const router = useRouter();

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
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <div className={styles.sidebarLogo}>
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="8" fill="#7646F4"/>
              <path d="M12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20C28 24.4183 24.4183 28 20 28" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M20 28C20 28 16 28 14 26" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="20" cy="20" r="2" fill="white"/>
            </svg>
            <h1>tempus.</h1>
          </div>
          
          <ul className={styles.sidebarNav}>
            <li>
              <Link href="/" className={router.pathname === '/' ? styles.active : ''}>
                <span className={styles.navIcon}>📊</span> Dashboard
              </Link>
            </li>
            <li>
              <Link href="/youtube-manager" className={router.pathname === '/youtube-manager' ? styles.active : ''}>
                <span className={styles.navIcon}>🎬</span> YouTube Manager
              </Link>
            </li>
            <li>
              <Link href="/calendar" className={router.pathname === '/calendar' ? styles.active : ''}>
                <span className={styles.navIcon}>📅</span> Calendar
              </Link>
            </li>
            <li>
              <Link href="/tasks" className={router.pathname === '/tasks' ? styles.active : ''}>
                <span className={styles.navIcon}>✓</span> Tasks
              </Link>
            </li>
            <li>
              <Link href="/timer" className={router.pathname === '/timer' ? styles.active : ''}>
                <span className={styles.navIcon}>⏱️</span> Timer
              </Link>
            </li>
            <li>
              <Link href="/settings" className={router.pathname === '/settings' ? styles.active : ''}>
                <span className={styles.navIcon}>⚙️</span> Settings
              </Link>
            </li>
            <li>
              <Link href="/help" className={router.pathname === '/help' ? styles.active : ''}>
                <span className={styles.navIcon}>❓</span> Help
              </Link>
            </li>
          </ul>
          
          <div className={styles.sidebarFooter}>
            {/* Footer content if needed */}
          </div>
        </div>
        
        <div className={styles.mainContent}>
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
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Layout; 