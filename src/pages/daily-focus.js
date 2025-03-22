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
  const [projects, setProjects] = useState([]);
  const [todos, setTodos] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedTodo, setSelectedTodo] = useState('');
  const [newTask, setNewTask] = useState('');
  const [activeTask, setActiveTask] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);
  const [dailyStats, setDailyStats] = useState({
    date: new Date().toLocaleDateString(),
    totalTracked: 0,
    taskBreakdown: []
  });

  useEffect(() => {
    async function loadInitialData() {
      // Load focus tasks
      const savedTasks = await loadData('focus-tasks', []);
      setTasks(savedTasks);
      
      // Load projects
      const projectsData = await loadData('projects', [
        { id: 'work', name: 'Work', color: '#e74c3c' },
        { id: 'personal', name: 'Personal', color: '#2ecc71' },
        { id: 'learning', name: 'Learning', color: '#3498db' }
      ]);
      setProjects(projectsData);
      
      // Load todo tasks
      const todosData = await loadData('todos', []);
      setTodos(todosData);
      
      // Set default project if available
      if (projectsData.length > 0 && !selectedProject) {
        setSelectedProject(projectsData[0].id);
      }
      
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
    
    loadInitialData();
    
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
  
  // Get project by ID
  const getProject = (projectId) => {
    return projects.find(p => p.id === projectId) || null;
  };
  
  // Get todo tasks for selected project
  const getProjectTodos = () => {
    if (!selectedProject) return [];
    return todos.filter(todo => todo.projectId === selectedProject && !todo.completed);
  };
  
  // Add new task
  const handleAddTask = (e) => {
    e.preventDefault();
    
    if (!newTask.trim()) return;
    
    const task = {
      id: Date.now().toString(),
      name: newTask,
      projectId: selectedProject,
      todoId: selectedTodo || null,
      tracked: 0,
      progress: 0,
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
    
    // Get current elapsed time and progress from the task
    const task = tasks.find(t => t.id === taskId);
    setElapsedTime(task.tracked);
    setProgress(task.progress || 0);
    
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
    
    // Update task tracked time and progress
    const updatedTasks = tasks.map(task => {
      if (task.id === activeTask) {
        return { 
          ...task, 
          tracked: elapsedTime,
          progress: progress
        };
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
        tracked: elapsedTime - task.tracked,
        projectId: task.projectId
      });
    }
    
    setDailyStats(updatedStats);
    saveData('focus-stats', updatedStats);
    
    // Update todo if linked
    if (task.todoId) {
      const updatedTodos = todos.map(todo => {
        if (todo.id === task.todoId) {
          return {
            ...todo,
            progress: progress,
            completed: progress >= 100
          };
        }
        return todo;
      });
      
      setTodos(updatedTodos);
      saveData('todos', updatedTodos);
    }
    
    // Reset tracking state
    setIsTracking(false);
    setActiveTask(null);
  };
  
  // Change progress
  const handleProgressChange = (e) => {
    const newProgress = parseInt(e.target.value);
    setProgress(newProgress);
    
    // If task is completed at 100%, auto-stop tracking
    if (newProgress === 100 && isTracking) {
      stopTracking();
    }
  };
  
  // Toggle task completion status
  const toggleTaskCompleted = (taskId) => {
    // If this task is active, stop tracking first
    if (isTracking && activeTask === taskId) {
      stopTracking();
    }
    
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        const newCompletionStatus = !task.isCompleted;
        return { 
          ...task, 
          isCompleted: newCompletionStatus,
          progress: newCompletionStatus ? 100 : task.progress
        };
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
              <div className={styles.formRow}>
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
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label>Project</label>
                  <select 
                    value={selectedProject}
                    onChange={(e) => {
                      setSelectedProject(e.target.value);
                      setSelectedTodo('');
                    }}
                    className={styles.selectInput}
                  >
                    {projects.length === 0 ? (
                      <option value="">No projects yet</option>
                    ) : (
                      projects.map(project => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>
                
                <div className={styles.formGroup}>
                  <label>Task (optional)</label>
                  <select 
                    value={selectedTodo}
                    onChange={(e) => setSelectedTodo(e.target.value)}
                    className={styles.selectInput}
                  >
                    <option value="">Select a task</option>
                    {getProjectTodos().map(todo => (
                      <option key={todo.id} value={todo.id}>
                        {todo.text}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </form>
            
            <div className={styles.taskList}>
              {filteredTasks.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>No tasks yet. Add one to get started!</p>
                </div>
              ) : (
                filteredTasks.map(task => {
                  const project = getProject(task.projectId);
                  const isActive = activeTask === task.id;
                  
                  return (
                    <div 
                      key={task.id} 
                      className={`${styles.taskItem} ${task.isCompleted ? styles.completed : ''} ${isActive ? styles.active : ''}`}
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
                        <div className={styles.taskMeta}>
                          {project && (
                            <span 
                              className={styles.taskProject}
                              style={{ backgroundColor: project.color }}
                            >
                              {project.name}
                            </span>
                          )}
                          <div className={styles.timerContainer}>
                            <span className={styles.timerIcon}>
                              <span className="material-icons">timer</span>
                            </span>
                            <span className={styles.taskTime}>
                              {isActive ? formatTime(elapsedTime) : formatTime(task.tracked)}
                            </span>
                            {!task.isCompleted && (
                              <button 
                                className={`${styles.timerButton} ${isActive ? styles.activeBtn : ''}`}
                                onClick={() => isActive ? stopTracking() : startTracking(task.id)}
                                title={isActive ? "Pause Timer" : "Start Timer"}
                              >
                                <span className="material-icons">
                                  {isActive ? 'pause' : 'play_arrow'}
                                </span>
                              </button>
                            )}
                          </div>
                        </div>
                        
                        <div className={styles.progressSliderContainer}>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={isActive ? progress : task.progress} 
                            onChange={(e) => {
                              const newProgress = parseInt(e.target.value);
                              if (isActive) {
                                setProgress(newProgress);
                              } else {
                                const updatedTasks = tasks.map(t => {
                                  if (t.id === task.id) {
                                    return { ...t, progress: newProgress };
                                  }
                                  return t;
                                });
                                setTasks(updatedTasks);
                                saveData('focus-tasks', updatedTasks);
                                
                                // If task reaches 100%, auto-complete it
                                if (newProgress === 100) {
                                  toggleTaskCompleted(task.id);
                                }
                              }
                            }}
                            className={styles.progressSlider}
                            disabled={task.isCompleted}
                          />
                          <div 
                            className={styles.progressSliderFill} 
                            style={{ width: `${isActive ? progress : task.progress}%` }}
                          ></div>
                        </div>
                        <div className={styles.progressText}>
                          Progress: {isActive ? progress : task.progress}%
                        </div>
                      </div>
                      
                      <div className={styles.taskActions}>
                        <button 
                          className={styles.taskActionBtn}
                          onClick={() => deleteTask(task.id)}
                        >
                          <span className="material-icons">delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })
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
                  dailyStats.taskBreakdown.map((task, index) => {
                    const project = task.projectId ? getProject(task.projectId) : null;
                    
                    return (
                      <div key={index} className={styles.breakdownItem}>
                        <div className={styles.breakdownName}>
                          {task.name}
                          {project && (
                            <span 
                              className={styles.breakdownProject}
                              style={{ backgroundColor: project.color }}
                            >
                              {project.name}
                            </span>
                          )}
                        </div>
                        <div className={styles.breakdownTime}>{formatTime(task.tracked)}</div>
                        <div className={styles.breakdownBar}>
                          <div 
                            className={styles.breakdownFill} 
                            style={{ width: `${(task.tracked / dailyStats.totalTracked) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })
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
                
                <div className={styles.sessionProgress}>
                  <div className={styles.progressLabel}>
                    Progress: <span className={styles.progressValue}>{progress}%</span>
                  </div>
                  <div className={styles.progressControlsContainer}>
                    <div className={styles.progressControls}>
                      <button 
                        className={styles.progressButton}
                        onClick={() => setProgress(Math.max(0, progress - 5))}
                        disabled={progress <= 0}
                      >
                        <span className="material-icons">remove</span>
                      </button>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={progress} 
                        onChange={handleProgressChange}
                        className={styles.progressSlider}
                      />
                      <button 
                        className={styles.progressButton}
                        onClick={() => setProgress(Math.min(100, progress + 5))}
                        disabled={progress >= 100}
                      >
                        <span className="material-icons">add</span>
                      </button>
                    </div>
                    <div className={styles.progressBarContainer}>
                      <div 
                        className={styles.progressBarFill} 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
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