import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  ListItemButton,
  Checkbox,
  Paper,
  Divider,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ButtonGroup
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import Head from 'next/head';
import Layout from '@/components/Layout';
import styles from '@/styles/TodoList.module.css';
import { loadData, saveData } from '@/utils/storage';

// Utils
import { getItem, setItem } from '../utils/localStorage';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [projects, setProjects] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [priority, setPriority] = useState('medium');
  const [selectedProject, setSelectedProject] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(30); // Default 30 minutes
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterProject, setFilterProject] = useState('all');
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectColor, setNewProjectColor] = useState('#7646f4');

  useEffect(() => {
    async function loadInitialData() {
      // Try to get personal data from main process first
      let personalData = null;
      if (window.api && window.api.getPersonalData) {
        personalData = window.api.getPersonalData();
      }
      
      // Load todos from storage or personal data
      const todosData = await loadData('todos', personalData?.todos || []);
      setTodos(todosData);
      
      // Load projects from storage or personal data
      let projectsData;
      if (personalData?.projects && personalData.projects.length > 0) {
        projectsData = personalData.projects;
      } else {
        projectsData = await loadData('projects', [
          { id: 'work', name: 'Work', color: '#e74c3c' },
          { id: 'personal', name: 'Personal', color: '#2ecc71' },
          { id: 'learning', name: 'Learning', color: '#3498db' }
        ]);
      }
      setProjects(projectsData);
      
      // Set default project if available
      if (projectsData.length > 0 && !selectedProject) {
        setSelectedProject(projectsData[0].id);
      }
    }
    
    loadInitialData();
  }, []);

  useEffect(() => {
    // Save todos to localStorage whenever they change
    saveData('todos', todos);
  }, [todos]);

  // Get priority info (label, color, level)
  const getPriorityInfo = (priorityLevel) => {
    switch (priorityLevel) {
      case 'high':
        return { 
          label: 'High', 
          color: 'var(--danger-color)',
          level: 3
        };
      case 'medium':
        return { 
          label: 'Medium', 
          color: 'var(--warning-color)',
          level: 2
        };
      case 'low':
        return { 
          label: 'Low', 
          color: 'var(--info-color)',
          level: 1
        };
      default:
        return { 
          label: 'Medium', 
          color: 'var(--warning-color)',
          level: 2
        };
    }
  };

  // Get project by ID
  const getProject = (projectId) => {
    return projects.find(p => p.id === projectId) || null;
  };

  // Format estimated time
  const formatEstimatedTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours === 0) {
      return `${mins}m`;
    } else if (mins === 0) {
      return `${hours}h`;
    } else {
      return `${hours}h ${mins}m`;
    }
  };

  // Add new project
  const handleAddProject = (e) => {
    e.preventDefault();
    
    if (!newProjectName.trim()) return;
    
    const newProject = {
      id: `project-${Date.now()}`,
      name: newProjectName,
      color: newProjectColor
    };
    
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    saveData('projects', updatedProjects);
    
    // Select the new project
    setSelectedProject(newProject.id);
    
    // Reset form and close modal
    setNewProjectName('');
    setNewProjectColor('#7646f4');
    setShowAddProjectModal(false);
  };

  // Add new todo
  const handleAddTodo = (e) => {
    e.preventDefault();
    
    if (!newTodo.trim() || !selectedProject) return;
    
    const todo = {
      id: Date.now().toString(),
      text: newTodo,
      priority,
      projectId: selectedProject,
      estimatedTime,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    const updatedTodos = [...todos, todo];
    setTodos(updatedTodos);
    saveData('todos', updatedTodos);
    setNewTodo('');
    setPriority('medium');
    // Keep the selected project and estimated time for faster task entry
  };

  // Toggle todo completion status
  const toggleTodoCompleted = (id) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, completed: !todo.completed };
      }
      return todo;
    });
    
    setTodos(updatedTodos);
    saveData('todos', updatedTodos);
  };

  // Change todo priority
  const changeTodoPriority = (id, newPriority) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        return { ...todo, priority: newPriority };
      }
      return todo;
    });
    
    setTodos(updatedTodos);
    saveData('todos', updatedTodos);
  };

  // Delete a todo
  const deleteTodo = (id) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    saveData('todos', updatedTodos);
  };

  // Filter and sort todos
  const filteredAndSortedTodos = [...todos]
    .filter(todo => {
      // Filter by status
      if (filterStatus === 'active' && todo.completed) return false;
      if (filterStatus === 'completed' && !todo.completed) return false;
      
      // Filter by priority
      if (filterPriority !== 'all' && todo.priority !== filterPriority) return false;
      
      // Filter by project
      if (filterProject !== 'all' && todo.projectId !== filterProject) return false;
      
      return true;
    })
    .sort((a, b) => {
      // Sort by priority (high to low)
      const priorityA = getPriorityInfo(a.priority).level;
      const priorityB = getPriorityInfo(b.priority).level;
      
      if (priorityA !== priorityB) {
        return priorityB - priorityA;
      }
      
      // Then by completion status (active first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Then by creation date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <Layout>
      <Head>
        <title>Todo List - Tempus Productivity</title>
      </Head>
      
      <div className={styles.todoContainer}>
        <div className={styles.todoHeader}>
          <div className={styles.headerTitle}>
            <h2>Todo List</h2>
            <p>Manage your tasks with priorities</p>
          </div>
          
          <div className={styles.headerControls}>
            <div className={styles.filterGroup}>
              <button 
                className={`${styles.filterBtn} ${filterStatus === 'all' ? styles.active : ''}`}
                onClick={() => setFilterStatus('all')}
              >
                All
              </button>
              <button 
                className={`${styles.filterBtn} ${filterStatus === 'active' ? styles.active : ''}`}
                onClick={() => setFilterStatus('active')}
              >
                Active
              </button>
              <button 
                className={`${styles.filterBtn} ${filterStatus === 'completed' ? styles.active : ''}`}
                onClick={() => setFilterStatus('completed')}
              >
                Completed
              </button>
            </div>
            
            <div className={styles.priorityFilter}>
              <select 
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
            
            <div className={styles.projectFilter}>
              <select 
                value={filterProject}
                onChange={(e) => setFilterProject(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="all">All Projects</option>
                {projects.map(project => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        <div className={styles.todoContent}>
          <form className={styles.addTodoForm} onSubmit={handleAddTodo}>
            <div className={styles.formRow}>
              <input 
                type="text"
                placeholder="Add a new task..."
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                className={styles.addTodoInput}
              />
            </div>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Project</label>
                <div className={styles.projectSelector}>
                  <select 
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className={styles.projectSelect}
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
                  <button 
                    type="button" 
                    className={styles.addProjectBtn}
                    onClick={() => setShowAddProjectModal(true)}
                  >
                    <span className="material-icons">add</span>
                  </button>
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label>Estimated Time</label>
                <select 
                  value={estimatedTime}
                  onChange={(e) => setEstimatedTime(parseInt(e.target.value))}
                  className={styles.timeSelect}
                >
                  <option value="30">30 minutes</option>
                  <option value="60">1 hour</option>
                  <option value="90">1.5 hours</option>
                  <option value="120">2 hours</option>
                  <option value="180">3 hours</option>
                  <option value="240">4 hours</option>
                  <option value="300">5 hours</option>
                  <option value="360">6 hours</option>
                  <option value="480">8 hours</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label>Priority</label>
                <div className={styles.prioritySelector}>
                  <button 
                    type="button" 
                    className={`${styles.priorityBtn} ${styles.highPriority} ${priority === 'high' ? styles.selected : ''}`}
                    onClick={() => setPriority('high')}
                  >
                    High
                  </button>
                  <button 
                    type="button" 
                    className={`${styles.priorityBtn} ${styles.mediumPriority} ${priority === 'medium' ? styles.selected : ''}`}
                    onClick={() => setPriority('medium')}
                  >
                    Medium
                  </button>
                  <button 
                    type="button" 
                    className={`${styles.priorityBtn} ${styles.lowPriority} ${priority === 'low' ? styles.selected : ''}`}
                    onClick={() => setPriority('low')}
                  >
                    Low
                  </button>
                </div>
              </div>
            </div>
            
            <button type="submit" className={styles.addTodoBtn} disabled={!newTodo.trim() || !selectedProject}>
              Add Task
            </button>
          </form>
          
          <div className={styles.todoList}>
            {filteredAndSortedTodos.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No tasks found. Add one to get started!</p>
              </div>
            ) : (
              filteredAndSortedTodos.map(todo => {
                const priorityInfo = getPriorityInfo(todo.priority);
                const project = getProject(todo.projectId);
                
                return (
                  <div 
                    key={todo.id} 
                    className={`${styles.todoItem} ${todo.completed ? styles.completed : ''}`}
                  >
                    <div className={styles.todoCheckbox}>
                      <input 
                        type="checkbox"
                        checked={todo.completed}
                        onChange={() => toggleTodoCompleted(todo.id)}
                        id={`todo-${todo.id}`}
                      />
                      <label htmlFor={`todo-${todo.id}`}></label>
                    </div>
                    
                    <div className={styles.todoContent}>
                      <div className={styles.todoText}>{todo.text}</div>
                      <div className={styles.todoMeta}>
                        {project && (
                          <span 
                            className={styles.todoProject}
                            style={{ backgroundColor: project.color }}
                          >
                            {project.name}
                          </span>
                        )}
                        
                        <span 
                          className={styles.todoPriority}
                          style={{ color: priorityInfo.color }}
                        >
                          {priorityInfo.label}
                        </span>
                        
                        <span className={styles.todoEstimate}>
                          <span className="material-icons">schedule</span>
                          {formatEstimatedTime(todo.estimatedTime)}
                        </span>
                      </div>
                    </div>
                    
                    <div className={styles.todoActions}>
                      <div className={styles.priorityDropdown}>
                        <button className={styles.dropdownBtn}>
                          <span className="material-icons">flag</span>
                        </button>
                        <div className={styles.dropdownContent}>
                          <button 
                            className={styles.dropdownItem}
                            onClick={() => changeTodoPriority(todo.id, 'high')}
                          >
                            High
                          </button>
                          <button 
                            className={styles.dropdownItem}
                            onClick={() => changeTodoPriority(todo.id, 'medium')}
                          >
                            Medium
                          </button>
                          <button 
                            className={styles.dropdownItem}
                            onClick={() => changeTodoPriority(todo.id, 'low')}
                          >
                            Low
                          </button>
                        </div>
                      </div>
                      
                      <button 
                        className={styles.todoActionBtn}
                        onClick={() => deleteTodo(todo.id)}
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
      </div>
      
      {/* Add Project Modal */}
      {showAddProjectModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Add Project</h3>
              <button 
                className={styles.modalClose}
                onClick={() => setShowAddProjectModal(false)}
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleAddProject}>
              <div className={styles.modalBody}>
                <div className={styles.formGroup}>
                  <label htmlFor="projectName">Project Name</label>
                  <input 
                    type="text" 
                    id="projectName" 
                    className={styles.formInput}
                    placeholder="e.g., Work, Personal, Learning"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="projectColor">Color</label>
                  <div className={styles.colorPicker}>
                    <input 
                      type="color" 
                      id="projectColor" 
                      value={newProjectColor}
                      onChange={(e) => setNewProjectColor(e.target.value)}
                    />
                    <span className={styles.selectedColor}>{newProjectColor}</span>
                  </div>
                </div>
              </div>
              
              <div className={styles.modalFooter}>
                <button 
                  type="button" 
                  className={styles.cancelBtn}
                  onClick={() => setShowAddProjectModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.submitBtn}
                >
                  Add Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
} 