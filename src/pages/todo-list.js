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
  const [newTodo, setNewTodo] = useState('');
  const [priority, setPriority] = useState('medium');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');

  useEffect(() => {
    async function loadTodos() {
      const data = await loadData('todos', []);
      setTodos(data);
    }
    
    loadTodos();
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

  // Add new todo
  const handleAddTodo = (e) => {
    e.preventDefault();
    
    if (!newTodo.trim()) return;
    
    const todo = {
      id: Date.now().toString(),
      text: newTodo,
      priority,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    const updatedTodos = [...todos, todo];
    setTodos(updatedTodos);
    saveData('todos', updatedTodos);
    setNewTodo('');
    setPriority('medium');
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
          </div>
        </div>
        
        <div className={styles.todoContent}>
          <form className={styles.addTodoForm} onSubmit={handleAddTodo}>
            <input 
              type="text"
              placeholder="Add a new task..."
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              className={styles.addTodoInput}
            />
            
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
            
            <button type="submit" className={styles.addTodoBtn}>
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
                      <div 
                        className={styles.todoPriority}
                        style={{ color: priorityInfo.color }}
                      >
                        {priorityInfo.label} Priority
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
    </Layout>
  );
} 