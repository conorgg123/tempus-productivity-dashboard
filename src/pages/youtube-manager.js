import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  TextField,
  Button,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Grid,
  IconButton,
  Paper,
  InputAdornment,
  Divider,
  Alert
} from '@mui/material';
import { 
  YouTube as YouTubeIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  OpenInNew as OpenInNewIcon,
  Search as SearchIcon
} from '@mui/icons-material';
import { v4 as uuidv4 } from 'uuid';

// Utils
import { getItem, setItem } from '../utils/localStorage';

export default function YouTubeManager() {
  const [links, setLinks] = useState([]);
  const [newLink, setNewLink] = useState('');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Load links from localStorage
    const savedLinks = getItem('youtube-links', []);
    setLinks(savedLinks);
  }, []);

  const isValidYouTubeUrl = (url) => {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;
    return pattern.test(url);
  };

  const extractVideoId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleAddLink = () => {
    if (!newLink) {
      return;
    }

    if (!isValidYouTubeUrl(newLink)) {
      setError('Please enter a valid YouTube URL');
      return;
    }

    const videoId = extractVideoId(newLink);
    
    if (!videoId) {
      setError('Could not extract video ID from URL');
      return;
    }

    const newLinkItem = {
      id: uuidv4(),
      url: newLink,
      videoId,
      title: `YouTube Video ${links.length + 1}`, // Placeholder title
      createdAt: new Date().toISOString()
    };

    const updatedLinks = [...links, newLinkItem];
    setLinks(updatedLinks);
    setItem('youtube-links', updatedLinks);
    setNewLink('');
    setError('');
    
    // Show success message
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
    }, 3000);
  };

  const handleDeleteLink = (id) => {
    const updatedLinks = links.filter(link => link.id !== id);
    setLinks(updatedLinks);
    setItem('youtube-links', updatedLinks);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddLink();
    }
  };

  const filteredLinks = links.filter(link => {
    if (!search.trim()) return true;
    return link.title.toLowerCase().includes(search.toLowerCase()) || 
           link.url.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          YouTube Manager
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Save and organize your YouTube videos
        </Typography>
      </Box>

      {success && (
        <Alert severity="success" sx={{ mb: 4 }}>
          YouTube link added successfully
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ mb: 4, p: 3 }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            fullWidth
            variant="outlined"
            label="Add YouTube Link"
            placeholder="https://www.youtube.com/watch?v=..."
            value={newLink}
            onChange={(e) => setNewLink(e.target.value)}
            onKeyPress={handleKeyPress}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <YouTubeIcon color="error" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddLink}
            disableElevation
          >
            Add
          </Button>
        </Box>
      </Paper>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search videos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        <Typography variant="h6" sx={{ mb: 2 }}>
          {filteredLinks.length} {filteredLinks.length === 1 ? 'Video' : 'Videos'}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {filteredLinks.length === 0 ? (
          <Grid item xs={12}>
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography>
                No videos saved yet. Add your first YouTube link above.
              </Typography>
            </Paper>
          </Grid>
        ) : (
          filteredLinks.map(link => (
            <Grid item xs={12} sm={6} md={4} key={link.id}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={`https://img.youtube.com/vi/${link.videoId}/mqdefault.jpg`}
                  alt={link.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" gutterBottom noWrap>
                    {link.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {link.url}
                  </Typography>
                </CardContent>
                <Divider />
                <CardActions>
                  <Button 
                    size="small" 
                    startIcon={<OpenInNewIcon />}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open
                  </Button>
                  <IconButton 
                    aria-label="delete" 
                    size="small" 
                    onClick={() => handleDeleteLink(link.id)}
                    sx={{ marginLeft: 'auto' }}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Container>
  );
} 