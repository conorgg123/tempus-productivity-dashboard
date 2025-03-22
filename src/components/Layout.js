import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from './Layout.module.css';
import { loadData, saveData, isElectron } from '@/utils/storage';

export default function Layout({ children }) {
  const router = useRouter();
  const [activePage, setActivePage] = useState('');
  const [theme, setTheme] = useState('light');
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Set active page based on current route
    const path = router.pathname;
    const page = path === '/' ? 'dashboard' : path.substring(1);
    setActivePage(page);
    
    // Load theme preference from storage
    async function loadThemePreference() {
      const settings = await loadData('user-settings', { theme: 'light' });
      
      if (settings.theme === 'system') {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
      } else {
        setTheme(settings.theme);
      }
    }
    
    loadThemePreference();
  }, [router.pathname]);
  
  // Apply theme change to document
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }, [theme]);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const isActive = (page) => {
    return activePage === page;
  };
  
  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    // Save theme preference
    const settings = await loadData('user-settings', { theme: 'light' });
    settings.theme = newTheme;
    saveData('user-settings', settings);
  };

  return (
    <div className={styles.layout}>
      <aside className={`${styles.sidebar} ${menuOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>Tempus</div>
          <button className={styles.closeMenuBtn} onClick={toggleMenu}>
            <span className="material-icons">close</span>
          </button>
        </div>
        
        <nav className={styles.nav}>
          <Link href="/">
            <a className={`${styles.navLink} ${isActive('dashboard') ? styles.active : ''}`}>
              <span className="material-icons">dashboard</span>
              <span>Dashboard</span>
            </a>
          </Link>
          
          <div className={styles.navSection}>
            <div className={styles.navSectionTitle}>Productivity</div>
            
            <Link href="/calendar">
              <a className={`${styles.navLink} ${isActive('calendar') ? styles.active : ''}`}>
                <span className="material-icons">calendar_month</span>
                <span>Calendar</span>
              </a>
            </Link>
            
            <Link href="/daily-focus">
              <a className={`${styles.navLink} ${isActive('daily-focus') ? styles.active : ''}`}>
                <span className="material-icons">timer</span>
                <span>Daily Focus</span>
              </a>
            </Link>
            
            <Link href="/todo-list">
              <a className={`${styles.navLink} ${isActive('todo-list') ? styles.active : ''}`}>
                <span className="material-icons">checklist</span>
                <span>Todo List</span>
              </a>
            </Link>
          </div>
          
          <div className={styles.navSection}>
            <div className={styles.navSectionTitle}>Resources</div>
            
            <Link href="/youtube-manager">
              <a className={`${styles.navLink} ${isActive('youtube-manager') ? styles.active : ''}`}>
                <span className="material-icons">video_library</span>
                <span>YouTube Manager</span>
              </a>
            </Link>
          </div>
          
          <div className={styles.navDivider}></div>
          
          <Link href="/settings">
            <a className={`${styles.navLink} ${isActive('settings') ? styles.active : ''}`}>
              <span className="material-icons">settings</span>
              <span>Settings</span>
            </a>
          </Link>
        </nav>
        
        {isElectron() && (
          <div className={styles.sidebarFooter}>
            <div className={styles.versionInfo}>
              Tempus Productivity v1.0.0
            </div>
          </div>
        )}
      </aside>
      
      <main className={styles.main}>
        <header className={styles.header}>
          <button className={styles.menuBtn} onClick={toggleMenu}>
            <span className="material-icons">menu</span>
          </button>
          
          <div className={styles.headerControls}>
            <button className={styles.themeToggle} onClick={toggleTheme}>
              <span className="material-icons">
                {theme === 'light' ? 'dark_mode' : 'light_mode'}
              </span>
            </button>
          </div>
        </header>
        
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
} 