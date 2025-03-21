import React, { useState, useEffect } from 'react';
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

// Utils
import { getItem, setItem } from '../utils/localStorage';

export default function DailyFocus() {
  const [dailyFocus, setDailyFocus] = useState({ date: '', tasks: [] });
  const [newTask, setNewTask] = useState('');
  const [progress, setProgress] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Load daily focus from localStorage
    const savedDailyFocus = getItem('daily-focus', { date: '', tasks: [] });
    
    // Check if the saved daily focus is for today
    const today = format(new Date(), 'yyyy-MM-dd');
    
    if (savedDailyFocus.date === today) {
      setDailyFocus(savedDailyFocus);
    } else {
      // Create a new daily focus for today
      const newDailyFocus = {
        date: today,
        tasks: []
      };
      setDailyFocus(newDailyFocus);
      setItem('daily-focus', newDailyFocus);
    }
  }, []);

  useEffect(() => {
    // Calculate progress whenever tasks change
    if (dailyFocus.tasks.length === 0) {
      setProgress(0);
    } else {
      const completedTasks = dailyFocus.tasks.filter(task => task.completed);
      setProgress(Math.round((completedTasks.length / dailyFocus.tasks.length) * 100));
    }
  }, [dailyFocus.tasks]);

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    
    const newTaskItem = {
      id: uuidv4(),
      text: newTask,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    const updatedTasks = [...dailyFocus.tasks, newTaskItem];
    const updatedDailyFocus = { ...dailyFocus, tasks: updatedTasks };
    
    setDailyFocus(updatedDailyFocus);
    setItem('daily-focus', updatedDailyFocus);
    setNewTask('');
    
    // Show success message
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  const handleToggleTask = (id) => {
    const updatedTasks = dailyFocus.tasks.map(task => 
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    
    const updatedDailyFocus = { ...dailyFocus, tasks: updatedTasks };
    setDailyFocus(updatedDailyFocus);
    setItem('daily-focus', updatedDailyFocus);
  };

  const handleDeleteTask = (id) => {
    const updatedTasks = dailyFocus.tasks.filter(task => task.id !== id);
    const updatedDailyFocus = { ...dailyFocus, tasks: updatedTasks };
    
    setDailyFocus(updatedDailyFocus);
    setItem('daily-focus', updatedDailyFocus);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTask();
    }
  };

  const handleResetFocus = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    const newDailyFocus = {
      date: today,
      tasks: []
    };
    
    setDailyFocus(newDailyFocus);
    setItem('daily-focus', newDailyFocus);
    setOpenDialog(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Daily Focus
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Today is {format(new Date(), 'MMMM d, yyyy')}
        </Typography>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 4 }}>
          Task added successfully
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                  <Typography variant="h6">Today's Progress</Typography>
                </Box>
                <Box>
                  <Button 
                    variant="outlined" 
                    size="small" 
                    onClick={() => setOpenDialog(true)}
                  >
                    Reset
                  </Button>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Box sx={{ width: '100%', mr: 1 }}>
                  <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5 }} />
                </Box>
                <Box sx={{ minWidth: 35 }}>
                  <Typography variant="body2" color="text.secondary">{`${progress}%`}</Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {dailyFocus.tasks.filter(task => task.completed).length} of {dailyFocus.tasks.length} tasks completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Add Task
              </Typography>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="What do you want to focus on today?"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddTask}
                  disabled={!newTask.trim()}
                  disableElevation
                >
                  Add
                </Button>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Typography variant="h6" gutterBottom>
              Today's Tasks
            </Typography>

            <List>
              {dailyFocus.tasks.length === 0 ? (
                <ListItem>
                  <ListItemText 
                    primary="No tasks for today" 
                    secondary="Add tasks to track your daily focus" 
                    sx={{ textAlign: 'center', py: 4 }}
                  />
                </ListItem>
              ) : (
                dailyFocus.tasks.map((task, index) => (
                  <React.Fragment key={task.id}>
                    {index > 0 && <Divider />}
                    <ListItem
                      secondaryAction={
                        <IconButton 
                          edge="end" 
                          aria-label="delete" 
                          onClick={() => handleDeleteTask(task.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemIcon>
                        <Checkbox
                          edge="start"
                          checked={task.completed}
                          onChange={() => handleToggleTask(task.id)}
                          disableRipple
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={task.text}
                        sx={{
                          textDecoration: task.completed ? 'line-through' : 'none',
                          color: task.completed ? 'text.secondary' : 'text.primary',
                        }}
                      />
                    </ListItem>
                  </React.Fragment>
                ))
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* Reset Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Reset Daily Focus</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to reset your daily focus? This will remove all tasks for today.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleResetFocus} color="error">Reset</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 