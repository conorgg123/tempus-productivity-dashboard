/**
 * YouTubeManager Class
 * Handles the management of YouTube links including adding, deleting, and storing links
 */
class YouTubeManager {
    constructor() {
        this.links = [];
        this.loadLinks();
    }

    /**
     * Load links from localStorage
     */
    loadLinks() {
        try {
            const savedLinks = JSON.parse(localStorage.getItem('youtube-links')) || [];
            this.links = savedLinks;
        } catch (error) {
            console.error('Error loading YouTube links:', error);
            this.links = [];
        }
    }

    /**
     * Save links to localStorage
     */
    saveLinks() {
        localStorage.setItem('youtube-links', JSON.stringify(this.links));
    }

    /**
     * Check if a URL is a valid YouTube URL
     * @param {string} url - The URL to validate
     * @returns {boolean} - Whether the URL is valid
     */
    isValidYouTubeUrl(url) {
        const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})$/;
        return pattern.test(url);
    }

    /**
     * Extract the video ID from a YouTube URL
     * @param {string} url - The YouTube URL
     * @returns {string|null} - The video ID or null if not found
     */
    extractVideoId(url) {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }

    /**
     * Add a new YouTube link
     * @param {string} url - The YouTube URL to add
     * @returns {object} - Result object with success status and message
     */
    addLink(url) {
        if (!url) {
            return { success: false, message: 'Please enter a YouTube URL' };
        }

        if (!this.isValidYouTubeUrl(url)) {
            return { success: false, message: 'Please enter a valid YouTube URL' };
        }

        const videoId = this.extractVideoId(url);
        
        if (!videoId) {
            return { success: false, message: 'Could not extract video ID from URL' };
        }

        const newLink = {
            id: Date.now().toString(),
            url: url,
            videoId: videoId,
            title: `YouTube Video ${this.links.length + 1}`,
            createdAt: new Date().toISOString()
        };

        this.links.push(newLink);
        this.saveLinks();
        
        return { success: true, message: 'YouTube link added successfully' };
    }

    /**
     * Delete a YouTube link by ID
     * @param {string} id - The ID of the link to delete
     */
    deleteLink(id) {
        this.links = this.links.filter(link => link.id !== id);
        this.saveLinks();
    }

    /**
     * Get all YouTube links
     * @returns {Array} - Array of YouTube links
     */
    getLinks() {
        return this.links;
    }

    /**
     * Search for YouTube links
     * @param {string} query - The search query
     * @returns {Array} - Array of matching YouTube links
     */
    searchLinks(query) {
        if (!query) {
            return this.links;
        }
        
        const lowerQuery = query.toLowerCase();
        return this.links.filter(link => 
            link.title.toLowerCase().includes(lowerQuery) ||
            link.url.toLowerCase().includes(lowerQuery)
        );
    }
}

export default YouTubeManager; 