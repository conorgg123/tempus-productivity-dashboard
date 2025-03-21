import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper,
  Grid,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  ToggleButtonGroup,
  ToggleButton,
  Divider
} from '@mui/material';
import { 
  Add as AddIcon,
  Delete as DeleteIcon,
  CalendarMonth as CalendarMonthIcon,
  Event as EventIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ViewDay as ViewDayIcon,
  ViewWeek as ViewWeekIcon
} from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { 
  format, 
  startOfDay, 
  addDays, 
  getHours, 
  getMinutes, 
  parseISO, 
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay
} from 'date-fns';

// Utils
import { getItem, setItem } from '../utils/localStorage';

// Schedule hour range
const HOURS = Array.from({ length: 14 }, (_, i) => i + 8); // 8 AM to 9 PM

export default function Scheduler() {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [openDialog, setOpenDialog] = useState(false);
  const [view, setView] = useState('day'); // 'day' or 'week'
  
  // New event form state
  const [newEvent, setNewEvent] = useState({
    title: '',
    start: '',
    end: '',
    color: 'primary',
    description: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Load events from localStorage
    const savedEvents = getItem('scheduler-events', []);
    setEvents(savedEvents);
  }, []);

  const handlePrevDay = () => {
    setSelectedDate(prevDate => addDays(prevDate, -1));
  };

  const handleNextDay = () => {
    setSelectedDate(prevDate => addDays(prevDate, 1));
  };

  const handleViewChange = (_, newView) => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const handleDialogOpen = () => {
    // Default to current selected date with time set to next hour
    const now = new Date();
    const startHour = now.getHours() + 1;
    const endHour = startHour + 1;
    
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
    const formattedStartTime = `${String(startHour).padStart(2, '0')}:00`;
    const formattedEndTime = `${String(endHour).padStart(2, '0')}:00`;
    
    setNewEvent({
      title: '',
      start: `${formattedDate}T${formattedStartTime}`,
      end: `${formattedDate}T${formattedEndTime}`,
      color: 'primary',
      description: ''
    });
    
    setOpenDialog(true);
    setError('');
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEvent(prev => ({ ...prev, [name]: value }));
  };

  const handleAddEvent = () => {
    if (!newEvent.title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (!newEvent.start) {
      setError('Please select a start time');
      return;
    }

    if (!newEvent.end) {
      setError('Please select an end time');
      return;
    }

    // Validate start is before end
    const startTime = new Date(newEvent.start);
    const endTime = new Date(newEvent.end);

    if (startTime >= endTime) {
      setError('End time must be after start time');
      return;
    }

    const newEventItem = {
      id: uuidv4(),
      ...newEvent,
      createdAt: new Date().toISOString()
    };

    const updatedEvents = [...events, newEventItem];
    setEvents(updatedEvents);
    setItem('scheduler-events', updatedEvents);
    setOpenDialog(false);
    
    // Show success message
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  const handleDeleteEvent = (id) => {
    const updatedEvents = events.filter(event => event.id !== id);
    setEvents(updatedEvents);
    setItem('scheduler-events', updatedEvents);
  };

  // Helper to check if an event is on the selected date/day
  const isEventOnDate = (event, date) => {
    const eventStart = parseISO(event.start);
    return isSameDay(eventStart, date);
  };

  // Filter events for the selected date (day view)
  const filteredEvents = events.filter(event => isEventOnDate(event, selectedDate));

  // Get all dates for the week view
  const weekDates = view === 'week' ? 
    eachDayOfInterval({
      start: startOfWeek(selectedDate),
      end: endOfWeek(selectedDate)
    }) : [];

  // Helper to determine position and height of event in the timeline
  const getEventPosition = (event) => {
    const startTime = parseISO(event.start);
    const endTime = parseISO(event.end);
    
    const startHour = getHours(startTime) + getMinutes(startTime) / 60;
    const endHour = getHours(endTime) + getMinutes(endTime) / 60;
    
    // Calculate position relative to our HOURS range
    const top = ((startHour - HOURS[0]) / (HOURS.length)) * 100;
    const height = ((endHour - startHour) / (HOURS.length)) * 100;
    
    return { top: `${top}%`, height: `${height}%` };
  };

  // Get the color for an event
  const getEventColor = (color) => {
    switch (color) {
      case 'primary':
        return 'primary.main';
      case 'secondary':
        return 'secondary.main';
      case 'error':
        return 'error.main';
      case 'warning':
        return 'warning.main';
      case 'info':
        return 'info.main';
      case 'success':
        return 'success.main';
      default:
        return 'primary.main';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Scheduler
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your time efficiently
        </Typography>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 4 }}>
          Event added successfully
        </Alert>
      )}

      <Paper sx={{ p: 2, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={handlePrevDay}>
              <ChevronLeftIcon />
            </IconButton>
            <Typography variant="h6" sx={{ mx: 2 }}>
              {view === 'day' 
                ? format(selectedDate, 'MMMM d, yyyy') 
                : `${format(weekDates[0], 'MMM d')} - ${format(weekDates[6], 'MMM d, yyyy')}`}
            </Typography>
            <IconButton onClick={handleNextDay}>
              <ChevronRightIcon />
            </IconButton>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={handleViewChange}
              size="small"
            >
              <ToggleButton value="day">
                <ViewDayIcon fontSize="small" sx={{ mr: 1 }} />
                Day
              </ToggleButton>
              <ToggleButton value="week">
                <ViewWeekIcon fontSize="small" sx={{ mr: 1 }} />
                Week
              </ToggleButton>
            </ToggleButtonGroup>
            
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleDialogOpen}
              disableElevation
            >
              Add Event
            </Button>
          </Box>
        </Box>
      </Paper>

      {view === 'day' ? (
        // Day View
        <Paper sx={{ p: 0, height: '600px', position: 'relative' }}>
          {/* Time Slots */}
          {HOURS.map((hour, index) => (
            <Box
              key={hour}
              sx={{
                position: 'absolute',
                top: `${(index / HOURS.length) * 100}%`,
                left: 0,
                right: 0,
                height: `${(1 / HOURS.length) * 100}%`,
                borderTop: '1px solid',
                borderColor: 'divider',
                display: 'flex',
                alignItems: 'start',
                zIndex: 1,
              }}
            >
              <Typography
                variant="caption"
                sx={{
                  position: 'absolute',
                  top: '-10px',
                  left: '8px',
                  backgroundColor: 'background.paper',
                  px: 0.5,
                }}
              >
                {hour === 12 ? '12 PM' : hour < 12 ? `${hour} AM` : `${hour - 12} PM`}
              </Typography>
            </Box>
          ))}

          {/* Events */}
          {filteredEvents.map(event => (
            <Box
              key={event.id}
              sx={{
                position: 'absolute',
                ...getEventPosition(event),
                left: 60,
                right: 16,
                backgroundColor: getEventColor(event.color),
                color: 'white',
                borderRadius: 1,
                p: 1,
                overflow: 'hidden',
                zIndex: 2,
                opacity: 0.8,
                '&:hover': {
                  opacity: 1,
                  boxShadow: 2,
                },
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Typography variant="subtitle2" noWrap>
                  {event.title}
                </Typography>
                <IconButton 
                  size="small" 
                  sx={{ color: 'white', p: 0 }}
                  onClick={() => handleDeleteEvent(event.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
              {event.description && (
                <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }} noWrap>
                  {event.description}
                </Typography>
              )}
              <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                {format(parseISO(event.start), 'h:mm a')} - {format(parseISO(event.end), 'h:mm a')}
              </Typography>
            </Box>
          ))}
        </Paper>
      ) : (
        // Week View
        <Grid container spacing={1}>
          {weekDates.map(date => {
            const dateEvents = events.filter(event => isEventOnDate(event, date));
            
            return (
              <Grid item xs key={date.toISOString()}>
                <Card sx={{ height: '100%' }}>
                  <Box
                    sx={{
                      p: 1, 
                      backgroundColor: isSameDay(date, new Date()) ? 'primary.light' : 'grey.100',
                      color: isSameDay(date, new Date()) ? 'white' : 'text.primary',
                      textAlign: 'center'
                    }}
                  >
                    <Typography variant="subtitle2">
                      {format(date, 'E')}
                    </Typography>
                    <Typography variant="h6">
                      {format(date, 'd')}
                    </Typography>
                  </Box>
                  <CardContent sx={{ p: 1, height: '500px', overflow: 'auto' }}>
                    {dateEvents.length === 0 ? (
                      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
                        No events
                      </Typography>
                    ) : (
                      dateEvents.map(event => (
                        <Box
                          key={event.id}
                          sx={{
                            mb: 1,
                            p: 1,
                            borderLeft: '4px solid',
                            borderColor: getEventColor(event.color),
                            backgroundColor: 'background.default',
                            borderRadius: 1,
                            '&:hover': {
                              backgroundColor: 'action.hover',
                            },
                          }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Typography variant="subtitle2" noWrap>
                              {event.title}
                            </Typography>
                            <IconButton 
                              size="small" 
                              sx={{ p: 0 }}
                              onClick={() => handleDeleteEvent(event.id)}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Box>
                          <Typography variant="caption" sx={{ display: 'block' }}>
                            {format(parseISO(event.start), 'h:mm a')} - {format(parseISO(event.end), 'h:mm a')}
                          </Typography>
                        </Box>
                      ))
                    )}
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Add Event Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Event</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            name="title"
            label="Event Title"
            fullWidth
            variant="outlined"
            value={newEvent.title}
            onChange={handleInputChange}
            sx={{ mb: 2 }}
          />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="start"
                label="Start Time"
                type="datetime-local"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={newEvent.start}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                name="end"
                label="End Time"
                type="datetime-local"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={newEvent.end}
                onChange={handleInputChange}
              />
            </Grid>
          </Grid>
          
          <FormControl fullWidth margin="dense" variant="outlined">
            <InputLabel>Color</InputLabel>
            <Select
              name="color"
              value={newEvent.color}
              onChange={handleInputChange}
              label="Color"
            >
              <MenuItem value="primary">Blue</MenuItem>
              <MenuItem value="secondary">Pink</MenuItem>
              <MenuItem value="error">Red</MenuItem>
              <MenuItem value="warning">Orange</MenuItem>
              <MenuItem value="info">Light Blue</MenuItem>
              <MenuItem value="success">Green</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            margin="dense"
            name="description"
            label="Description (optional)"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={newEvent.description}
            onChange={handleInputChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleAddEvent} variant="contained" disableElevation>Add</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 