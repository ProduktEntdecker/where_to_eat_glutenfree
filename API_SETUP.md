# Free API Setup Guide

This app uses **completely free APIs** to find validated gluten-free restaurants. No paid subscriptions required!

## ⚠️ SECURITY WARNING

**NEVER put API keys in client-side code!** All API integrations require a backend proxy to:
1. Keep API keys secure on the server
2. Handle CORS restrictions
3. Control rate limiting

## Available APIs (All Free - But Require Backend)

### 1. OpenStreetMap/Overpass API ✅
- **Status**: Already working, no setup needed!
- **Cost**: Completely free, no API key required
- **Limits**: None (reasonable use)
- **Coverage**: Worldwide

### 2. Foursquare Places API (Recommended)
- **Cost**: Free tier includes 100,000 calls/month
- **Best for**: Validated gluten-free restaurants with user tips
- **Setup**:
  1. Sign up at https://foursquare.com/developers/
  2. Create a new app
  3. Copy your API key
  4. Add to `.env` file: `VITE_FOURSQUARE_API_KEY=your_key_here`

### 3. Yelp Fusion API (Requires Backend)
- **Cost**: Free tier includes 5,000 calls/day
- **Best for**: Restaurant reviews mentioning gluten-free
- **⚠️ CORS Limitation**: Yelp API blocks browser requests. Requires backend proxy.
- **Setup**:
  1. Sign up at https://www.yelp.com/developers
  2. Create an app
  3. Copy your API key
  4. Implement backend proxy endpoint to make Yelp API calls
  5. Update `src/api/yelp.ts` to call your proxy instead

## Why These APIs?

Unlike generic map services, these APIs provide:
- **Foursquare**: Has specific "Gluten-Free Restaurant" category
- **Yelp**: Reviews searchable for "gluten free" mentions
- **OpenStreetMap**: Community-tagged dietary restrictions

## Priority Order

The app searches in this order:
1. **Foursquare** - Best gluten-free validation
2. **OpenStreetMap** - Always available fallback
3. **Mock data** - For development/testing

## No Google Maps Needed!

This app intentionally avoids Google Maps API because:
- Requires credit card even for free tier
- Expensive once free credits expire
- No specific gluten-free categories
- OpenStreetMap + Foursquare provide better dietary data for free