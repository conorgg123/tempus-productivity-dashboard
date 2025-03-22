import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import styles from '@/styles/YouTubeManager.module.css';

export default function YouTubeManager() {
  const [youtubeLinks, setYoutubeLinks] = useState([]);
  const [categories, setCategories] = useState([
    "All", "Watch Later", "Educational", "Entertainment", "Music", "Coding", "Speech Tips"
  ]);
  const [newLinkData, setNewLinkData] = useState({
    url: '',
    title: '',
    category: 'Watch Later'
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  // Load data on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Load from localStorage if available
      const storedLinks = localStorage.getItem('youtube-links');
      const storedCategories = localStorage.getItem('youtube-categories');
      
      if (storedLinks) {
        setYoutubeLinks(JSON.parse(storedLinks).links || []);
      } else {
        // Fetch default data
        fetch('/data/youtube_links.json')
          .then(response => response.json())
          .then(data => {
            setYoutubeLinks(data.links);
            localStorage.setItem('youtube-links', JSON.stringify(data));
          })
          .catch(error => console.error('Error loading YouTube links:', error));
      }
      
      if (storedCategories) {
        setCategories(JSON.parse(storedCategories).categories || []);
      } else {
        // Fetch default categories
        fetch('/data/youtube_categories.json')
          .then(response => response.json())
          .then(data => {
            setCategories(data.categories);
            localStorage.setItem('youtube-categories', JSON.stringify(data));
          })
          .catch(error => console.error('Error loading YouTube categories:', error));
      }
    }
  }, []);

  // Filter videos based on search and category
  const filteredVideos = youtubeLinks.filter(video => {
    const matchesSearch = !searchTerm || 
      video.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || 
      video.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Add new YouTube video
  const handleAddVideo = (e) => {
    e.preventDefault();
    
    if (!newLinkData.url) {
      alert('Please enter a YouTube URL');
      return;
    }
    
    if (!isValidYouTubeUrl(newLinkData.url)) {
      alert('Please enter a valid YouTube URL');
      return;
    }
    
    // If no title provided, use the video ID as a placeholder
    let title = newLinkData.title;
    if (!title) {
      const videoId = extractYouTubeVideoId(newLinkData.url);
      title = `YouTube Video: ${videoId}`;
    }
    
    // Create new video object
    const newVideo = {
      link: newLinkData.url,
      title: title,
      duration: '??:??',
      category: newLinkData.category,
      added_on: new Date().toISOString()
    };
    
    // Update state and localStorage
    const updatedLinks = [...youtubeLinks, newVideo];
    setYoutubeLinks(updatedLinks);
    localStorage.setItem('youtube-links', JSON.stringify({ links: updatedLinks }));
    
    // Reset form
    setNewLinkData({
      url: '',
      title: '',
      category: 'Watch Later'
    });
  };

  // Add new category
  const handleAddCategory = () => {
    if (!newCategory) {
      alert('Please enter a category name');
      return;
    }
    
    if (categories.includes(newCategory)) {
      alert('This category already exists');
      return;
    }
    
    const updatedCategories = [...categories, newCategory];
    setCategories(updatedCategories);
    localStorage.setItem('youtube-categories', JSON.stringify({ categories: updatedCategories }));
    
    setNewCategory('');
    setShowCategoryModal(false);
  };

  // Delete video
  const handleDeleteVideo = (index) => {
    if (confirm('Are you sure you want to delete this video?')) {
      const updatedLinks = [...youtubeLinks];
      updatedLinks.splice(index, 1);
      setYoutubeLinks(updatedLinks);
      localStorage.setItem('youtube-links', JSON.stringify({ links: updatedLinks }));
    }
  };

  // Helper functions
  function isValidYouTubeUrl(url) {
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})(.*)$/;
    return regex.test(url);
  }
  
  function extractYouTubeVideoId(url) {
    const regex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regex);
    return (match && match[2].length === 11) ? match[2] : null;
  }
  
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  return (
    <Layout>
      <Head>
        <title>YouTube Manager - Tempus Dashboard</title>
      </Head>
      
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <h2>YouTube Manager</h2>
          <p>Save and organize your YouTube videos</p>
        </div>
        <div className={styles.headerControls}>
          <input 
            type="text" 
            placeholder="Search videos..." 
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      <div className={styles.youtubeContainer}>
        <div className={styles.youtubeControls}>
          <div className={styles.categoryFilter}>
            <span>Filter by:</span>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.select}
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'All' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
          <button 
            className={styles.actionBtn}
            onClick={() => setShowCategoryModal(true)}
          >
            + Add Category
          </button>
        </div>
        
        <div className={styles.youtubeForm}>
          <h3>Add New Video</h3>
          <form onSubmit={handleAddVideo} className={styles.formRow}>
            <input 
              type="text" 
              placeholder="YouTube URL" 
              className={styles.formInput}
              value={newLinkData.url}
              onChange={(e) => setNewLinkData({...newLinkData, url: e.target.value})}
            />
            <input 
              type="text" 
              placeholder="Video title (optional)" 
              className={styles.formInput}
              value={newLinkData.title}
              onChange={(e) => setNewLinkData({...newLinkData, title: e.target.value})}
            />
            <select 
              className={styles.formInput}
              value={newLinkData.category}
              onChange={(e) => setNewLinkData({...newLinkData, category: e.target.value})}
            >
              {categories.filter(cat => cat !== 'All').map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <button type="submit" className={styles.primaryBtn}>Add Video</button>
          </form>
        </div>
        
        {filteredVideos.length > 0 ? (
          <div className={styles.youtubeGrid}>
            {filteredVideos.map((video, index) => {
              const videoId = extractYouTubeVideoId(video.link);
              const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
              
              return (
                <div key={index} className={styles.youtubeCard}>
                  <div className={styles.youtubeThumbnail}>
                    <img src={thumbnailUrl} alt={video.title} />
                    <div className={styles.youtubePlayBtn}></div>
                  </div>
                  <div className={styles.youtubeInfo}>
                    <h3 className={styles.youtubeTitle}>{video.title}</h3>
                    <div className={styles.youtubeMeta}>
                      <span>{formatDate(video.added_on)}</span>
                      <span>{video.duration}</span>
                    </div>
                    <div className={styles.youtubeCategory}>{video.category || 'Uncategorized'}</div>
                    <div className={styles.youtubeActions}>
                      <a 
                        href={video.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className={styles.youtubeBtn}
                      >
                        Open
                      </a>
                      <button 
                        className={styles.youtubeBtn}
                        onClick={() => handleDeleteVideo(index)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className={styles.youtubeEmpty}>
            <p>No videos found. Add some videos to get started!</p>
          </div>
        )}
      </div>
      
      {/* Category Modal */}
      {showCategoryModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h3>Add New Category</h3>
              <button 
                className={styles.modalClose}
                onClick={() => setShowCategoryModal(false)}
              >
                &times;
              </button>
            </div>
            <div className={styles.modalBody}>
              <input 
                type="text" 
                placeholder="Category name" 
                className={styles.formInput}
                style={{width: '100%'}}
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
            </div>
            <div className={styles.modalFooter}>
              <button 
                className={styles.actionBtn}
                onClick={() => setShowCategoryModal(false)}
              >
                Cancel
              </button>
              <button 
                className={styles.primaryBtn}
                onClick={handleAddCategory}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
} 