import { Restaurant } from '../types';

/**
 * Foursquare Places API Integration
 * Free tier: 100,000 calls/month
 * Specifically has gluten-free restaurant categories
 *
 * IMPORTANT: This implementation requires a backend proxy for production.
 * DO NOT store API keys in client code!
 *
 * Backend setup required:
 * 1. Create proxy endpoint: /api/foursquare/search
 * 2. Store FOURSQUARE_API_KEY in server environment (never use VITE_ prefix)
 * 3. Update the proxy URL below to match your backend endpoint
 */

// Backend proxy endpoint - NEVER store API keys in client code
const FOURSQUARE_PROXY_URL = '/api/foursquare/search';
// Direct API URL should only be used from backend
const IS_BACKEND_AVAILABLE = false; // Set to true when backend is deployed

// Foursquare category IDs for gluten-free and related venues
const GLUTEN_FREE_CATEGORIES = [
  '4bf58dd8d48988d1c5941735', // Gluten-Free Restaurant
  '4bf58dd8d48988d10c941735', // Health Food Restaurant
  '4bf58dd8d48988d1d3941735', // Vegetarian/Vegan Restaurant (often have GF options)
];

function calculateDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export async function searchFoursquare(
  location: { lat: number; lng: number },
  query: string = 'gluten free',
  radiusMeters: number = 5000
): Promise<Restaurant[]> {

  if (!IS_BACKEND_AVAILABLE) {
    console.warn('Foursquare requires backend proxy - see BACKEND_SETUP.md');
    return [];
  }

  const params = new URLSearchParams({
    query: query,
    ll: `${location.lat},${location.lng}`,
    radius: radiusMeters.toString(),
    categories: GLUTEN_FREE_CATEGORIES.join(','),
    limit: '50',
    fields: 'fsq_id,name,location,categories,rating,price,hours,website,tel,description,tips,photos'
  });

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

  try {
    // Call backend proxy - no API keys in client!
    const response = await fetch(`${FOURSQUARE_PROXY_URL}?${params}`, {
      headers: {
        'Accept': 'application/json'
      },
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Foursquare API error: ${response.status}`);
    }

    const data = await response.json();

    // Process results
    const restaurants: Restaurant[] = await Promise.all(
      data.results.map(async (place: any) => {
        // Check if tips mention gluten-free
        const glutenFreeOptions: string[] = [];

        // Check categories
        const hasGlutenFreeCategory = place.categories?.some((cat: any) =>
          cat.name?.toLowerCase().includes('gluten') ||
          cat.id === '4bf58dd8d48988d1c5941735'
        );

        if (hasGlutenFreeCategory) {
          glutenFreeOptions.push('Certified gluten-free restaurant');
        }

        // Get tips mentioning gluten-free (if available in response)
        if (place.tips?.length > 0) {
          const gfTips = place.tips.filter((tip: any) =>
            tip.text?.toLowerCase().includes('gluten')
          );
          if (gfTips.length > 0) {
            glutenFreeOptions.push(`${gfTips.length} user tips mention gluten-free options`);
          }
        }

        // If health food restaurant, likely has GF options
        const isHealthFood = place.categories?.some((cat: any) =>
          cat.id === '4bf58dd8d48988d10c941735'
        );
        if (isHealthFood && glutenFreeOptions.length === 0) {
          glutenFreeOptions.push('Health food restaurant - likely has GF options');
        }

        if (glutenFreeOptions.length === 0) {
          glutenFreeOptions.push('Check with restaurant for gluten-free options');
        }

        // Foursquare v3 API uses geocodes.main for coordinates
        const placeCoords = place.geocodes?.main || place.location;
        const distance = placeCoords?.latitude && placeCoords?.longitude
          ? calculateDistance(
              location.lat, location.lng,
              placeCoords.latitude, placeCoords.longitude
            )
          : place.distance ? place.distance / 1000 : undefined; // Convert meters to km if provided

        return {
          id: place.fsq_id,
          name: place.name,
          address: place.location.formatted_address ||
            `${place.location.address || ''} ${place.location.locality || ''}`.trim(),
          rating: place.rating ? place.rating / 2 : 0, // Foursquare uses 10-point scale
          priceLevel: place.price || 0,
          openNow: place.hours?.open_now,
          distance: distance ? Math.round(distance * 10) / 10 : undefined,
          glutenFreeOptions,
          phone: place.tel,
          website: place.website,
          photos: place.photos?.map((photo: any) =>
            `${photo.prefix}300x300${photo.suffix}`
          ) || []
        } as Restaurant;
      })
    );

    // Sort by relevance: prioritize certified GF restaurants
    return restaurants.sort((a, b) => {
      const aCertified = a.glutenFreeOptions.some(opt => opt.includes('Certified'));
      const bCertified = b.glutenFreeOptions.some(opt => opt.includes('Certified'));

      if (aCertified && !bCertified) return -1;
      if (!aCertified && bCertified) return 1;

      // Then by distance
      return (a.distance || 0) - (b.distance || 0);
    });

  } catch (error) {
    console.error('Foursquare search error:', error);
    return [];
  }
}

/**
 * Get detailed venue information including menu and tips
 */
export async function getFoursquareVenueDetails(venueId: string): Promise<any> {
  if (!IS_BACKEND_AVAILABLE) {
    console.warn('Foursquare requires backend proxy');
    return null;
  }

  try {
    // Get venue details
    const response = await fetch(
      `/api/foursquare/places/${venueId}`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get venue details: ${response.status}`);
    }

    const venue = await response.json();

    // Get tips specifically mentioning gluten
    const tipsResponse = await fetch(
      `/api/foursquare/places/${venueId}/tips?limit=50`,
      {
        headers: {
          'Accept': 'application/json'
        }
      }
    );

    if (tipsResponse.ok) {
      const tipsData = await tipsResponse.json();
      venue.glutenFreeTips = tipsData.filter((tip: any) =>
        tip.text?.toLowerCase().includes('gluten')
      );
    }

    return venue;

  } catch (error) {
    console.error('Failed to get venue details:', error);
    return null;
  }
}