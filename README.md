#  Random Poster Generator



##  Features

-  **Random High-Quality Images** - Beautiful photos from Lorem Picsum
-  **Inspirational Quotes** - Motivational quotes with author attribution
-  **Fast Performance** - Parallel API fetching with Promise.allSettled()
-  **Robust Error Handling** - Graceful fallbacks for API failures


## APIs Used

### Image API
- **Service**: [Lorem Picsum](https://picsum.photos/)
- **Endpoint**: `https://picsum.photos/800/600`
- **Features**: 
  - No API key required
  - High-quality random photos
  - Fast and reliable
  - No CORS restrictions

### Quotes
- **Service**: [ZenQuotes API](https://zenquotes.io/)
- **Endpoint**: `https://zenquotes.io/api/quotes` (via CORS proxy)
- **CORS Proxy**: `https://corsproxy.io/` - Required to bypass browser CORS restrictions
- **Implementation Strategy**:
  - Fetches batch of 50 quotes via CORS proxy and caches locally for 1 hour
  - Reduces API calls and improves performance
  - Falls back to local backup quotes (12 biblical quotes) if API/proxy unavailable
  - No API key required for basic usage
- **Features**:
  - High-quality curated quotes from various authors
  - Proper author attribution
  - Smart caching system (1-hour refresh cycle)
  - Automatic fallback system for reliability
  - Complies with ZenQuotes best practices

##  Implementation Details

### 1. HTML Structure
- Material Web Components (`md-filled-button`)
- Semantic HTML5 elements
- Proper accessibility attributes
- Google Fonts integration (Roboto)

### 2. CSS Overlay Strategy
- `position: relative` on poster container
- `position: absolute` on quote overlay
- Linear gradient background for text readability
- Smooth animations and transitions
- Mobile-first responsive design

### 3. JavaScript Fetch Logic
1. On first load, fetches 50 quotes from ZenQuotes API and caches them
2. User clicks "Generate New Poster" button
3. Status displays "Loading..." message
4. `Promise.allSettled()` fetches image and selects quote simultaneously
5. Random image fetched from Lorem Picsum with timestamp parameter
6. Random quote selected from cached collection (refreshes hourly)
7. Updates poster with new content instantly
7. Shows success/error status messages

### 4. Error Handling
- **Image fetch fails**: Keeps current image, still updates quote
- **ZenQuotes API fails**: Automatically falls back to local backup quotes (12 biblical quotes)
- **Partial failure**: Shows appropriate error message
- **Cache system**: Ensures quotes always available even if API is down
- **No blank states**: Always displays meaningful content


## ⌨️ Keyboard Shortcuts

- **Space** or **Enter**: Generate new poster (when button not focused)

##  Checklist (Completed)

-  Default content shows on page load
-  Button fetches new image + quote
-  Status message updates appropriately
-  Poster updates with smooth transitions
-  Fallbacks work for API failures
-  No blank UI states
-  Fully responsive design
-  Material Design 3 styling
