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

// Utils
import { getItem, setItem } from '../utils/localStorage';

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [priority, setPriority] = useState('medium');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    // Load todos from localStorage
    const savedTodos = getItem('todos', []);
    setTodos(savedTodos);
  }, []);

  useEffect(() => {
    // Save todos to localStorage whenever they change
    setItem('todos', todos);
  }, [todos]);

  const handleAddTodo = () => {
    if (newTodo.trim() === '') return;
    
    const newTodoItem = {
      id: uuidv4(),
      text: newTodo,
      completed: false,
      priority,
      createdAt: new Date().toISOString()
    };
    
    setTodos([...todos, newTodoItem]);
    setNewTodo('');
    setPriority('medium');
  };

  const handleToggleTodo = (id) => {
    setTodos(
      todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTodo();
    }
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === 'all') return true;
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error.main';
      case 'medium':
        return 'warning.main';
      case 'low':
        return 'success.main';
      default:
        return 'text.secondary';
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          To-Do List
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your tasks and stay organized
        </Typography>
      </Box>

      <Paper sx={{ mb: 4, p: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Add a new task"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority}
              label="Priority"
              onChange={(e) => setPriority(e.target.value)}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddTodo}
            disableElevation
          >
            Add
          </Button>
        </Box>
      </Paper>

      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">
          {filteredTodos.length} {filteredTodos.length === 1 ? 'Task' : 'Tasks'}
        </Typography>
        <ButtonGroup variant="outlined" size="small">
          <Button 
            onClick={() => setFilter('all')}
            variant={filter === 'all' ? 'contained' : 'outlined'}
          >
            All
          </Button>
          <Button 
            onClick={() => setFilter('active')}
            variant={filter === 'active' ? 'contained' : 'outlined'}
          >
            Active
          </Button>
          <Button 
            onClick={() => setFilter('completed')}
            variant={filter === 'completed' ? 'contained' : 'outlined'}
          >
            Completed
          </Button>
        </ButtonGroup>
      </Box>

      <Paper>
        <List>
          {filteredTodos.length === 0 ? (
            <ListItem>
              <ListItemText 
                primary="No tasks to display" 
                secondary="Add a new task to get started" 
                sx={{ textAlign: 'center', py: 4 }}
              />
            </ListItem>
          ) : (
            filteredTodos.map((todo, index) => (
              <React.Fragment key={todo.id}>
                {index > 0 && <Divider />}
                <ListItem
                  disablePadding
                  secondaryAction={
                    <IconButton 
                      edge="end" 
                      aria-label="delete" 
                      onClick={() => handleDeleteTodo(todo.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemButton role={undefined} onClick={() => handleToggleTodo(todo.id)} dense>
                    <ListItemIcon>
                      <Checkbox
                        edge="start"
                        checked={todo.completed}
                        disableRipple
                      />
                    </ListItemIcon>
                    <ListItemText
                      primary={todo.text}
                      secondary={
                        <Typography 
                          component="span" 
                          variant="body2" 
                          color={getPriorityColor(todo.priority)}
                        >
                          {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)} Priority
                        </Typography>
                      }
                      sx={{
                        textDecoration: todo.completed ? 'line-through' : 'none',
                        color: todo.completed ? 'text.secondary' : 'text.primary',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </React.Fragment>
            ))
          )}
        </List>
      </Paper>
    </Container>
  );
} 