import '@/styles/globals.css';
import Head from 'next/head';
import { useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Add global polyfill at the top level
if (typeof window !== 'undefined' && typeof global === 'undefined') {
  window.global = window;
}

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Handle localStorage for Electron environment (client-side only)
    if (typeof window !== 'undefined') {
      // Initialize localStorage with default data if needed
      const initializeLocalStorage = (key, defaultData) => {
        if (!localStorage.getItem(key)) {
          localStorage.setItem(key, JSON.stringify(defaultData));
        }
      };

      // Initialize any required localStorage items
      initializeLocalStorage('dashboard-data', {
        date: new Date().toISOString().split('T')[0],
        totalWorked: { hours: 0, minutes: 0 },
        percentOfDay: 0,
        taskBreakdown: [
          { name: "Coding", time: "0h 0m", percent: 0 },
          { name: "Meetings", time: "0h 0m", percent: 0 },
          { name: "Learning", time: "0h 0m", percent: 0 },
          { name: "Admin", time: "0h 0m", percent: 0 }
        ],
        projects: [],
        apps: []
      });
    }
  }, []);

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
} 