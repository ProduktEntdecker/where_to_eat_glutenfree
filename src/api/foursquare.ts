import { Restaurant } from '../types';

/**
 * Foursquare Places API Integration
 * Free tier: 100,000 calls/month
 * Specifically has gluten-free restaurant categories
 */

const FOURSQUARE_API_KEY = import.meta.env.VITE_FOURSQUARE_API_KEY || '';
const FOURSQUARE_API_URL = 'https://api.foursquare.com/v3/places/search';

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

  if (!FOURSQUARE_API_KEY) {
    console.log('Foursquare API key not configured');
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

  try {
    const response = await fetch(`${FOURSQUARE_API_URL}?${params}`, {
      headers: {
        'Accept': 'application/json',
        'Authorization': FOURSQUARE_API_KEY
      }
    });

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

        const distance = calculateDistance(
          location.lat, location.lng,
          place.location.lat, place.location.lng
        );

        return {
          id: place.fsq_id,
          name: place.name,
          address: place.location.formatted_address ||
            `${place.location.address || ''} ${place.location.locality || ''}`.trim(),
          rating: place.rating ? place.rating / 2 : 0, // Foursquare uses 10-point scale
          priceLevel: place.price || 0,
          openNow: place.hours?.open_now,
          distance: Math.round(distance * 10) / 10,
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
  if (!FOURSQUARE_API_KEY) {
    return null;
  }

  try {
    // Get venue details
    const response = await fetch(
      `https://api.foursquare.com/v3/places/${venueId}`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': FOURSQUARE_API_KEY
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get venue details: ${response.status}`);
    }

    const venue = await response.json();

    // Get tips specifically mentioning gluten
    const tipsResponse = await fetch(
      `https://api.foursquare.com/v3/places/${venueId}/tips?limit=50`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': FOURSQUARE_API_KEY
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