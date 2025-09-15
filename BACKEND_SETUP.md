# Backend Proxy Setup (Required for API Security)

## ⚠️ Critical Security Notice

This app's API integrations (Foursquare and Yelp) **MUST** be proxied through a backend server. Direct client-side API calls will:
1. **Expose your API keys** to anyone who views the source
2. **Fail due to CORS** restrictions
3. **Allow unlimited API usage** by malicious users

## Why Backend Proxy is Required

- **Security**: API keys must never be exposed in client-side code
- **CORS**: Yelp API blocks all browser requests
- **Rate Limiting**: Control API usage per user
- **Cost Control**: Prevent API quota exhaustion

## Implementation Options

### Option 1: Node.js/Express Backend

```javascript
// server.js
const express = require('express');
const app = express();

// Store keys in environment variables (never commit!)
const FOURSQUARE_KEY = process.env.FOURSQUARE_API_KEY;
const YELP_KEY = process.env.YELP_API_KEY;

// Foursquare proxy endpoint
app.get('/api/foursquare/search', async (req, res) => {
  const { lat, lng, query } = req.query;

  // Make API call with server-side key
  const response = await fetch(
    `https://api.foursquare.com/v3/places/search?ll=${lat},${lng}&query=${query}`,
    {
      headers: {
        'Authorization': FOURSQUARE_KEY,
        'Accept': 'application/json'
      }
    }
  );

  const data = await response.json();
  res.json(data);
});

// Similar for Yelp...
```

### Option 2: Vercel Functions

```javascript
// api/foursquare.js
export default async function handler(req, res) {
  const { lat, lng, query } = req.query;

  const response = await fetch(
    `https://api.foursquare.com/v3/places/search?ll=${lat},${lng}&query=${query}`,
    {
      headers: {
        'Authorization': process.env.FOURSQUARE_API_KEY,
        'Accept': 'application/json'
      }
    }
  );

  const data = await response.json();
  res.status(200).json(data);
}
```

### Option 3: Netlify Functions

```javascript
// netlify/functions/foursquare.js
exports.handler = async (event) => {
  const { lat, lng, query } = event.queryStringParameters;

  const response = await fetch(
    `https://api.foursquare.com/v3/places/search?ll=${lat},${lng}&query=${query}`,
    {
      headers: {
        'Authorization': process.env.FOURSQUARE_API_KEY,
        'Accept': 'application/json'
      }
    }
  );

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  };
};
```

## Updating Frontend Code

Once your backend proxy is set up, update the frontend API calls:

```javascript
// src/api/foursquare.ts
// BEFORE (insecure):
const response = await fetch('https://api.foursquare.com/v3/places/search', {
  headers: { 'Authorization': VITE_FOURSQUARE_API_KEY }
});

// AFTER (secure):
const response = await fetch('/api/foursquare/search?lat=...');
```

## Environment Variables

Store API keys in your backend's environment:

```bash
# .env (backend only, never commit!)
FOURSQUARE_API_KEY=your_key_here
YELP_API_KEY=your_key_here
```

## Security Checklist

- [ ] API keys stored in backend environment variables only
- [ ] No VITE_ prefixed API keys (these get exposed to client)
- [ ] Backend validates and sanitizes all input
- [ ] Rate limiting implemented
- [ ] CORS configured properly
- [ ] API responses sanitized (no sensitive data)
- [ ] Error handling doesn't leak information

## Testing

1. Ensure frontend can't access API keys:
   ```javascript
   console.log(import.meta.env.VITE_FOURSQUARE_API_KEY); // Should be undefined
   ```

2. Test proxy endpoints:
   ```bash
   curl http://localhost:3000/api/foursquare/search?lat=40.7&lng=-74.0
   ```

3. Verify CORS headers are set correctly

## Deployment

- **Vercel**: Add env vars in dashboard
- **Netlify**: Add env vars in site settings
- **Heroku**: Use `heroku config:set`
- **Railway**: Add in project settings

Remember: **Never commit API keys to git!**