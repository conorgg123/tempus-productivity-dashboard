import { useState, useEffect } from 'react';
import Head from 'next/head';
import Layout from '@/components/Layout';
import styles from '@/styles/YouTubeManager.module.css';
import { loadData, saveData } from '@/utils/storage';

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
  const [videoPreview, setVideoPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load data on component mount
  useEffect(() => {
    async function fetchData() {
      if (typeof window !== 'undefined') {
        // Load YouTube links
        const storedLinks = await loadData('youtube-links', { links: [] });
        setYoutubeLinks(storedLinks.links || []);
        
        // Load categories
        const storedCategories = await loadData('youtube-categories', { 
          categories: ["All", "Watch Later", "Educational", "Entertainment", "Music", "Coding", "Speech Tips"] 
        });
        setCategories(storedCategories.categories || []);
      }
    }
    
    fetchData();
  }, []);

  // Effect to handle URL changes and fetch video info
  useEffect(() => {
    const fetchVideoInfo = async () => {
      const url = newLinkData.url.trim();
      if (!url || !isValidYouTubeUrl(url)) {
        setVideoPreview(null);
        return;
      }

      setIsLoading(true);
      
      try {
        const videoId = extractYouTubeVideoId(url);
        if (!videoId) {
          setVideoPreview(null);
          setIsLoading(false);
          return;
        }

        // Get video metadata using YouTube oEmbed API
        const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`);
        if (response.ok) {
          const data = await response.json();
          setVideoPreview({
            id: videoId,
            title: data.title,
            author: data.author_name,
            thumbnailUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
          });
          
          // Auto-fill the title if it's empty
          if (!newLinkData.title) {
            setNewLinkData(prev => ({
              ...prev,
              title: data.title
            }));
          }
        } else {
          // If oEmbed fails (may be restricted video), still show basic preview
          setVideoPreview({
            id: videoId,
            title: 'Video title unavailable',
            author: 'Unknown',
            thumbnailUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
          });
        }
      } catch (error) {
        console.error('Error fetching video info:', error);
        const videoId = extractYouTubeVideoId(url);
        if (videoId) {
          setVideoPreview({
            id: videoId,
            title: 'Video title unavailable',
            thumbnailUrl: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Use a debounce to prevent too many requests while typing
    const handler = setTimeout(() => {
      if (newLinkData.url) {
        fetchVideoInfo();
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [newLinkData.url]);

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
    if (!title && videoPreview) {
      title = videoPreview.title;
    } else if (!title) {
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
    
    // Update state and storage
    const updatedLinks = [...youtubeLinks, newVideo];
    setYoutubeLinks(updatedLinks);
    saveData('youtube-links', { links: updatedLinks });
    
    // Reset form
    setNewLinkData({
      url: '',
      title: '',
      category: 'Watch Later'
    });
    setVideoPreview(null);
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
    saveData('youtube-categories', { categories: updatedCategories });
    
    setNewCategory('');
    setShowCategoryModal(false);
  };

  // Delete video
  const handleDeleteVideo = (index) => {
    if (confirm('Are you sure you want to delete this video?')) {
      const updatedLinks = [...youtubeLinks];
      updatedLinks.splice(index, 1);
      setYoutubeLinks(updatedLinks);
      saveData('youtube-links', { links: updatedLinks });
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
          <form onSubmit={handleAddVideo}>
            <div className={styles.formRow}>
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
            </div>
            
            {isLoading && (
              <div className={styles.loadingPreview}>
                <p>Loading preview...</p>
              </div>
            )}
            
            {videoPreview && !isLoading && (
              <div className={styles.videoPreviewContainer}>
                <div className={styles.videoPreview}>
                  <div className={styles.previewThumbnail}>
                    <img src={videoPreview.thumbnailUrl} alt={videoPreview.title} />
                    <div className={styles.previewPlayBtn}></div>
                  </div>
                  <div className={styles.previewInfo}>
                    <h4>{videoPreview.title}</h4>
                    {videoPreview.author && <p className={styles.previewAuthor}>{videoPreview.author}</p>}
                  </div>
                </div>
              </div>
            )}
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