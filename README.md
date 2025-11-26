# 🎨 Random Poster Generator

A beautiful Material Design 3 web application that generates random inspirational posters by combining stunning images with motivational quotes.


## ✨ Features

- 🖼️ **Random High-Quality Images** - Beautiful photos from Lorem Picsum
- 💬 **Inspirational Quotes** - Motivational quotes with author attribution
- 🎨 **Material Design 3** - Modern, polished UI using Material Web Components
- ⚡ **Fast Performance** - Parallel API fetching with Promise.allSettled()
- 🛡️ **Robust Error Handling** - Graceful fallbacks for API failures
- 📱 **Fully Responsive** - Works seamlessly on desktop, tablet, and mobile
- ⌨️ **Keyboard Shortcuts** - Press Space or Enter to generate new posters
- 🎭 **Smooth Animations** - Elegant transitions and loading states


## 🔌 APIs Used

### Image API
- **Service**: [Lorem Picsum](https://picsum.photos/)
- **Endpoint**: `https://picsum.photos/800/600`
- **Features**: 
  - No API key required
  - High-quality random photos
  - Fast and reliable
  - No CORS restrictions

### Quote API
- **Primary Service**: [Quotable](https://api.quotable.io/)
- **Endpoint**: `https://api.quotable.io/random`
- **Features**:
  - No API key required
  - Free to use
  - Returns JSON with quote content and author
- **Fallback**: Local backup quotes array (12 inspirational quotes)
  - Automatically used if API is unavailable
  - Ensures application always works

## 🎯 Implementation Details

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
1. User clicks "Generate New Poster" button
2. Status displays "Loading..." message
3. `Promise.allSettled()` fetches image and quote simultaneously
4. Quote API tries Quotable with 3-second timeout
5. Falls back to local quotes if API fails
6. Updates poster with new content
7. Shows success/error status messages

### 4. Error Handling
- **Image fetch fails**: Keeps current image, updates quote
- **Quote fetch fails**: Uses backup quotes from local array
- **Both fail**: Keeps all current content, shows error message
- **No blank states**: Always displays meaningful content


## 🧪 Testing

Open `test-api.html` to:
- Test API connectivity
- Diagnose CORS issues
- View detailed error messages
- Check response formats

## ⌨️ Keyboard Shortcuts

- **Space** or **Enter**: Generate new poster (when button not focused)

## 📝 Checklist (Completed)

- ✅ Default content shows on page load
- ✅ Button fetches new image + quote
- ✅ Status message updates appropriately
- ✅ Poster updates with smooth transitions
- ✅ Fallbacks work for API failures
- ✅ No blank UI states
- ✅ Fully responsive design
- ✅ Material Design 3 styling
