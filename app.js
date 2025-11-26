// DOM Elements
const posterImage = document.getElementById('posterImage');
const posterQuote = document.getElementById('posterQuote');
const generateBtn = document.getElementById('generateBtn');
const statusDiv = document.getElementById('status');

// API Endpoints
const IMAGE_API = 'https://picsum.photos/800/600';

// Backup quotes array for random selection
const BACKUP_QUOTES = [
  { content: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { content: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
  { content: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { content: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { content: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
  { content: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { content: "The only impossible journey is the one you never begin.", author: "Tony Robbins" },
  { content: "Life is either a daring adventure or nothing at all.", author: "Helen Keller" },
  { content: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
  { content: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { content: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
  { content: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" }
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
 * Fetches a random quote with fallback to local quotes
 * @returns {Promise<string>} Formatted quote with author
 */
async function fetchRandomQuote() {
  // Try Quotable API first
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000); // 3 second timeout
    
    const response = await fetch('https://api.quotable.io/random', {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API returned ${response.status}`);
    }
    
    const data = await response.json();
    console.log('✓ Quotable API success');
    return `"${data.content}" — ${data.author}`;
    
  } catch (error) {
    // If API fails, use backup quotes
    console.warn('Quote API failed, using backup quotes:', error.message);
    const quote = getRandomBackupQuote();
    return `"${quote.content}" — ${quote.author}`;
  }
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
  console.log('- Quotes: Quotable API with local backup quotes');
  
  // Test quote API
  console.log('Testing quote API...');
  const testQuote = await fetchRandomQuote();
  console.log('Quote test result:', testQuote);
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
