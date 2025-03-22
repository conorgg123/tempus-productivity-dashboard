import '@/styles/globals.css';
import Head from 'next/head';
import { useEffect } from 'react';

// Add global polyfill at the top level
if (typeof window !== 'undefined' && typeof global === 'undefined') {
  window.global = window;
}

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
        taskBreakdown: { focus: 0, meetings: 0, breaks: 0, other: 0 },
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
      <Component {...pageProps} />
    </>
  );
} 