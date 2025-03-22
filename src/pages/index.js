import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import styles from '@/styles/Dashboard.module.css';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [currentDate, setCurrentDate] = useState('');
  
  useEffect(() => {
    // Set current date in a readable format
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(now.toLocaleDateString('en-US', options));
    
    // Load dashboard data from localStorage or initialize with default data
    const storedData = localStorage.getItem('dashboard-data');
    
    if (storedData) {
      setDashboardData(JSON.parse(storedData));
    } else {
      // Default data similar to what was in main.js
      const defaultData = {
        date: new Date().toISOString().split('T')[0],
        totalWorked: {
          hours: 6,
          minutes: 18
        },
        percentOfDay: 79,
        taskBreakdown: {
          focus: 62,
          meetings: 15,
          breaks: 11,
          other: 12
        },
        projects: [
          { id: 1, name: "Finwall app", percent: 49, time: "3 hr 26 min", tasks: [
            { id: 101, name: "DS12 - Dark version", time: "1 hr 51 min", completed: false },
            { id: 102, name: "DS42 - Settings section", time: "55 min", completed: true },
            { id: 103, name: "System update", time: "40 min", completed: false }
          ]},
          { id: 2, name: "Finwall website", percent: 32, time: "1 hr 47 min", tasks: [] },
          { id: 3, name: "X Terminal", percent: 14, time: "46 min", tasks: [] },
          { id: 4, name: "Li.Fi", percent: 5, time: "19 min", tasks: [] }
        ],
        apps: [
          { id: 1, name: "Figma", percent: 47, time: "2 hr 58 min" },
          { id: 2, name: "Adobe Photoshop", percent: 12, time: "46 min" },
          { id: 3, name: "zoom.us", percent: 12, time: "45 min" },
          { id: 4, name: "Slack", percent: 7, time: "26 min" },
          { id: 5, name: "pinterest.com", percent: 6, time: "23 min" },
          { id: 6, name: "HEY", percent: 3, time: "11 min" },
          { id: 7, name: "nicelydone.com", percent: 3, time: "11 min" },
          { id: 8, name: "twitter.com", percent: 2, time: "8 min" },
          { id: 9, name: "crunchbase.com", percent: 2, time: "7 min" },
          { id: 10, name: "instagram.com", percent: 1, time: "4 min" },
          { id: 11, name: "Other", percent: 5, time: "19 min" }
        ]
      };
      
      setDashboardData(defaultData);
      localStorage.setItem('dashboard-data', JSON.stringify(defaultData));
    }
  }, []);
  
  if (!dashboardData) {
    return <div className={styles.loading}>Loading dashboard...</div>;
  }

  return (
    <>
      <Head>
        <title>tempus.</title>
        <meta name="description" content="Productivity Dashboard" />
        <link rel="icon" href="/favicon.ico" />
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
              <Link href="/" className={styles.active}>
                <span className={styles.navIcon}>📊</span> Dashboard
              </Link>
            </li>
            <li>
              <Link href="/youtube-manager">
                <span className={styles.navIcon}>🎬</span> YouTube Manager
              </Link>
            </li>
            <li>
              <Link href="/calendar">
                <span className={styles.navIcon}>📅</span> Calendar
              </Link>
            </li>
            <li>
              <Link href="/tasks">
                <span className={styles.navIcon}>✓</span> Tasks
              </Link>
            </li>
            <li>
              <Link href="/timer">
                <span className={styles.navIcon}>⏱️</span> Timer
              </Link>
            </li>
            <li>
              <Link href="/settings">
                <span className={styles.navIcon}>⚙️</span> Settings
              </Link>
            </li>
            <li>
              <Link href="/help">
                <span className={styles.navIcon}>❓</span> Help
              </Link>
            </li>
          </ul>
          
          <div className={styles.sidebarFooter}>
            {/* Footer content if needed */}
          </div>
        </div>
        
        <div className={styles.mainContent}>
          <div className={styles.header}>
            <div className={styles.headerDate}>
              {currentDate}
            </div>
            <div className={styles.headerTracking}>
              <span className={styles.trackingDot}></span>
              Currently tracking your activity
            </div>
            <div className={styles.headerControls}>
              {/* Controls if needed */}
            </div>
          </div>
          
          <div className={styles.dashboardSummary}>
            <div className={styles.summaryItem}>
              <div className={styles.summaryHeader}>Today's Summary</div>
              <div className={styles.summaryContent}>
                <div className={styles.summaryStat}>
                  <div className={styles.summaryStatIcon}>⏱️</div>
                  <div>You've worked <span className={styles.highlight}>{dashboardData.totalWorked.hours} hr {dashboardData.totalWorked.minutes} min</span> today</div>
                </div>
                <div className={styles.summaryStat}>
                  <div className={styles.summaryStatIcon}>📈</div>
                  <div>That's <span className={styles.highlight}>{dashboardData.percentOfDay}%</span> of your day</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Projects section */}
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Projects</h2>
            <div className={styles.listContainer}>
              <div className={styles.listHeader}>
                <div className={styles.listTitle}>Project activity</div>
              </div>
              
              {dashboardData.projects.map(project => (
                <div key={project.id} className={styles.listItem}>
                  <div className={styles.projectInfo}>
                    <div className={styles.projectName}>{project.name}</div>
                    <div className={styles.projectTime}>{project.time}</div>
                  </div>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressBarValue} 
                      style={{ width: `${project.percent}%` }}
                    ></div>
                  </div>
                  <div className={styles.projectPercent}>{project.percent}%</div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Apps section */}
          <div className={styles.dashboardSection}>
            <h2 className={styles.sectionTitle}>Applications</h2>
            <div className={styles.listContainer}>
              <div className={styles.listHeader}>
                <div className={styles.listTitle}>Application usage</div>
              </div>
              
              {dashboardData.apps.slice(0, 5).map(app => (
                <div key={app.id} className={styles.listItem}>
                  <div className={styles.appInfo}>
                    <div className={styles.appName}>{app.name}</div>
                    <div className={styles.appTime}>{app.time}</div>
                  </div>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressBarValue} 
                      style={{ width: `${app.percent}%` }}
                    ></div>
                  </div>
                  <div className={styles.appPercent}>{app.percent}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
