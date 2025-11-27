import { Restaurant } from '../types';
import { searchOpenStreetMap } from './openstreetmap';
import { getCachedResults, setCachedResults, cleanOldCaches } from '../services/cache';

// Clean old caches on module load
cleanOldCaches();

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

// Note: Google Places API integration removed for MVP
// OpenStreetMap (free, no API key) is the primary data source
// Google Places can be added post-MVP if needed

export async function searchRestaurants(
  query: string,
  location?: { lat: number; lng: number } | null
): Promise<Restaurant[]> {
  // Helper function to filter results by query
  const filterByQuery = (restaurants: Restaurant[], searchQuery: string): Restaurant[] => {
    if (!searchQuery) return restaurants;
    const queryLower = searchQuery.toLowerCase();
    return restaurants.filter(restaurant =>
      restaurant.name.toLowerCase().includes(queryLower) ||
      restaurant.glutenFreeOptions.some(option =>
        option.toLowerCase().includes(queryLower)
      )
    );
  };

  // If location is available, try cache first, then OpenStreetMap
  if (location) {
    // Check cache first
    const cached = getCachedResults(location);
    if (cached) {
      return filterByQuery(cached, query);
    }

    // Fetch from OpenStreetMap (FREE, no API key needed!)
    try {
      console.log('Searching with OpenStreetMap (free, no API key needed)...');
      const osmResults = await searchOpenStreetMap(location, 5); // 5km radius
      if (osmResults.length > 0) {
        // Cache the results
        setCachedResults(location, osmResults);
        return filterByQuery(osmResults, query);
      }
    } catch (error) {
      console.warn('OpenStreetMap search failed, using mock data...', error);
    }
  }

  // No location or API failed, return filtered mock data
  return filterByQuery(mockRestaurants, query);
}