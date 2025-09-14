# Gluten-Free Restaurant Finder 🍽️

A Progressive Web App (PWA) for finding gluten-free restaurants and safe dining options near you. Works on iPhone, iPad, MacBook, and all modern devices.

## 🌐 Live Demo
<https://produktentdecker-whe-3t3e.bolt.host>

## ✨ Features
- 📍 Location-based restaurant search
- 🔍 Find restaurants with gluten-free options
- ⭐ Restaurant ratings and reviews
- 📱 Works on all devices (iPhone, iPad, MacBook)
- 💾 Installable as a PWA
- 🌍 **FREE OpenStreetMap data (no API key needed!)**
- 🔄 Optional Google Places integration

## 🚀 Setup Instructions

### Option A: Use FREE OpenStreetMap (Recommended!)
**No API key needed!** The app now uses OpenStreetMap by default, which is:
- ✅ Completely free
- ✅ No registration required
- ✅ No billing surprises
- ✅ Good restaurant data with dietary tags

Just deploy and it works!

### Option B: Add Google Places API (Optional)

1. Go to [Google Cloud Console](<https://console.cloud.google.com/>)
2. Create a new project or select an existing one
3. Enable these APIs:
   - **Places API**
   - **Maps JavaScript API**
4. Create credentials (API Key)
5. (Optional) Restrict the API key to your domains for security

**Note:** Google provides $200 free credit monthly, which is plenty for personal use.

### 2. Configure the App

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Add your Google API key to `.env`:
```
VITE_GOOGLE_PLACES_API_KEY=your_actual_api_key_here
```

3. (Optional) Adjust search radius:
```
VITE_SEARCH_RADIUS=5000  # Search radius in meters (default: 5km)
```

### 3. Run Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📱 Using on Different Devices

### iPhone/iPad
1. Open Safari and go to the app URL
2. Tap the Share button
3. Select "Add to Home Screen"
4. The app will work offline after installation

### MacBook
- Works in any modern browser (Safari, Chrome, Firefox)
- Can be installed as a desktop app in Chrome/Edge

### Android
- Works in Chrome
- Can be installed from the browser menu

## 🔒 Security Notes

- Never commit your `.env` file with real API keys
- The API key is only used in the browser (client-side)
- For production, consider:
  - Domain restrictions on your API key
  - Setting up a backend proxy for API calls
  - Implementing rate limiting

## 🛠️ Technology Stack

- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Google Places API** - Restaurant data
- **PWA** - Installable web app

## 📝 Development Notes

### Without API Key
The app will work with mock data if no API key is configured, perfect for development and testing.

### With API Key
Real restaurant data will be fetched from Google Places, showing actual gluten-free options near your location.

## 🤝 Contributing

Feel free to submit issues and pull requests!

## 📄 License

MIT

---
Last updated: 2025-09-15 00:53:09
