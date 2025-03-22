import React, { useState, useEffect, useRef } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  IconButton,
  Divider,
  LinearProgress,
  Card,
  CardContent,
  Grid,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { 
  Add as AddIcon,
  Delete as DeleteIcon,
  Today as TodayIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import Head from 'next/head';
import Layout from '@/components/Layout';
import styles from '@/styles/DailyFocus.module.css';
import { loadData, saveData } from '@/utils/storage';

export default function DailyFocus() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [activeTask, setActiveTask] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);
  const [dailyStats, setDailyStats] = useState({
    date: new Date().toLocaleDateString(),
    totalTracked: 0,
    taskBreakdown: []
  });

  useEffect(() => {
    async function loadTasks() {
      const savedTasks = await loadData('focus-tasks', []);
      setTasks(savedTasks);
      
      const savedStats = await loadData('focus-stats', {
        date: new Date().toLocaleDateString(),
        totalTracked: 0,
        taskBreakdown: []
      });
      
      // If it's a new day, reset stats
      if (savedStats.date !== new Date().toLocaleDateString()) {
        setDailyStats({
          date: new Date().toLocaleDateString(),
          totalTracked: 0,
          taskBreakdown: []
        });
      } else {
        setDailyStats(savedStats);
      }
    }
    
    loadTasks();
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  // Format time as HH:MM:SS
  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0')
    ].join(':');
  };
  
  // Add new task
  const handleAddTask = (e) => {
    e.preventDefault();
    
    if (!newTask.trim()) return;
    
    const task = {
      id: Date.now().toString(),
      name: newTask,
      tracked: 0,
      isCompleted: false
    };
    
    const updatedTasks = [...tasks, task];
    setTasks(updatedTasks);
    saveData('focus-tasks', updatedTasks);
    setNewTask('');
  };
  
  // Start tracking time for a task
  const startTracking = (taskId) => {
    // If already tracking, save current tracked time
    if (isTracking && activeTask) {
      stopTracking();
    }
    
    setActiveTask(taskId);
    setIsTracking(true);
    
    // Get current elapsed time from the task
    const task = tasks.find(t => t.id === taskId);
    setElapsedTime(task.tracked);
    
    // Start the timer
    timerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
  };
  
  // Stop tracking time
  const stopTracking = () => {
    if (!activeTask) return;
    
    // Clear interval
    clearInterval(timerRef.current);
    timerRef.current = null;
    
    // Update task tracked time
    const updatedTasks = tasks.map(task => {
      if (task.id === activeTask) {
        return { ...task, tracked: elapsedTime };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    saveData('focus-tasks', updatedTasks);
    
    // Update daily stats
    const task = tasks.find(t => t.id === activeTask);
    const updatedStats = { ...dailyStats };
    updatedStats.totalTracked += elapsedTime - task.tracked;
    
    // Update or add to task breakdown
    const existingIndex = updatedStats.taskBreakdown.findIndex(t => t.name === task.name);
    if (existingIndex >= 0) {
      updatedStats.taskBreakdown[existingIndex].tracked += elapsedTime - task.tracked;
    } else {
      updatedStats.taskBreakdown.push({
        name: task.name,
        tracked: elapsedTime - task.tracked
      });
    }
    
    setDailyStats(updatedStats);
    saveData('focus-stats', updatedStats);
    
    // Reset tracking state
    setIsTracking(false);
    setActiveTask(null);
  };
  
  // Toggle task completion status
  const toggleTaskCompleted = (taskId) => {
    // If this task is active, stop tracking first
    if (isTracking && activeTask === taskId) {
      stopTracking();
    }
    
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        return { ...task, isCompleted: !task.isCompleted };
      }
      return task;
    });
    
    setTasks(updatedTasks);
    saveData('focus-tasks', updatedTasks);
  };
  
  // Delete a task
  const deleteTask = (taskId) => {
    // If this task is active, stop tracking first
    if (isTracking && activeTask === taskId) {
      stopTracking();
    }
    
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    saveData('focus-tasks', updatedTasks);
  };
  
  // Filter tasks based on completion status
  const filteredTasks = showCompletedTasks 
    ? tasks 
    : tasks.filter(task => !task.isCompleted);

  return (
    <Layout>
      <Head>
        <title>Daily Focus - Tempus Productivity</title>
      </Head>
      
      <div className={styles.focusContainer}>
        <div className={styles.focusHeader}>
          <div className={styles.headerTitle}>
            <h2>Daily Focus</h2>
            <p>Track time on your focused tasks</p>
          </div>
          
          <div className={styles.headerControls}>
            <button 
              className={styles.filterToggle}
              onClick={() => setShowCompletedTasks(!showCompletedTasks)}
            >
              {showCompletedTasks ? 'Hide Completed' : 'Show Completed'}
            </button>
          </div>
        </div>
        
        <div className={styles.focusContent}>
          <div className={styles.taskColumn}>
            <h3>Tasks</h3>
            
            <form className={styles.addTaskForm} onSubmit={handleAddTask}>
              <input 
                type="text"
                placeholder="Add a new task..."
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                className={styles.addTaskInput}
              />
              <button type="submit" className={styles.addTaskBtn}>
                <span className="material-icons">add</span>
              </button>
            </form>
            
            <div className={styles.taskList}>
              {filteredTasks.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No tasks yet. Add one to get started!</p>
                </div>
              ) : (
                filteredTasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`${styles.taskItem} ${task.isCompleted ? styles.completed : ''} ${activeTask === task.id ? styles.active : ''}`}
                  >
                    <div className={styles.taskCheckbox}>
                      <input 
                        type="checkbox"
                        checked={task.isCompleted}
                        onChange={() => toggleTaskCompleted(task.id)}
                        id={`task-${task.id}`}
                      />
                      <label htmlFor={`task-${task.id}`}></label>
                    </div>
                    
                    <div className={styles.taskDetails}>
                      <div className={styles.taskName}>{task.name}</div>
                      <div className={styles.taskTime}>
                        {activeTask === task.id ? formatTime(elapsedTime) : formatTime(task.tracked)}
                      </div>
                    </div>
                    
                    <div className={styles.taskActions}>
                      {!task.isCompleted && (
                        <button 
                          className={`${styles.taskActionBtn} ${activeTask === task.id ? styles.activeBtn : ''}`}
                          onClick={() => activeTask === task.id ? stopTracking() : startTracking(task.id)}
                        >
                          <span className="material-icons">
                            {activeTask === task.id ? 'pause' : 'play_arrow'}
                          </span>
                        </button>
                      )}
                      
                      <button 
                        className={styles.taskActionBtn}
                        onClick={() => deleteTask(task.id)}
                      >
                        <span className="material-icons">delete</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className={styles.statsColumn}>
            <h3>Today's Stats</h3>
            
            <div className={styles.statsCard}>
              <div className={styles.statItem}>
                <div className={styles.statLabel}>Total Time Tracked</div>
                <div className={styles.statValue}>{formatTime(dailyStats.totalTracked)}</div>
              </div>
              
              <div className={styles.statDivider}></div>
              
              <div className={styles.statBreakdown}>
                <h4>Task Breakdown</h4>
                
                {dailyStats.taskBreakdown.length === 0 ? (
                  <div className={styles.emptyBreakdown}>
                    <p>No tasks tracked yet today</p>
                  </div>
                ) : (
                  dailyStats.taskBreakdown.map((task, index) => (
                    <div key={index} className={styles.breakdownItem}>
                      <div className={styles.breakdownName}>{task.name}</div>
                      <div className={styles.breakdownTime}>{formatTime(task.tracked)}</div>
                      <div className={styles.breakdownBar}>
                        <div 
                          className={styles.breakdownFill} 
                          style={{ width: `${(task.tracked / dailyStats.totalTracked) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
            
            {isTracking && (
              <div className={styles.currentSession}>
                <h3>Current Session</h3>
                <div className={styles.sessionTask}>
                  {tasks.find(t => t.id === activeTask)?.name}
                </div>
                <div className={styles.sessionTimer}>
                  {formatTime(elapsedTime)}
                </div>
                <button 
                  className={styles.stopBtn}
                  onClick={stopTracking}
                >
                  Stop Tracking
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
} 