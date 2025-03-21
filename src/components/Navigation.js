import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Box,
  Typography,
  useTheme,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Today as TodayIcon,
  Event as EventIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Timeline as TimelineIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon
} from '@mui/icons-material';

const drawerWidth = 240;

export default function Navigation({ darkMode, toggleDarkMode }) {
  const router = useRouter();
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
    { text: 'Daily Focus', icon: <TodayIcon />, path: '/daily-focus' },
    { text: 'Scheduler', icon: <EventIcon />, path: '/scheduler' },
    { text: 'Time Tracking', icon: <TimelineIcon />, path: '/time-tracking' },
    { text: 'Reminders', icon: <NotificationsIcon />, path: '/reminders' },
    { text: 'Settings', icon: <SettingsIcon />, path: '/settings' }
  ];

  const isActive = (path) => {
    if (path === '/' && router.pathname === '/') {
      return true;
    }
    return router.pathname === path;
  };

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        onClick={handleDrawerToggle}
        edge="start"
        sx={{
          marginRight: 2
        }}
      >
        <MenuIcon />
      </IconButton>
      <Drawer
        variant="temporary"
        open={open}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', p: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Productivity Dashboard
          </Typography>
          <IconButton onClick={handleDrawerToggle}>
            <ChevronLeftIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <Link href={item.path} key={item.text} passHref style={{ textDecoration: 'none', color: 'inherit' }}>
              <ListItem
                button
                onClick={handleDrawerToggle}
                sx={{
                  bgcolor: isActive(item.path) ? 'rgba(0, 0, 0, 0.08)' : 'transparent',
                  color: isActive(item.path) ? theme.palette.primary.main : 'inherit',
                  borderLeft: isActive(item.path) ? `4px solid ${theme.palette.primary.main}` : '4px solid transparent',
                }}
              >
                <ListItemIcon sx={{ color: isActive(item.path) ? theme.palette.primary.main : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            </Link>
          ))}
        </List>
        <Divider />
        <Box sx={{ p: 2 }}>
          <FormControlLabel
            control={
              <Switch 
                checked={darkMode} 
                onChange={toggleDarkMode}
                color="primary" 
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {darkMode ? <DarkModeIcon sx={{ mr: 1 }} /> : <LightModeIcon sx={{ mr: 1 }} />}
                <Typography>{darkMode ? 'Dark Mode' : 'Light Mode'}</Typography>
              </Box>
            }
          />
        </Box>
      </Drawer>
    </>
  );
} 