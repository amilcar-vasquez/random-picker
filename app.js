// DOM Elements
const posterImage = document.getElementById('posterImage');
const posterQuote = document.getElementById('posterQuote');
const generateBtn = document.getElementById('generateBtn');
const statusDiv = document.getElementById('status');

// API Endpoints
const IMAGE_API = 'https://picsum.photos/800/600';

// Backup quotes array for random selection
const BACKUP_QUOTES = [
    { content: "The Lord is my shepherd; I shall not want.", author: "David (Psalm 23:1)" },
    { content: "Trust in the Lord with all thine heart; and lean not unto thine own understanding.", author: "Solomon (Proverbs 3:5)" },
    { content: "For I know the thoughts that I think toward you, saith the Lord, thoughts of peace, and not of evil, to give you an expected end.", author: "Jeremiah (Jeremiah 29:11)" },
    { content: "I can do all things through Christ which strengtheneth me.", author: "Paul (Philippians 4:13)" },
    { content: "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the Lord thy God is with thee whithersoever thou goest.", author: "Joshua (Joshua 1:9)" },
    { content: "Thou shalt love thy neighbour as thyself.", author: "Jesus (Matthew 22:39)" },
    { content: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.", author: "Jesus (John 3:16)" },
    { content: "But they that wait upon the Lord shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.", author: "Isaiah (Isaiah 40:31)" },
    { content: "The fruit of the Spirit is love, joy, peace, longsuffering, gentleness, goodness, faith.", author: "Paul (Galatians 5:22)" },
    { content: "Create in me a clean heart, O God; and renew a right spirit within me.", author: "David (Psalm 51:10)" },
    { content: "Ask, and it shall be given you; seek, and ye shall find; knock, and it shall be opened unto you.", author: "Jesus (Matthew 7:7)" },
    { content: "Casting all your care upon him; for he careth for you.", author: "Peter (1 Peter 5:7)" }
];

// Default fallback content
const DEFAULT_IMAGE = 'https://picsum.photos/800/600';
const DEFAULT_QUOTE = '"The only way to do great work is to love what you do." — Steve Jobs';

/**
 * Updates the status message with appropriate styling
 * @param {string} message - The status message to display
 * @param {string} type - The type of status: 'loading', 'success', or 'error'
 */
function updateStatus(message, type = '') {
  statusDiv.textContent = message;
  statusDiv.className = type;
}

/**
 * Fetches a random image from Lorem Picsum
 * @returns {Promise<string>} The image URL
 */
async function fetchRandomImage() {
  // Add timestamp to force new random image each time
  const timestamp = new Date().getTime();
  return `${IMAGE_API}?random=${timestamp}`;
}

/**
 * Gets a random quote from backup quotes array
 * @returns {object} Quote object with content and author
 */
function getRandomBackupQuote() {
  const randomIndex = Math.floor(Math.random() * BACKUP_QUOTES.length);
  return BACKUP_QUOTES[randomIndex];
}

/**
 * Fetches quotes from ZenQuotes API using CORS proxy and caches them
 * Returns a random quote from cache or fetches new batch if cache is empty
 * @returns {Promise<string>} Formatted quote with author
 */
let quotesCache = [];
let lastFetchTime = 0;
const CACHE_DURATION = 3600000; // 1 hour in milliseconds

async function fetchRandomQuote() {
  const now = Date.now();
  
  // Check if we need to refresh the cache (empty or expired)
  if (quotesCache.length === 0 || (now - lastFetchTime) > CACHE_DURATION) {
    try {
      console.log('Fetching fresh quotes from ZenQuotes API...');
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      
      // Use corsproxy.io as CORS proxy (free, no registration needed)
      const proxyUrl = 'https://corsproxy.io/?';
      const apiUrl = 'https://zenquotes.io/api/quotes';
      
      const response = await fetch(proxyUrl + apiUrl, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API returned ${response.status}`);
      }
      
      const data = await response.json();
      
      // Cache the quotes
      quotesCache = data.map(item => ({
        content: item.q,
        author: item.a
      }));
      
      lastFetchTime = now;
      console.log(`✓ Cached ${quotesCache.length} quotes from ZenQuotes API`);
      
    } catch (error) {
      console.warn('ZenQuotes API failed, using backup quotes:', error.message);
      // Fall back to backup quotes if API fails
      if (quotesCache.length === 0) {
        quotesCache = BACKUP_QUOTES;
        console.log('Using backup quotes collection');
      }
    }
  }
  
  // Return a random quote from cache
  const randomIndex = Math.floor(Math.random() * quotesCache.length);
  const quote = quotesCache[randomIndex];
  return `"${quote.content}" — ${quote.author}`;
}

/**
 * Updates the poster with new image and quote
 * Handles partial failures gracefully
 */
async function generateNewPoster() {
  // Disable button during fetch
  generateBtn.disabled = true;
  updateStatus('Loading new content...', 'loading');
  
  // Add loading effect to image
  posterImage.classList.add('loading');
  
  let imageUrl = posterImage.src; // Keep current image as fallback
  let quoteText = posterQuote.textContent; // Keep current quote as fallback
  let imageSuccess = false;
  let quoteSuccess = false;
  
  try {
    // Fetch both APIs simultaneously for better performance
    const [imageResult, quoteResult] = await Promise.allSettled([
      fetchRandomImage(),
      fetchRandomQuote()
    ]);
    
    // Handle image result
    if (imageResult.status === 'fulfilled') {
      imageUrl = imageResult.value;
      imageSuccess = true;
    } else {
      console.error('Image fetch failed:', imageResult.reason);
    }
    
    // Handle quote result
    if (quoteResult.status === 'fulfilled') {
      quoteText = quoteResult.value;
      quoteSuccess = true;
    } else {
      console.error('Quote fetch failed:', quoteResult.reason);
      console.error('Error details:', {
        message: quoteResult.reason?.message,
        name: quoteResult.reason?.name,
        stack: quoteResult.reason?.stack
      });
    }
    
    // Update UI with successful results
    if (imageSuccess) {
      posterImage.src = imageUrl;
    }
    
    if (quoteSuccess) {
      posterQuote.textContent = quoteText;
    }
    
    // Update status based on results
    if (imageSuccess && quoteSuccess) {
      updateStatus('✓ Poster updated successfully!', 'success');
      setTimeout(() => updateStatus('', ''), 3000);
    } else if (imageSuccess || quoteSuccess) {
      const failed = !imageSuccess ? 'image' : 'quote';
      updateStatus(`⚠ ${failed} fetch failed, kept previous ${failed}`, 'error');
      setTimeout(() => updateStatus('', ''), 4000);
    } else {
      updateStatus('✗ Failed to fetch new content. Please try again.', 'error');
      setTimeout(() => updateStatus('', ''), 4000);
    }
    
  } catch (error) {
    console.error('Unexpected error:', error);
    updateStatus('✗ An unexpected error occurred. Please try again.', 'error');
    setTimeout(() => updateStatus('', ''), 4000);
  } finally {
    // Re-enable button and remove loading effect
    generateBtn.disabled = false;
    posterImage.classList.remove('loading');
  }
}

/**
 * Preloads an image to ensure smooth transitions
 * @param {string} url - The image URL to preload
 */
function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(url);
    img.onerror = reject;
    img.src = url;
  });
}

// Event Listeners
generateBtn.addEventListener('click', generateNewPoster);

// Test quote API on page load
window.addEventListener('load', async () => {
  console.log('🎨 Random Poster Generator loaded successfully!');
  console.log('Using APIs:');
  console.log('- Images: Lorem Picsum (picsum.photos)');
  console.log('- Quotes: ZenQuotes API (zenquotes.io) - cached for performance');
  
  // Initialize quote cache
  const testQuote = await fetchRandomQuote();
  console.log('Initial quote loaded:', testQuote.substring(0, 50) + '...');
});

// Optional: Keyboard shortcut (Space or Enter) to generate
document.addEventListener('keydown', (event) => {
  if ((event.code === 'Space' || event.code === 'Enter') && 
      document.activeElement !== generateBtn &&
      !generateBtn.disabled) {
    event.preventDefault();
    generateNewPoster();
  }
});
