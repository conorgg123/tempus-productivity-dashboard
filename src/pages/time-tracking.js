import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Grid, 
  Paper, 
  IconButton,
  Card,
  CardContent,
  Tabs,
  Tab,
  Divider,
  useTheme
} from '@mui/material';
import { 
  Timeline as TimelineIcon,
  AccessTime as AccessTimeIcon,
  BarChart as BarChartIcon,
  MoreVert as MoreVertIcon,
  Today as TodayIcon,
  NavigateBefore as PrevIcon,
  NavigateNext as NextIcon
} from '@mui/icons-material';
import { format, addDays, subDays, startOfWeek, addWeeks, subWeeks } from 'date-fns';
import TimeTracker from '../components/TimeTracker';
import { getItem } from '../utils/localStorage';

export default function TimeTracking() {
  const theme = useTheme();
  const [view, setView] = useState('day');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activities, setActivities] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    const storedActivities = getItem('time-tracking-activities', []);
    setActivities(storedActivities);
  }, []);
  
  // Handle date navigation
  const handlePrevious = () => {
    if (view === 'day') {
      setSelectedDate(prev => subDays(prev, 1));
    } else {
      setSelectedDate(prev => subWeeks(prev, 1));
    }
  };
  
  const handleNext = () => {
    if (view === 'day') {
      setSelectedDate(prev => addDays(prev, 1));
    } else {
      setSelectedDate(prev => addWeeks(prev, 1));
    }
  };
  
  const handleViewChange = (event, newValue) => {
    setTabValue(newValue);
    setView(newValue === 0 ? 'day' : 'week');
  };
  
  // Get activities for the selected day
  const getDayActivities = () => {
    const day = new Date(selectedDate);
    day.setHours(0, 0, 0, 0);
    
    return activities.filter(activity => {
      const activityDate = new Date(activity.startTime);
      activityDate.setHours(0, 0, 0, 0);
      return activityDate.getTime() === day.getTime();
    });
  };
  
  // Get activities for the selected week
  const getWeekActivities = () => {
    const weekStart = startOfWeek(selectedDate);
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = addDays(weekStart, 7);
    
    return activities.filter(activity => {
      const activityDate = new Date(activity.startTime);
      return activityDate >= weekStart && activityDate < weekEnd;
    });
  };
  
  // Generate timeline data 
  const getTimelineData = () => {
    const dayActivities = getDayActivities();
    const timeBlocks = Array(24).fill().map((_, hour) => {
      const hoursActivities = dayActivities.filter(activity => {
        const startHour = new Date(activity.startTime).getHours();
        const endHour = new Date(activity.endTime).getHours();
        return startHour <= hour && endHour >= hour;
      });
      
      return {
        hour,
        activities: hoursActivities
      };
    });
    
    return timeBlocks;
  };
  
  const timelineData = getTimelineData();
  const dayActivities = getDayActivities();
  const weekActivities = getWeekActivities();
  
  // Calculate total time tracked
  const getTotalTime = (acts) => {
    return acts.reduce((total, activity) => total + activity.duration, 0);
  };
  
  // Format date for display
  const formatDateTitle = () => {
    if (view === 'day') {
      return format(selectedDate, 'EEEE, MMMM d, yyyy');
    } else {
      const weekStart = startOfWeek(selectedDate);
      const weekEnd = addDays(weekStart, 6);
      return `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`;
    }
  };
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        <TimelineIcon sx={{ mr: 1, verticalAlign: 'bottom' }} />
        Time Tracking
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          {/* Date navigation and view selector */}
          <Paper sx={{ p: 2, mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <IconButton onClick={handlePrevious}>
              <PrevIcon />
            </IconButton>
            
            <Typography variant="h6" component="div">
              {formatDateTitle()}
            </Typography>
            
            <IconButton onClick={handleNext} disabled={format(selectedDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd') && view === 'day'}>
              <NextIcon />
            </IconButton>
          </Paper>
          
          {/* View tabs */}
          <Paper sx={{ mb: 3 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleViewChange} 
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Day View" icon={<TodayIcon />} />
              <Tab label="Week View" icon={<BarChartIcon />} />
            </Tabs>
          </Paper>
          
          {/* Timeline visualization */}
          <Paper sx={{ p: 2, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Activity Timeline
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            {view === 'day' ? (
              // Day timeline visualization
              <Box sx={{ height: 600, overflowY: 'auto' }}>
                {timelineData.map((block, index) => (
                  <Box 
                    key={index}
                    sx={{ 
                      display: 'flex',
                      borderBottom: index < 23 ? `1px solid ${theme.palette.divider}` : 'none'
                    }}
                  >
                    <Box 
                      sx={{ 
                        width: 60, 
                        py: 1,
                        pr: 2,
                        textAlign: 'right',
                        color: 'text.secondary',
                        fontSize: '0.875rem',
                        fontWeight: 'medium'
                      }}
                    >
                      {block.hour === 0 ? '12 AM' : 
                       block.hour < 12 ? `${block.hour} AM` : 
                       block.hour === 12 ? '12 PM' : 
                       `${block.hour - 12} PM`}
                    </Box>
                    
                    <Box sx={{ flexGrow: 1, position: 'relative', height: 50, py: 0.5 }}>
                      {block.activities.map((activity) => {
                        const startMins = new Date(activity.startTime).getMinutes();
                        const endMins = new Date(activity.endTime).getMinutes();
                        const startHour = new Date(activity.startTime).getHours();
                        const endHour = new Date(activity.endTime).getHours();
                        
                        // Only show in this hour slot if this is the start hour
                        if (startHour !== block.hour) return null;
                        
                        const category = ['focus', 'meetings', 'breaks', 'other'].find(cat => 
                          cat === activity.categoryId
                        ) || 'other';
                        
                        const colors = {
                          focus: '#8a6fff',
                          meetings: '#4a9d9a',
                          breaks: '#ff6b6b',
                          other: '#a0a0a0'
                        };
                        
                        return (
                          <Box 
                            key={activity.id}
                            sx={{ 
                              position: 'absolute',
                              left: `${(startMins / 60) * 100}%`,
                              width: `${((endHour - startHour) * 60 + endMins - startMins) / 60 * 100}%`,
                              maxWidth: '100%',
                              height: 40,
                              bgcolor: colors[category],
                              color: 'white',
                              borderRadius: 1,
                              px: 1,
                              py: 0.5,
                              fontSize: '0.75rem',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            {activity.name}
                          </Box>
                        );
                      })}
                    </Box>
                  </Box>
                ))}
              </Box>
            ) : (
              // Week summary visualization
              <Box sx={{ height: 400 }}>
                <Typography align="center" color="text.secondary" sx={{ py: 10 }}>
                  Weekly visualization coming soon...
                </Typography>
              </Box>
            )}
          </Paper>
          
          {/* Statistics */}
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Total Time
                  </Typography>
                  <Typography variant="h4">
                    {Math.floor(getTotalTime(view === 'day' ? dayActivities : weekActivities) / 3600)}h {Math.floor((getTotalTime(view === 'day' ? dayActivities : weekActivities) % 3600) / 60)}m
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {view === 'day' ? 'tracked today' : 'tracked this week'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Activities
                  </Typography>
                  <Typography variant="h4">
                    {(view === 'day' ? dayActivities : weekActivities).length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {view === 'day' ? 'completed today' : 'completed this week'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
        
        <Grid item xs={12} md={4}>
          {/* Time Tracker Component */}
          <TimeTracker />
        </Grid>
      </Grid>
    </Container>
  );
} 