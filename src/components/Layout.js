import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '@/styles/Layout.module.css';

export default function Layout({ children }) {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  return (
    <div className={styles.container}>
      <Head>
        <title>Tempus Dashboard</title>
        <meta name="description" content="A comprehensive productivity management tool" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className={`${styles.sidebar} ${mobileMenuOpen ? styles.open : ''}`}>
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
        <div className={styles.mobileHeader}>
          <button 
            className={styles.menuToggle}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            ☰
          </button>
        </div>
        {children}
      </div>
    </div>
  );
} 