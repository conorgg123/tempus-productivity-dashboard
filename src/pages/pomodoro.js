import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import styles from '@/styles/Pomodoro.module.css';
import { loadData, saveData } from '@/utils/storage';

export default function Pomodoro() {
  // Timer states
  const [timerMode, setTimerMode] = useState('pomodoro'); // pomodoro, shortBreak, longBreak
  const [timeLeft, setTimeLeft] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [currentTask, setCurrentTask] = useState('');
  const [pomodoroHistory, setPomodoroHistory] = useState([]);
  
  // Settings
  const [settings, setSettings] = useState({
    pomodoroTime: 25,
    shortBreakTime: 5,
    longBreakTime: 15,
    autoStartBreaks: false,
    autoStartPomodoros: false,
    longBreakInterval: 4,
    alarmSound: 'bell',
    alarmVolume: 50
  });
  
  // Settings modal
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  
  // Task input
  const [taskInput, setTaskInput] = useState('');
  
  // Load saved data on component mount
  useEffect(() => {
    async function loadPomodoroData() {
      const savedSettings = await loadData('pomodoro-settings', {
        pomodoroTime: 25,
        shortBreakTime: 5,
        longBreakTime: 15,
        autoStartBreaks: false,
        autoStartPomodoros: false,
        longBreakInterval: 4,
        alarmSound: 'bell',
        alarmVolume: 50
      });
      
      const savedHistory = await loadData('pomodoro-history', { 
        completedPomodoros: 0,
        history: []
      });
      
      setSettings(savedSettings);
      setCompletedPomodoros(savedHistory.completedPomodoros || 0);
      setPomodoroHistory(savedHistory.history || []);
      
      // Set initial time based on mode
      resetTimer(timerMode, savedSettings);
    }
    
    loadPomodoroData();
  }, []);
  
  // Timer countdown effect
  useEffect(() => {
    let interval = null;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(timeLeft => timeLeft - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      clearInterval(interval);
      handleTimerComplete();
    }
    
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);
  
  // Format time as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Reset timer based on mode
  const resetTimer = (mode, settingsObj = settings) => {
    switch (mode) {
      case 'pomodoro':
        setTimeLeft(settingsObj.pomodoroTime * 60);
        break;
      case 'shortBreak':
        setTimeLeft(settingsObj.shortBreakTime * 60);
        break;
      case 'longBreak':
        setTimeLeft(settingsObj.longBreakTime * 60);
        break;
      default:
        setTimeLeft(settingsObj.pomodoroTime * 60);
    }
  };
  
  // Handle timer mode change
  const changeTimerMode = (mode) => {
    setTimerMode(mode);
    setIsActive(false);
    resetTimer(mode);
  };
  
  // Toggle timer start/pause
  const toggleTimer = () => {
    setIsActive(!isActive);
    if (!isActive && !currentTask && taskInput) {
      setCurrentTask(taskInput);
    }
  };
  
  // Reset current timer
  const resetCurrentTimer = () => {
    setIsActive(false);
    resetTimer(timerMode);
  };
  
  // Handle timer completion
  const handleTimerComplete = () => {
    const audio = new Audio(`/sounds/${settings.alarmSound}.mp3`);
    audio.volume = settings.alarmVolume / 100;
    audio.play();
    
    if (timerMode === 'pomodoro') {
      // Update completed pomodoros
      const newCompletedCount = completedPomodoros + 1;
      setCompletedPomodoros(newCompletedCount);
      
      // Add to history
      const historyEntry = {
        date: new Date().toISOString(),
        task: currentTask || 'Unnamed task',
        duration: settings.pomodoroTime,
        category: 'Work'
      };
      
      const updatedHistory = [...pomodoroHistory, historyEntry];
      setPomodoroHistory(updatedHistory);
      
      // Save to storage
      saveData('pomodoro-history', {
        completedPomodoros: newCompletedCount,
        history: updatedHistory
      });
      
      // Update dashboard data
      updateDashboardData(settings.pomodoroTime);
      
      // Determine next break type (short or long)
      const nextMode = (newCompletedCount % settings.longBreakInterval === 0) 
        ? 'longBreak' 
        : 'shortBreak';
      
      setTimerMode(nextMode);
      resetTimer(nextMode);
      
      // Auto-start break if enabled
      if (settings.autoStartBreaks) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    } else {
      // Break is over, switch back to pomodoro
      setTimerMode('pomodoro');
      resetTimer('pomodoro');
      
      // Auto-start pomodoro if enabled
      if (settings.autoStartPomodoros) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    }
  };
  
  // Update dashboard with completed pomodoro time
  const updateDashboardData = async (pomodoroMinutes) => {
    const dashboardData = await loadData('dashboard-data', {
      date: new Date().toLocaleDateString(),
      totalWorked: "0h 0m",
      percentOfDay: 0,
      taskBreakdown: []
    });
    
    // Parse current total worked time
    let currentHours = 0;
    let currentMinutes = 0;
    
    if (typeof dashboardData.totalWorked === 'string') {
      const match = dashboardData.totalWorked.match(/(\d+)h\s+(\d+)m/);
      if (match) {
        currentHours = parseInt(match[1]);
        currentMinutes = parseInt(match[2]);
      }
    }
    
    // Add pomodoro time
    currentMinutes += pomodoroMinutes;
    if (currentMinutes >= 60) {
      currentHours += Math.floor(currentMinutes / 60);
      currentMinutes = currentMinutes % 60;
    }
    
    // Update total time
    dashboardData.totalWorked = `${currentHours}h ${currentMinutes}m`;
    
    // Calculate percentage of day (8-hour workday)
    const totalMinutes = (currentHours * 60) + currentMinutes;
    dashboardData.percentOfDay = Math.min(Math.round((totalMinutes / 480) * 100), 100);
    
    // Update task breakdown for "Focus" category
    let focusCategory = dashboardData.taskBreakdown.find(task => task.name === "Focus");
    
    if (focusCategory) {
      // Update existing category
      const match = focusCategory.time.match(/(\d+)h\s+(\d+)m/);
      if (match) {
        let hours = parseInt(match[1]);
        let minutes = parseInt(match[2]) + pomodoroMinutes;
        
        if (minutes >= 60) {
          hours += Math.floor(minutes / 60);
          minutes = minutes % 60;
        }
        
        focusCategory.time = `${hours}h ${minutes}m`;
        
        // Update percent
        const totalTaskMinutes = (hours * 60) + minutes;
        focusCategory.percent = Math.round((totalTaskMinutes / 480) * 100);
      }
    } else {
      // Create new category
      const hours = Math.floor(pomodoroMinutes / 60);
      const minutes = pomodoroMinutes % 60;
      
      focusCategory = {
        name: "Focus",
        time: `${hours}h ${minutes}m`,
        percent: Math.round((pomodoroMinutes / 480) * 100)
      };
      
      dashboardData.taskBreakdown.push(focusCategory);
    }
    
    // Save updated dashboard data
    await saveData('dashboard-data', dashboardData);
  };
  
  // Save settings
  const saveSettings = () => {
    saveData('pomodoro-settings', settings);
    resetTimer(timerMode, settings);
    setShowSettingsModal(false);
  };
  
  // Handle task form submission
  const handleTaskSubmit = (e) => {
    e.preventDefault();
    setCurrentTask(taskInput);
    setTaskInput('');
  };
  
  // Calculate progress percentage for timer circle
  const calculateProgress = () => {
    let totalSeconds;
    switch (timerMode) {
      case 'pomodoro':
        totalSeconds = settings.pomodoroTime * 60;
        break;
      case 'shortBreak':
        totalSeconds = settings.shortBreakTime * 60;
        break;
      case 'longBreak':
        totalSeconds = settings.longBreakTime * 60;
        break;
      default:
        totalSeconds = settings.pomodoroTime * 60;
    }
    
    const progress = ((totalSeconds - timeLeft) / totalSeconds) * 100;
    return progress;
  };
  
  return (
    <Layout>
      <Head>
        <title>Pomodoro Timer - Tempus Productivity</title>
      </Head>
      
      <div className={styles.pomodoroContainer}>
        <div className={styles.pomodoroHeader}>
          <h2>Pomodoro Timer</h2>
          <button 
            className={styles.settingsButton} 
            onClick={() => setShowSettingsModal(true)}
          >
            <span className="material-icons">settings</span>
          </button>
        </div>
        
        <div className={styles.timerModeSelector}>
          <button 
            className={`${styles.modeButton} ${timerMode === 'pomodoro' ? styles.activeMode : ''}`}
            onClick={() => changeTimerMode('pomodoro')}
          >
            Pomodoro
          </button>
          <button 
            className={`${styles.modeButton} ${timerMode === 'shortBreak' ? styles.activeMode : ''}`}
            onClick={() => changeTimerMode('shortBreak')}
          >
            Short Break
          </button>
          <button 
            className={`${styles.modeButton} ${timerMode === 'longBreak' ? styles.activeMode : ''}`}
            onClick={() => changeTimerMode('longBreak')}
          >
            Long Break
          </button>
        </div>
        
        <div className={styles.timerDisplay}>
          <div className={styles.timerCircle} style={{ background: `conic-gradient(var(--primary-color) ${calculateProgress() * 3.6}deg, var(--progress-bg) 0deg)` }}>
            <div className={styles.timerInner}>
              <div className={styles.time}>{formatTime(timeLeft)}</div>
              <div className={styles.mode}>
                {timerMode === 'pomodoro' ? 'Focus' : timerMode === 'shortBreak' ? 'Short Break' : 'Long Break'}
              </div>
            </div>
          </div>
          
          <div className={styles.timerControls}>
            <button 
              className={styles.controlButton} 
              onClick={toggleTimer}
            >
              <span className="material-icons">
                {isActive ? 'pause' : 'play_arrow'}
              </span>
            </button>
            <button 
              className={styles.controlButton} 
              onClick={resetCurrentTimer}
            >
              <span className="material-icons">refresh</span>
            </button>
          </div>
        </div>
        
        <div className={styles.taskSection}>
          {currentTask ? (
            <div className={styles.currentTask}>
              <h3>Current Task:</h3>
              <p>{currentTask}</p>
              <button 
                className={styles.clearTaskButton}
                onClick={() => setCurrentTask('')}
              >
                Clear
              </button>
            </div>
          ) : (
            <form onSubmit={handleTaskSubmit} className={styles.taskForm}>
              <input
                type="text"
                placeholder="What are you working on?"
                value={taskInput}
                onChange={(e) => setTaskInput(e.target.value)}
                className={styles.taskInput}
              />
              <button type="submit" className={styles.addTaskButton}>
                Set Task
              </button>
            </form>
          )}
        </div>
        
        <div className={styles.statsSection}>
          <h3>Today's Progress</h3>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{completedPomodoros}</div>
              <div className={styles.statLabel}>Pomodoros</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{Math.round(completedPomodoros * settings.pomodoroTime / 60)}</div>
              <div className={styles.statLabel}>Hours</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{completedPomodoros * settings.pomodoroTime}</div>
              <div className={styles.statLabel}>Minutes</div>
            </div>
          </div>
        </div>
        
        {pomodoroHistory.length > 0 && (
          <div className={styles.historySection}>
            <h3>Recent Sessions</h3>
            <div className={styles.historyList}>
              {pomodoroHistory.slice(-5).reverse().map((session, index) => (
                <div key={index} className={styles.historyItem}>
                  <div className={styles.historyTask}>{session.task}</div>
                  <div className={styles.historyTime}>{new Date(session.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  <div className={styles.historyDuration}>{session.duration} min</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      
      {/* Settings Modal */}
      {showSettingsModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h3>Timer Settings</h3>
              <button 
                className={styles.closeButton}
                onClick={() => setShowSettingsModal(false)}
              >
                &times;
              </button>
            </div>
            
            <div className={styles.modalBody}>
              <div className={styles.settingsGroup}>
                <h4>Timer (minutes)</h4>
                <div className={styles.settingsRow}>
                  <div className={styles.settingItem}>
                    <label htmlFor="pomodoroTime">Pomodoro</label>
                    <input
                      type="number"
                      id="pomodoroTime"
                      min="1"
                      max="60"
                      value={settings.pomodoroTime}
                      onChange={(e) => setSettings({...settings, pomodoroTime: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className={styles.settingItem}>
                    <label htmlFor="shortBreakTime">Short Break</label>
                    <input
                      type="number"
                      id="shortBreakTime"
                      min="1"
                      max="30"
                      value={settings.shortBreakTime}
                      onChange={(e) => setSettings({...settings, shortBreakTime: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className={styles.settingItem}>
                    <label htmlFor="longBreakTime">Long Break</label>
                    <input
                      type="number"
                      id="longBreakTime"
                      min="1"
                      max="60"
                      value={settings.longBreakTime}
                      onChange={(e) => setSettings({...settings, longBreakTime: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
              
              <div className={styles.settingsGroup}>
                <h4>Auto Start</h4>
                <div className={styles.settingsRow}>
                  <div className={styles.settingItem}>
                    <label htmlFor="autoStartBreaks">Auto-start Breaks</label>
                    <input
                      type="checkbox"
                      id="autoStartBreaks"
                      checked={settings.autoStartBreaks}
                      onChange={(e) => setSettings({...settings, autoStartBreaks: e.target.checked})}
                    />
                  </div>
                  <div className={styles.settingItem}>
                    <label htmlFor="autoStartPomodoros">Auto-start Pomodoros</label>
                    <input
                      type="checkbox"
                      id="autoStartPomodoros"
                      checked={settings.autoStartPomodoros}
                      onChange={(e) => setSettings({...settings, autoStartPomodoros: e.target.checked})}
                    />
                  </div>
                </div>
              </div>
              
              <div className={styles.settingsGroup}>
                <h4>Other Settings</h4>
                <div className={styles.settingsRow}>
                  <div className={styles.settingItem}>
                    <label htmlFor="longBreakInterval">Long Break Interval</label>
                    <input
                      type="number"
                      id="longBreakInterval"
                      min="1"
                      max="10"
                      value={settings.longBreakInterval}
                      onChange={(e) => setSettings({...settings, longBreakInterval: parseInt(e.target.value)})}
                    />
                  </div>
                  <div className={styles.settingItem}>
                    <label htmlFor="alarmSound">Alarm Sound</label>
                    <select
                      id="alarmSound"
                      value={settings.alarmSound}
                      onChange={(e) => setSettings({...settings, alarmSound: e.target.value})}
                    >
                      <option value="bell">Bell</option>
                      <option value="digital">Digital</option>
                      <option value="kitchen">Kitchen</option>
                      <option value="chime">Chime</option>
                    </select>
                  </div>
                  <div className={styles.settingItem}>
                    <label htmlFor="alarmVolume">Volume</label>
                    <input
                      type="range"
                      id="alarmVolume"
                      min="0"
                      max="100"
                      value={settings.alarmVolume}
                      onChange={(e) => setSettings({...settings, alarmVolume: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className={styles.modalFooter}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowSettingsModal(false)}
              >
                Cancel
              </button>
              <button
                className={styles.saveButton}
                onClick={saveSettings}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
} 