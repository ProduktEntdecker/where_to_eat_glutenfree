# Gluten-Free Restaurant Finder 🍽️

A Progressive Web App (PWA) for finding validated gluten-free restaurants and safe dining options near you. Works on iPhone, iPad, MacBook, and all modern devices.

## 🌐 Live Demo
<https://produktentdecker-whe-3t3e.bolt.host>

## ✨ Features
- 📍 Location-based restaurant search
- 🔍 Find restaurants with validated gluten-free options
- ⭐ Restaurant ratings and reviews
- 📱 Works on all devices (iPhone, iPad, MacBook)
- 💾 Installable as a PWA
- 🌍 **FREE OpenStreetMap data (no API key needed!)**
- 🔄 Foursquare + Yelp integration via backend proxy (no client-exposed keys)
- ✅ XSS protection with DOMPurify
- 🛡️ Error boundaries for crash prevention

## 🚀 Setup Instructions

### Option A: Use FREE OpenStreetMap Only (No Setup!)
**No API key needed!** The app works out-of-the-box with OpenStreetMap, which is:
- ✅ Completely free
- ✅ No registration required
- ✅ No billing surprises
- ✅ Good restaurant data with dietary tags

Just deploy and it works!

### Option B: Add Foursquare and Yelp (via Backend Proxies)

For better gluten-free validation, you can add Foursquare and Yelp APIs through backend proxies:

#### Foursquare Setup (Free tier: 100,000 calls/month)
1. Sign up at <https://foursquare.com/developers/>
2. Create a new app
3. Copy your API key
4. Store key in backend environment: `FOURSQUARE_API_KEY=your_key`
5. Implement backend proxy at `/api/foursquare/search`

#### Yelp Setup (Free tier: 5,000 calls/day)
1. Sign up at <https://www.yelp.com/developers>
2. Create an app
3. Copy your API key
4. Store key in backend environment: `YELP_API_KEY=your_key`
5. Implement backend proxy at `/api/yelp/search`

**Note:** Never use `VITE_` prefix for secrets - they get exposed to the client!

### 2. Configure the App

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Configure backend proxy endpoints in your server environment:
```
FOURSQUARE_API_KEY=your_foursquare_key
YELP_API_KEY=your_yelp_key
# Note: No VITE_ prefixes for secrets
```

3. (Optional) Configure search radius on the backend (do not leak via VITE_).

### 3. Run Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test
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
- Do not expose API keys in the browser. Store `FOURSQUARE_API_KEY` and `YELP_API_KEY` on the backend only
- Frontend must call your backend proxy endpoints (e.g., `/api/foursquare/search`, `/api/yelp/search`)
- Enforce server-side rate limiting, request timeouts, retries with backoff, and input validation
- Do not log secrets; rotate keys periodically
- All user inputs are sanitized with DOMPurify to prevent XSS attacks

## 🛠️ Technology Stack

- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool
- **Tailwind CSS** - Utility-first styling
- **Foursquare Places (via backend)** - Restaurant data + GF category
- **Yelp Fusion (via backend)** - Reviews/attributes for GF mentions
- **OpenStreetMap/Overpass** - Fallback with `diet:gluten_free` tags
- **DOMPurify** - XSS protection
- **Jest** - Testing framework
- **PWA** - Installable web app

## 📝 Development Notes

### Without Backend Proxies
The app will work with OpenStreetMap data and mock data if no backend proxies are configured, perfect for development and testing.

### With Backend Proxies
Real restaurant data will be fetched from Foursquare and Yelp, providing validated gluten-free options with user reviews and tips.

### API Priority Order
The app searches in this order:
1. **Foursquare** (backend proxy) — GF category + tips
2. **Yelp** (backend proxy) — reviews/attributes for GF mentions
3. **OpenStreetMap** — always-available fallback
4. **Mock data** — development/testing

## 🤝 Contributing

Feel free to submit issues and pull requests! Please ensure:
- All tests pass
- No API keys in client code
- Proper input sanitization
- Accessibility standards met

## 📄 License

MIT

---

### Last Updated: 2025-09-15 23:35