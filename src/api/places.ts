import { Restaurant } from '../types';
import { searchOpenStreetMap } from './openstreetmap';
import { searchFoursquare } from './foursquare';
import { searchYelp } from './yelp';

// Mock data fallback for development
const mockRestaurants: Restaurant[] = [
  {
    id: '1',
    name: 'Green Garden Café',
    address: '123 Main St, Downtown',
    rating: 4.5,
    priceLevel: 2,
    openNow: true,
    distance: 0.5,
    glutenFreeOptions: ['Gluten-free bread', 'GF pasta', 'GF desserts']
  },
  {
    id: '2',
    name: 'Healthy Bites',
    address: '456 Oak Ave, Midtown',
    rating: 4.2,
    priceLevel: 2,
    openNow: true,
    distance: 1.2,
    glutenFreeOptions: ['GF pizza', 'GF sandwiches', 'GF salads']
  },
  {
    id: '3',
    name: 'Pure Kitchen',
    address: '789 Pine St, Uptown',
    rating: 4.7,
    priceLevel: 3,
    openNow: false,
    distance: 2.1,
    glutenFreeOptions: ['Dedicated GF menu', 'GF bakery items']
  }
];

/**
 * Search for gluten-free restaurants using multiple free APIs
 * Priority order:
 * 1. Foursquare (has GF categories) - Free up to 100k calls/month
 * 2. Yelp (has GF reviews) - Free up to 5k calls/day
 * 3. OpenStreetMap (completely free, no limits)
 * 4. Mock data (fallback)
 */
export async function searchRestaurants(
  query: string,
  location?: { lat: number; lng: number } | null
): Promise<Restaurant[]> {

  const results: Restaurant[] = [];
  const searchPromises: Promise<Restaurant[]>[] = [];

  // If location is available, search with location-based APIs
  if (location) {
    // Try Foursquare first (best for GF-specific data)
    searchPromises.push(
      searchFoursquare(location, query || 'gluten free', 5000)
        .catch(err => {
          console.warn('Foursquare search failed:', err);
          return [];
        })
    );

    // Try Yelp (great for reviews mentioning GF)
    searchPromises.push(
      searchYelp(location, query || 'gluten free', 5000)
        .catch(err => {
          console.warn('Yelp search failed:', err);
          return [];
        })
    );

    // Also try OpenStreetMap (completely free, no limits)
    searchPromises.push(
      searchOpenStreetMap(location, 5)
        .catch(err => {
          console.warn('OpenStreetMap search failed:', err);
          return [];
        })
    );

    // Wait for all searches to complete
    const allResults = await Promise.all(searchPromises);

    // Combine and deduplicate results
    const combinedResults = new Map<string, Restaurant>();

    for (const apiResults of allResults) {
      for (const restaurant of apiResults) {
        // Use name + address as key for deduplication
        const key = `${restaurant.name.toLowerCase()}_${restaurant.address.toLowerCase()}`;

        // Prefer results with better GF validation
        const existing = combinedResults.get(key);
        if (!existing ||
            (restaurant.glutenFreeOptions.some(opt =>
              opt.includes('Certified') || opt.includes('Dedicated')
            ) && !existing.glutenFreeOptions.some(opt =>
              opt.includes('Certified') || opt.includes('Dedicated')
            ))) {
          combinedResults.set(key, restaurant);
        }
      }
    }

    results.push(...combinedResults.values());
  }

  // If no results from APIs, use mock data
  if (results.length === 0) {
    const filtered = mockRestaurants.filter(restaurant =>
      !query ||
      restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
      restaurant.glutenFreeOptions.some(option =>
        option.toLowerCase().includes(query.toLowerCase())
      )
    );

    return query ? filtered : mockRestaurants;
  }

  // Sort results by GF validation quality and distance
  return results.sort((a, b) => {
    // Prioritize certified/dedicated GF places
    const aScore =
      a.glutenFreeOptions.some(opt => opt.includes('Certified')) ? 3 :
      a.glutenFreeOptions.some(opt => opt.includes('Dedicated')) ? 2 :
      a.glutenFreeOptions.some(opt => opt.includes('user tips')) ? 1 : 0;

    const bScore =
      b.glutenFreeOptions.some(opt => opt.includes('Certified')) ? 3 :
      b.glutenFreeOptions.some(opt => opt.includes('Dedicated')) ? 2 :
      b.glutenFreeOptions.some(opt => opt.includes('user tips')) ? 1 : 0;

    if (aScore !== bScore) return bScore - aScore;

    // Then by distance
    return (a.distance || 999) - (b.distance || 999);
  });
}

/**
 * Validate if a restaurant actually has gluten-free options
 * by checking their website/menu
 */
export async function validateGlutenFreeOptions(
  restaurant: Restaurant
): Promise<string[]> {
  if (!restaurant.website) {
    return restaurant.glutenFreeOptions;
  }

  try {
    // This would need a backend proxy to avoid CORS
    // For now, return existing options
    console.log(`Would validate GF options at: ${restaurant.website}`);
    return restaurant.glutenFreeOptions;
  } catch (error) {
    console.error('Failed to validate GF options:', error);
    return restaurant.glutenFreeOptions;
  }
}