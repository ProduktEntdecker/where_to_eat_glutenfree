import { Restaurant } from '../types';

/**
 * Yelp Fusion API Integration
 * Free tier: 5,000 calls/day
 * Has gluten-free categories and searchable reviews
 *
 * IMPORTANT: This implementation requires a backend proxy.
 * DO NOT store API keys in client code!
 *
 * Backend setup required:
 * 1. Create proxy endpoints: /api/yelp/search and /api/yelp/businesses/:id/reviews
 * 2. Store YELP_API_KEY in server environment (never use VITE_ prefix)
 * 3. Update the proxy URLs below to match your backend endpoints
 */

// Backend proxy endpoints (adjust to match your server setup)
const YELP_PROXY_SEARCH = '/api/yelp/search';
const YELP_PROXY_REVIEWS = '/api/yelp/businesses';

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

export async function searchYelp(
  location: { lat: number; lng: number },
  query: string = 'gluten free',
  radiusMeters: number = 5000
): Promise<Restaurant[]> {

  // Note: Backend proxy required - this won't work without server setup
  console.warn('Yelp integration requires backend proxy - see BACKEND_SETUP.md');

  const params = new URLSearchParams({
    term: `${query} restaurant`,
    latitude: location.lat.toString(),
    longitude: location.lng.toString(),
    radius: Math.min(radiusMeters, 40000).toString(), // Yelp max is 40km
    categories: 'restaurants,gluten_free',
    limit: '20', // Reduced to avoid rate limit issues
    sort_by: 'distance'
  });

  try {
    // Call backend proxy endpoint (no API key in client!)
    // Your backend should handle the Yelp API authentication
    const response = await fetch(`${YELP_PROXY_SEARCH}?${params}`);

    if (!response.ok) {
      throw new Error(`Yelp API error: ${response.status}`);
    }

    const data = await response.json();

    // Process Yelp businesses
    const restaurants: Restaurant[] = await Promise.all(
      data.businesses.map(async (business: any) => {
        const glutenFreeOptions: string[] = [];

        // Check if marked as gluten-free friendly
        if (business.attributes?.gluten_free_friendly) {
          glutenFreeOptions.push('Yelp verified: Gluten-free friendly');
        }

        // Check categories for gluten-free
        const hasGFCategory = business.categories?.some((cat: any) =>
          cat.alias === 'gluten_free' ||
          cat.title?.toLowerCase().includes('gluten')
        );

        if (hasGFCategory) {
          glutenFreeOptions.push('Listed as gluten-free restaurant');
        }

        // Note: Review fetching removed to conserve API quota
        // Reviews should be fetched on-demand when user views details

        if (glutenFreeOptions.length === 0) {
          glutenFreeOptions.push('Contact restaurant for gluten-free options');
        }

        const distance = calculateDistance(
          location.lat, location.lng,
          business.coordinates.latitude, business.coordinates.longitude
        );

        return {
          id: business.id,
          name: business.name,
          address: business.location.display_address.join(', '),
          rating: business.rating,
          priceLevel: business.price ? business.price.length : 0,
          openNow: !business.is_closed,
          distance: Math.round(distance * 10) / 10,
          glutenFreeOptions,
          phone: business.display_phone || business.phone,
          website: business.url,
          photos: business.photos || []
        } as Restaurant;
      })
    );

    // Sort by GF validation quality
    return restaurants.sort((a, b) => {
      const aVerified = a.glutenFreeOptions.some(opt =>
        opt.includes('verified') || opt.includes('Celiac safe')
      );
      const bVerified = b.glutenFreeOptions.some(opt =>
        opt.includes('verified') || opt.includes('Celiac safe')
      );

      if (aVerified && !bVerified) return -1;
      if (!aVerified && bVerified) return 1;

      return (a.distance || 0) - (b.distance || 0);
    });

  } catch (error) {
    console.error('Yelp search error:', error);
    return [];
  }
}

/**
 * Search Yelp reviews for gluten-free mentions
 */
export async function getYelpGlutenFreeReviews(
  businessId: string
): Promise<string[]> {
  // Note: Backend proxy required - this won't work without server setup
  console.warn('Yelp reviews require backend proxy - see BACKEND_SETUP.md');

  try {
    // Call backend proxy endpoint (no API key in client!)
    const response = await fetch(`${YELP_PROXY_REVIEWS}/${businessId}/reviews`);

    if (!response.ok) {
      throw new Error(`Failed to get reviews: ${response.status}`);
    }

    const data = await response.json();

    // Extract gluten-free mentions from reviews
    const gfMentions: string[] = [];

    data.reviews.forEach((review: any) => {
      const text = review.text.toLowerCase();
      if (text.includes('gluten')) {
        // Extract sentences mentioning gluten
        const sentences = review.text.split(/[.!?]+/);
        sentences.forEach((sentence: string) => {
          if (sentence.toLowerCase().includes('gluten')) {
            gfMentions.push(sentence.trim());
          }
        });
      }
    });

    return gfMentions;

  } catch (error) {
    console.error('Failed to get Yelp reviews:', error);
    return [];
  }
}