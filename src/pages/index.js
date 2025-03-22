import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import styles from '@/styles/Dashboard.module.css';
import { loadData, saveData } from '@/utils/storage';

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    date: new Date().toLocaleDateString(),
    totalWorked: "0h 0m",
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
  
  const [selectedTask, setSelectedTask] = useState(null);
  const [newTaskName, setNewTaskName] = useState("");
  const [newTaskTime, setNewTaskTime] = useState("");
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [activeView, setActiveView] = useState('day');
  const [isTracking, setIsTracking] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      const data = await loadData('dashboard-data', {
        date: new Date().toLocaleDateString(),
        totalWorked: "0h 0m",
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

      // Convert totalWorked to string format if it's an object
      if (typeof data.totalWorked === 'object' && data.totalWorked !== null) {
        const { hours, minutes } = data.totalWorked;
        data.totalWorked = `${hours}h ${minutes}m`;
      }
      
      setDashboardData(data);
    }
    
    loadDashboardData();
  }, []);

  // Add a new task to the task breakdown
  const handleAddTask = (e) => {
    e.preventDefault();
    
    if (!newTaskName || !newTaskTime) {
      alert("Please fill out all fields");
      return;
    }
    
    const [hours, minutes] = newTaskTime.split(':').map(num => parseInt(num));
    const totalTimeMinutes = (hours * 60) + minutes;
    const formattedTime = `${hours}h ${minutes}m`;
    
    // Calculate percent (assuming 8-hour workday = 480 minutes)
    const percent = Math.round((totalTimeMinutes / 480) * 100);
    
    const newTask = {
      name: newTaskName,
      time: formattedTime,
      percent: percent
    };
    
    const updatedTaskBreakdown = [...dashboardData.taskBreakdown, newTask];
    const updatedData = {
      ...dashboardData,
      taskBreakdown: updatedTaskBreakdown
    };
    
    // Recalculate total worked time
    const totalMinutesWorked = updatedTaskBreakdown.reduce((total, task) => {
      const [h, m] = task.time.split('h ');
      const hours = parseInt(h);
      const minutes = parseInt(m);
      return total + (hours * 60) + minutes;
    }, 0);
    
    const totalHours = Math.floor(totalMinutesWorked / 60);
    const remainingMinutes = totalMinutesWorked % 60;
    
    updatedData.totalWorked = `${totalHours}h ${remainingMinutes}m`;
    updatedData.percentOfDay = Math.min(Math.round((totalMinutesWorked / 480) * 100), 100);
    
    setDashboardData(updatedData);
    saveData('dashboard-data', updatedData);
    
    // Reset form
    setNewTaskName("");
    setNewTaskTime("");
    setShowAddTaskModal(false);
  };
  
  // Delete a task
  const handleDeleteTask = (index) => {
    if (!confirm("Are you sure you want to delete this task?")) {
      return;
    }
    
    const updatedTaskBreakdown = [...dashboardData.taskBreakdown];
    updatedTaskBreakdown.splice(index, 1);
    
    const updatedData = {
      ...dashboardData,
      taskBreakdown: updatedTaskBreakdown
    };
    
    // Recalculate total worked time
    const totalMinutesWorked = updatedTaskBreakdown.reduce((total, task) => {
      const [h, m] = task.time.split('h ');
      const hours = parseInt(h);
      const minutes = parseInt(m);
      return total + (hours * 60) + minutes;
    }, 0);
    
    const totalHours = Math.floor(totalMinutesWorked / 60);
    const remainingMinutes = totalMinutesWorked % 60;
    
    updatedData.totalWorked = `${totalHours}h ${remainingMinutes}m`;
    updatedData.percentOfDay = Math.min(Math.round((totalMinutesWorked / 480) * 100), 100);
    
    setDashboardData(updatedData);
    saveData('dashboard-data', updatedData);
  };

  // Format the dashboard data for display
  const formatPercent = (percent) => {
    return `${percent}%`;
  };

  // Get the current time in hours:minutes format
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  // Function to toggle tracking status
  const toggleTracking = () => {
    setIsTracking(!isTracking);
  }

  return (
    <Layout>
      <Head>
        <title>Dashboard - Tempus Productivity</title>
      </Head>
      
      <div className={styles.dashboardContainer}>
        <div className={styles.dashboardHeader}>
          <div className={styles.headerTitle}>
            <h2>Your Productivity Dashboard</h2>
            <p>Today's overview: {dashboardData.date}</p>
          </div>
          <div className={styles.headerActions}>
            <div className={styles.viewToggle}>
              <button 
                className={`${styles.viewBtn} ${activeView === 'day' ? styles.active : ''}`}
                onClick={() => setActiveView('day')}
              >
                Day
              </button>
              <button 
                className={`${styles.viewBtn} ${activeView === 'week' ? styles.active : ''}`}
                onClick={() => setActiveView('week')}
              >
                Week
              </button>
              <button 
                className={`${styles.viewBtn} ${activeView === 'month' ? styles.active : ''}`}
                onClick={() => setActiveView('month')}
              >
                Month
              </button>
            </div>
            <button 
              className={styles.todayBtn}
            >
              Today
            </button>
            <button 
              className={`${styles.trackingBtn} ${isTracking ? styles.active : ''}`}
              onClick={toggleTracking}
            >
              <span className="material-icons">
                {isTracking ? 'fiber_manual_record' : 'play_arrow'}
              </span>
              {isTracking ? 'Active' : 'Start tracking'}
            </button>
            <button 
              className={styles.addTaskBtn}
              onClick={() => setShowAddTaskModal(true)}
            >
              + Add Time Entry
            </button>
          </div>
        </div>

        <div className={styles.dashboardContent}>
          <div className={styles.leftColumn}>
            <div className={styles.timelineSection}>
              <h3>Timeline</h3>
              <div className={styles.timelineContainer}>
                <div className={styles.timeScaleContainer}>
                  {Array.from({ length: 12 }).map((_, idx) => (
                    <div key={idx} className={styles.timeScaleMark}>
                      <span>{(idx + 9) % 24}:00</span>
                    </div>
                  ))}
                </div>
                <div className={styles.timelineMain}>
                  <div className={styles.currentTimeLine} style={{ left: '60%' }}>
                    <div className={styles.currentTimeMarker}>{getCurrentTime()}</div>
                  </div>
                  <div className={styles.timelineEvent} style={{ left: '25%', width: '15%', backgroundColor: '#4CAF50' }}>
                    <span>Coding</span>
                  </div>
                  <div className={styles.timelineEvent} style={{ left: '43%', width: '12%', backgroundColor: '#9C27B0' }}>
                    <span>Meeting</span>
                  </div>
                  <div className={styles.timelineEvent} style={{ left: '65%', width: '20%', backgroundColor: '#2196F3' }}>
                    <span>Design</span>
                  </div>
                </div>
              </div>
            </div>
          
            <div className={styles.projectsSection}>
              <div className={styles.sectionHeader}>
                <h3>Projects & tasks</h3>
                <button className={styles.moreActionsBtn}>
                  <span className="material-icons">more_horiz</span>
                </button>
              </div>
              <div className={styles.projectsList}>
                <div className={styles.projectItem}>
                  <div className={styles.projectDetails}>
                    <div className={styles.projectIcon} style={{ backgroundColor: '#9C27B0' }}>
                      <span className="material-icons">code</span>
                    </div>
                    <div className={styles.projectInfo}>
                      <span className={styles.projectName}>Finwall app</span>
                      <div className={styles.projectProgressBar}>
                        <div className={styles.projectProgressFill} style={{ width: '49%' }}></div>
                      </div>
                    </div>
                    <span className={styles.projectPercentage}>49%</span>
                  </div>
                  <div className={styles.projectTasks}>
                    <div className={styles.projectTask}>
                      <div className={styles.taskCheckbox}>✓</div>
                      <span className={styles.taskName}>DS42 - Settings section</span>
                      <span className={styles.taskTime}>55 min</span>
                    </div>
                    <div className={styles.projectTask}>
                      <div className={styles.taskCheckbox}></div>
                      <span className={styles.taskName}>DS12 - Dark version</span>
                      <span className={styles.taskTime}>1 hr 51 min</span>
                    </div>
                    <div className={styles.projectTask}>
                      <div className={styles.taskCheckbox}></div>
                      <span className={styles.taskName}>System update</span>
                      <span className={styles.taskTime}>40 min</span>
                    </div>
                  </div>
                </div>
                <div className={styles.projectItem}>
                  <div className={styles.projectDetails}>
                    <div className={styles.projectIcon} style={{ backgroundColor: '#4CAF50' }}>
                      <span className="material-icons">folder</span>
                    </div>
                    <div className={styles.projectInfo}>
                      <span className={styles.projectName}>Finwall web</span>
                      <div className={styles.projectProgressBar}>
                        <div className={styles.projectProgressFill} style={{ width: '32%' }}></div>
                      </div>
                    </div>
                    <span className={styles.projectPercentage}>32%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className={styles.rightColumn}>
            <div className={styles.dailySummarySection}>
              <h3>Daily Summary</h3>
              
              <div className={styles.summaryInfo}>
                <div className={styles.summaryHighlight}>
                  <span className={styles.summaryIcon}>⚡</span>
                  <p>
                    Today you had <strong>20%</strong> more meetings than usual, you closed <strong>2 tasks</strong> on two projects, but the focus was <strong>12%</strong> lower than yesterday.
                  </p>
                </div>
              </div>
              
              <div className={styles.summaryStats}>
                <div className={styles.statItem}>
                  <h4>Total time worked</h4>
                  <div className={styles.statValue}>
                    <span className={styles.bigNumber}>
                      {dashboardData.totalWorked.split(' ')[0]}
                    </span>
                    <span className={styles.timeUnit}>
                      hr {dashboardData.totalWorked.split(' ')[1]}
                    </span>
                  </div>
                </div>
                
                <div className={styles.statItem}>
                  <h4>Percent of work day</h4>
                  <div className={styles.circularProgress}>
                    <div className={styles.progressCircle} style={{ 
                      background: `conic-gradient(var(--primary-color) ${dashboardData.percentOfDay * 3.6}deg, var(--progress-bg) 0deg)`
                    }}>
                      <div className={styles.progressInner}>
                        <span>{dashboardData.percentOfDay}%</span>
                        <small>of 8 hr 0 min</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className={styles.activityBreakdown}>
                <div className={styles.breakdownItem}>
                  <div className={styles.breakdownProgress} style={{ backgroundColor: '#9C27B0', width: '62%' }}></div>
                  <span className={styles.breakdownPercent}>62%</span>
                  <span className={styles.breakdownLabel}>Focus</span>
                </div>
                <div className={styles.breakdownItem}>
                  <div className={styles.breakdownProgress} style={{ backgroundColor: '#2196F3', width: '15%' }}></div>
                  <span className={styles.breakdownPercent}>15%</span>
                  <span className={styles.breakdownLabel}>Meetings</span>
                </div>
                <div className={styles.breakdownItem}>
                  <div className={styles.breakdownProgress} style={{ backgroundColor: '#4CAF50', width: '11%' }}></div>
                  <span className={styles.breakdownPercent}>11%</span>
                  <span className={styles.breakdownLabel}>Breaks</span>
                </div>
                <div className={styles.breakdownItem}>
                  <div className={styles.breakdownProgress} style={{ backgroundColor: '#FF9800', width: '12%' }}></div>
                  <span className={styles.breakdownPercent}>12%</span>
                  <span className={styles.breakdownLabel}>Other</span>
                </div>
              </div>
            </div>
            
            <div className={styles.appsSection}>
              <div className={styles.sectionHeader}>
                <h3>Apps & Websites</h3>
                <button className={styles.moreActionsBtn}>
                  <span className="material-icons">more_horiz</span>
                </button>
              </div>
              
              <div className={styles.appsList}>
                <div className={styles.appItem}>
                  <div className={styles.appPercent}>47%</div>
                  <div className={styles.appInfo}>
                    <div className={styles.appName}>Figma</div>
                    <div className={styles.appProgressBar}>
                      <div className={styles.appProgressFill} style={{ width: '47%' }}></div>
                    </div>
                  </div>
                  <div className={styles.appTime}>2 hr 58 min</div>
                </div>
                
                <div className={styles.appItem}>
                  <div className={styles.appPercent}>12%</div>
                  <div className={styles.appInfo}>
                    <div className={styles.appName}>Adobe Photoshop</div>
                    <div className={styles.appProgressBar}>
                      <div className={styles.appProgressFill} style={{ width: '12%' }}></div>
                    </div>
                  </div>
                  <div className={styles.appTime}>46 min</div>
                </div>
                
                <div className={styles.appItem}>
                  <div className={styles.appPercent}>12%</div>
                  <div className={styles.appInfo}>
                    <div className={styles.appName}>zoom.us</div>
                    <div className={styles.appProgressBar}>
                      <div className={styles.appProgressFill} style={{ width: '12%' }}></div>
                    </div>
                  </div>
                  <div className={styles.appTime}>45 min</div>
                </div>
                
                <div className={styles.categorySection}>
                  <h4>Top categories</h4>
                  <div className={styles.categoryItem}>
                    <div className={styles.categoryPercent}>59%</div>
                    <div className={styles.categoryInfo}>
                      <div className={styles.categoryName}>Design</div>
                      <div className={styles.categoryProgressBar}>
                        <div className={styles.categoryProgressFill} style={{ width: '59%' }}></div>
                      </div>
                    </div>
                    <div className={styles.categoryTime}>3 hr 44 min</div>
                  </div>
                  
                  <div className={styles.categoryItem}>
                    <div className={styles.categoryPercent}>12%</div>
                    <div className={styles.categoryInfo}>
                      <div className={styles.categoryName}>Video Conference</div>
                      <div className={styles.categoryProgressBar}>
                        <div className={styles.categoryProgressFill} style={{ width: '12%' }}></div>
                      </div>
                    </div>
                    <div className={styles.categoryTime}>45 min</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Add Task Modal */}
      {showAddTaskModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Add Time Entry</h3>
              <button 
                className={styles.modalClose}
                onClick={() => setShowAddTaskModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddTask}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label htmlFor="taskName">Task Name</label>
                  <input 
                    type="text" 
                    id="taskName" 
                    className={styles.formInput}
                    placeholder="e.g., Coding, Meetings, Learning"
                    value={newTaskName}
                    onChange={(e) => setNewTaskName(e.target.value)}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="taskTime">Time Spent (hours:minutes)</label>
                  <input 
                    type="text" 
                    id="taskTime" 
                    className={styles.formInput}
                    placeholder="e.g., 1:30 for 1 hour 30 minutes"
                    value={newTaskTime}
                    onChange={(e) => setNewTaskTime(e.target.value)}
                    pattern="[0-9]+:[0-5][0-9]"
                    title="Format: hours:minutes (e.g., 1:30)"
                    required
                  />
                </div>
              </div>
              
              <div className={styles.modalFooter}>
                <button 
                  type="button" 
                  className={styles.cancelBtn}
                  onClick={() => setShowAddTaskModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.submitBtn}
                >
                  Add Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
