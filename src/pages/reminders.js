import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  Paper,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  ListItemSecondaryAction,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import { 
  Notifications as NotificationsIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Event as EventIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';
import { format, parseISO, isValid, isPast } from 'date-fns';

// Utils
import { getItem, setItem } from '../utils/localStorage';

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [priority, setPriority] = useState('medium');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [notificationsSupported, setNotificationsSupported] = useState(false);

  useEffect(() => {
    // Load reminders from localStorage
    const savedReminders = getItem('reminders', []);
    setReminders(savedReminders);

    // Check if browser supports notifications
    setNotificationsSupported('Notification' in window);
    
    // If notifications are supported and not granted, request permission
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      Notification.requestPermission();
    }
  }, []);

  const handleAddReminder = () => {
    if (!title.trim()) {
      setError('Please enter a title');
      return;
    }

    if (!date) {
      setError('Please select a date');
      return;
    }

    if (!time) {
      setError('Please select a time');
      return;
    }

    // Combine date and time into ISO string
    const dateTimeStr = `${date}T${time}:00`;
    const dateTime = new Date(dateTimeStr);

    if (!isValid(dateTime)) {
      setError('Invalid date or time');
      return;
    }

    if (isPast(dateTime)) {
      setError('Please select a future date and time');
      return;
    }

    const newReminder = {
      id: uuidv4(),
      title,
      dateTime: dateTime.toISOString(),
      priority,
      notes,
      completed: false,
      createdAt: new Date().toISOString()
    };

    const updatedReminders = [...reminders, newReminder];
    setReminders(updatedReminders);
    setItem('reminders', updatedReminders);
    
    // Reset form
    setTitle('');
    setDate('');
    setTime('');
    setPriority('medium');
    setNotes('');
    setError('');
    setOpenDialog(false);
    
    // Show success message
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  const handleToggleReminder = (id) => {
    const updatedReminders = reminders.map(reminder => 
      reminder.id === id ? { ...reminder, completed: !reminder.completed } : reminder
    );
    setReminders(updatedReminders);
    setItem('reminders', updatedReminders);
  };

  const handleDeleteReminder = (id) => {
    const updatedReminders = reminders.filter(reminder => reminder.id !== id);
    setReminders(updatedReminders);
    setItem('reminders', updatedReminders);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setError('');
  };

  // Sort reminders by date (newest first)
  const sortedReminders = [...reminders].sort((a, b) => {
    return new Date(a.dateTime) - new Date(b.dateTime);
  });

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Reminders
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Never forget important tasks and events
        </Typography>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 4 }}>
          Reminder added successfully
        </Alert>
      )}

      {!notificationsSupported && (
        <Alert severity="warning" sx={{ mb: 4 }}>
          Your browser doesn't support notifications. You won't receive alerts for your reminders.
        </Alert>
      )}

      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpenDialog(true)}
          disableElevation
        >
          Add Reminder
        </Button>
      </Box>

      <Paper>
        <List>
          {sortedReminders.length === 0 ? (
            <ListItem>
              <ListItemText 
                primary="No reminders to display" 
                secondary="Add a new reminder to get started" 
                sx={{ textAlign: 'center', py: 4 }}
              />
            </ListItem>
          ) : (
            sortedReminders.map((reminder, index) => (
              <React.Fragment key={reminder.id}>
                {index > 0 && <Divider />}
                <ListItem 
                  alignItems="flex-start"
                  sx={{
                    backgroundColor: reminder.completed ? 'action.hover' : 'transparent'
                  }}
                >
                  <ListItemIcon>
                    <Checkbox
                      edge="start"
                      checked={reminder.completed}
                      onChange={() => handleToggleReminder(reminder.id)}
                      disableRipple
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography
                        variant="subtitle1"
                        component="span"
                        sx={{
                          textDecoration: reminder.completed ? 'line-through' : 'none',
                          color: reminder.completed ? 'text.secondary' : 'text.primary',
                        }}
                      >
                        {reminder.title}
                      </Typography>
                    }
                    secondary={
                      <React.Fragment>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <EventIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" component="span" color="text.secondary">
                            {format(parseISO(reminder.dateTime), 'MMM dd, yyyy')}
                          </Typography>
                          <AccessTimeIcon fontSize="small" sx={{ ml: 2, mr: 1, color: 'text.secondary' }} />
                          <Typography variant="body2" component="span" color="text.secondary">
                            {format(parseISO(reminder.dateTime), 'h:mm a')}
                          </Typography>
                        </Box>
                        {reminder.notes && (
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'text.secondary',
                              mt: 1,
                              fontStyle: 'italic'
                            }}
                          >
                            {reminder.notes}
                          </Typography>
                        )}
                        <Box sx={{ mt: 1 }}>
                          <Chip 
                            size="small" 
                            label={`${reminder.priority.charAt(0).toUpperCase() + reminder.priority.slice(1)} Priority`}
                            color={getPriorityColor(reminder.priority)}
                            variant="outlined"
                          />
                        </Box>
                      </React.Fragment>
                    }
                  />
                  <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={() => handleDeleteReminder(reminder.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </React.Fragment>
            ))
          )}
        </List>
      </Paper>

      {/* Add Reminder Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Reminder</DialogTitle>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Date"
                type="date"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                label="Time"
                type="time"
                fullWidth
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </Grid>
          </Grid>
          <FormControl fullWidth margin="dense" variant="outlined">
            <InputLabel>Priority</InputLabel>
            <Select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              label="Priority"
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Notes (optional)"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleAddReminder} variant="contained" disableElevation>Add</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
} 