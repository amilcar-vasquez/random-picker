// DOM Elements
const posterImage = document.getElementById('posterImage');
const posterQuote = document.getElementById('posterQuote');
const generateBtn = document.getElementById('generateBtn');
const statusDiv = document.getElementById('status');

// API Endpoints
const IMAGE_API = 'https://picsum.photos/800/600';
const QUOTE_APIS = [
  'https://api.quotable.io/random',
  'https://zenquotes.io/api/random',
  'https://api.api-ninjas.com/v1/quotes?category=inspirational'
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
 * Fetches a random quote from Quotable API
 * @returns {Promise<string>} Formatted quote with author
 */
async function fetchRandomQuote() {
  const response = await fetch(QUOTE_API);
  
  if (!response.ok) {
    throw new Error(`Quote API error: ${response.status}`);
  }
  
  const data = await response.json();
  return `"${data.content}" — ${data.author}`;
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

// Optional: Generate on page load after a short delay
window.addEventListener('load', () => {
  console.log('Random Poster Generator loaded successfully!');
  console.log('Using APIs:');
  console.log('- Images: Lorem Picsum (picsum.photos)');
  console.log('- Quotes: Quotable (quotable.io)');
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
