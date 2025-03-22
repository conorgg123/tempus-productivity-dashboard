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
            <button 
              className={styles.addTaskBtn}
              onClick={() => setShowAddTaskModal(true)}
            >
              + Add Time Entry
            </button>
          </div>
        </div>
        
        <div className={styles.statsContainer}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <span className="material-icons">timer</span>
            </div>
            <div className={styles.statInfo}>
              <h3>Time Worked</h3>
              <p className={styles.statValue}>{dashboardData.totalWorked}</p>
            </div>
          </div>
          
          <div className={styles.statCard}>
            <div className={styles.statIcon}>
              <span className="material-icons">pie_chart</span>
            </div>
            <div className={styles.statInfo}>
              <h3>Percent of Day</h3>
              <p className={styles.statValue}>{formatPercent(dashboardData.percentOfDay)}</p>
              <div className={styles.progressBar}>
                <div 
                  className={styles.progressFill} 
                  style={{ width: formatPercent(dashboardData.percentOfDay) }}
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className={styles.timeBreakdownSection}>
          <div className={styles.sectionHeader}>
            <h3>Time Breakdown</h3>
          </div>
          
          <div className={styles.timeBreakdownContainer}>
            {dashboardData.taskBreakdown.map((task, index) => (
              <div key={index} className={styles.taskRow}>
                <div className={styles.taskDetails}>
                  <span className={styles.taskName}>{task.name}</span>
                  <span className={styles.taskTime}>{task.time}</span>
                </div>
                <div className={styles.taskProgressContainer}>
                  <div 
                    className={styles.taskProgress} 
                    style={{ width: formatPercent(task.percent) }}
                  ></div>
                </div>
                <div className={styles.taskActions}>
                  <button 
                    className={styles.deleteTaskBtn}
                    onClick={() => handleDeleteTask(index)}
                  >
                    <span className="material-icons">delete</span>
                  </button>
                </div>
              </div>
            ))}
            
            {dashboardData.taskBreakdown.length === 0 && (
              <div className={styles.emptyState}>
                <p>No time entries yet. Add your first task to start tracking your productivity!</p>
              </div>
            )}
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
