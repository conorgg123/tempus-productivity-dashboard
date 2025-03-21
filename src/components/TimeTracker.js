import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  Typography, 
  IconButton, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid 
} from '@mui/material';
import { 
  PlayArrow as PlayIcon, 
  Stop as StopIcon, 
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { format, differenceInSeconds } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { getItem, setItem } from '../utils/localStorage';

const ACTIVITY_CATEGORIES = [
  { id: 'focus', name: 'Focus', color: '#8a6fff' },
  { id: 'meetings', name: 'Meetings', color: '#4a9d9a' },
  { id: 'breaks', name: 'Breaks', color: '#ff6b6b' },
  { id: 'other', name: 'Other', color: '#a0a0a0' }
];

const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

export default function TimeTracker() {
  const [activities, setActivities] = useState([]);
  const [currentActivity, setCurrentActivity] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newActivity, setNewActivity] = useState({
    name: '',
    categoryId: 'focus',
    description: ''
  });
  
  // Load activities from localStorage
  useEffect(() => {
    const storedActivities = getItem('time-tracking-activities', []);
    const currentAct = getItem('current-activity', null);
    setActivities(storedActivities);
    
    if (currentAct) {
      setCurrentActivity(currentAct);
      // Calculate elapsed time since start
      const startTime = new Date(currentAct.startTime);
      const elapsed = differenceInSeconds(new Date(), startTime);
      setElapsedTime(elapsed);
    }
  }, []);
  
  // Timer effect for tracking elapsed time
  useEffect(() => {
    let timer;
    
    if (currentActivity) {
      timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentActivity]);
  
  // Start activity tracking
  const startActivity = (activity) => {
    const startTime = new Date();
    const updatedActivity = {
      ...activity,
      startTime: startTime.toISOString(),
      isActive: true
    };
    
    setCurrentActivity(updatedActivity);
    setElapsedTime(0);
    
    // Save to localStorage
    setItem('current-activity', updatedActivity);
  };
  
  // Stop activity tracking
  const stopActivity = () => {
    if (!currentActivity) return;
    
    const endTime = new Date();
    const startTime = new Date(currentActivity.startTime);
    const duration = differenceInSeconds(endTime, startTime);
    
    // Create a completed activity entry
    const completedActivity = {
      id: uuidv4(),
      name: currentActivity.name,
      categoryId: currentActivity.categoryId,
      description: currentActivity.description,
      startTime: currentActivity.startTime,
      endTime: endTime.toISOString(),
      duration
    };
    
    // Add to activities list and clear current activity
    const updatedActivities = [...activities, completedActivity];
    setActivities(updatedActivities);
    setCurrentActivity(null);
    setElapsedTime(0);
    
    // Save to localStorage
    setItem('time-tracking-activities', updatedActivities);
    setItem('current-activity', null);
  };
  
  // Handle dialog open and close
  const handleOpenDialog = () => {
    setDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setNewActivity({
      name: '',
      categoryId: 'focus',
      description: ''
    });
  };
  
  // Handle input changes for new activity
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewActivity(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Create and start new activity
  const handleCreateActivity = () => {
    const activity = {
      id: uuidv4(),
      ...newActivity
    };
    
    startActivity(activity);
    handleCloseDialog();
  };
  
  // Delete a tracked activity
  const handleDeleteActivity = (id) => {
    const updatedActivities = activities.filter(activity => activity.id !== id);
    setActivities(updatedActivities);
    setItem('time-tracking-activities', updatedActivities);
  };
  
  // Get today's activities
  const getTodayActivities = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return activities.filter(activity => {
      const activityDate = new Date(activity.startTime);
      activityDate.setHours(0, 0, 0, 0);
      return activityDate.getTime() === today.getTime();
    });
  };
  
  // Calculate total time spent today
  const getTotalTimeToday = () => {
    const todayActivities = getTodayActivities();
    return todayActivities.reduce((total, activity) => total + activity.duration, 0);
  };
  
  // Get color for a category
  const getCategoryColor = (categoryId) => {
    const category = ACTIVITY_CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.color : '#a0a0a0';
  };
  
  // Get name for a category
  const getCategoryName = (categoryId) => {
    const category = ACTIVITY_CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.name : 'Other';
  };
  
  // Format duration as "Xh Ym"
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };
  
  // Today's activities
  const todayActivities = getTodayActivities();
  const totalTimeToday = getTotalTimeToday();
  
  return (
    <Box>
      {/* Current Activity Tracker */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Time Tracker
          </Typography>
          
          {currentActivity ? (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box 
                  sx={{ 
                    width: 12, 
                    height: 12, 
                    borderRadius: '50%', 
                    bgcolor: getCategoryColor(currentActivity.categoryId),
                    mr: 1
                  }} 
                />
                <Typography variant="body1" sx={{ flexGrow: 1 }}>
                  {currentActivity.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {getCategoryName(currentActivity.categoryId)}
                </Typography>
              </Box>
              
              <Typography variant="h4" align="center" sx={{ my: 2 }}>
                {formatTime(elapsedTime)}
              </Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<StopIcon />}
                  onClick={stopActivity}
                  sx={{ width: 150 }}
                >
                  Stop
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Start tracking your time by creating a new activity.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleOpenDialog}
                  sx={{ width: 200 }}
                >
                  New Activity
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Today's Summary */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Today's Summary
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Total time today
              </Typography>
              <Typography variant="h5">
                {formatDuration(totalTimeToday)}
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Typography variant="body2" color="text.secondary">
                Activities
              </Typography>
              <Typography variant="h5">
                {todayActivities.length}
              </Typography>
            </Grid>
          </Grid>
          
          {/* Category breakdown */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              By category
            </Typography>
            
            {ACTIVITY_CATEGORIES.map(category => {
              const categoryActivities = todayActivities.filter(a => a.categoryId === category.id);
              const categoryTime = categoryActivities.reduce((total, a) => total + a.duration, 0);
              const percentage = totalTimeToday > 0 ? Math.round((categoryTime / totalTimeToday) * 100) : 0;
              
              return (
                <Box key={category.id} sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2">
                      {category.name}
                    </Typography>
                    <Typography variant="body2">
                      {formatDuration(categoryTime)} ({percentage}%)
                    </Typography>
                  </Box>
                  <Box sx={{ width: '100%', height: 6, bgcolor: '#e0e0e0', borderRadius: 3, overflow: 'hidden' }}>
                    <Box 
                      sx={{ 
                        height: '100%', 
                        width: `${percentage}%`, 
                        bgcolor: category.color,
                        borderRadius: 3
                      }} 
                    />
                  </Box>
                </Box>
              );
            })}
          </Box>
        </CardContent>
      </Card>
      
      {/* Recent Activities */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Recent Activities
          </Typography>
          
          {todayActivities.length > 0 ? (
            todayActivities.slice().reverse().map((activity) => (
              <Box 
                key={activity.id} 
                sx={{ 
                  p: 1.5, 
                  mb: 1, 
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <Box 
                  sx={{ 
                    width: 10, 
                    height: 10, 
                    borderRadius: '50%', 
                    bgcolor: getCategoryColor(activity.categoryId),
                    mr: 1.5
                  }} 
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {activity.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {format(new Date(activity.startTime), 'h:mm a')} - {format(new Date(activity.endTime), 'h:mm a')}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ mx: 1.5 }}>
                  {formatDuration(activity.duration)}
                </Typography>
                <IconButton 
                  size="small" 
                  onClick={() => handleDeleteActivity(activity.id)}
                  sx={{ color: 'text.secondary' }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            ))
          ) : (
            <Typography variant="body2" color="text.secondary">
              No activities tracked today. Start a new activity to begin tracking.
            </Typography>
          )}
        </CardContent>
      </Card>
      
      {/* New Activity Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="xs" fullWidth>
        <DialogTitle>Start New Activity</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Activity Name"
            type="text"
            fullWidth
            variant="outlined"
            value={newActivity.name}
            onChange={handleInputChange}
            sx={{ mb: 2, mt: 1 }}
          />
          
          <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              name="categoryId"
              value={newActivity.categoryId}
              onChange={handleInputChange}
              label="Category"
            >
              {ACTIVITY_CATEGORIES.map(category => (
                <MenuItem key={category.id} value={category.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box 
                      sx={{ 
                        width: 10, 
                        height: 10, 
                        borderRadius: '50%', 
                        bgcolor: category.color,
                        mr: 1
                      }} 
                    />
                    {category.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <TextField
            margin="dense"
            name="description"
            label="Description (optional)"
            type="text"
            fullWidth
            variant="outlined"
            multiline
            rows={2}
            value={newActivity.description}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button 
            onClick={handleCreateActivity} 
            variant="contained" 
            disabled={!newActivity.name}
            startIcon={<PlayIcon />}
          >
            Start
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
} 