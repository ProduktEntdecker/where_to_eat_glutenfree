import { Restaurant } from '../types';
import { searchOpenStreetMap } from './openstreetmap';

// Mock data fallback
const mockRestaurants: Restaurant[] = [
  {
    id: 'mock-1',
    name: 'Green Garden Cafe',
    address: 'Hauptstrasse 12, Berlin',
    rating: 4.5,
    priceLevel: 2,
    openNow: true,
    distance: 0.5,
    glutenFreeOptions: ['Glutenfreies Brot', 'GF Pasta', 'GF Desserts'],
    lat: 52.520,
    lng: 13.405,
    totalRatings: 127
  },
  {
    id: 'mock-2',
    name: 'Healthy Bites',
    address: 'Friedrichstrasse 45, Berlin',
    rating: 4.2,
    priceLevel: 2,
    openNow: true,
    distance: 1.2,
    glutenFreeOptions: ['GF Pizza', 'GF Sandwiches', 'GF Salate'],
    lat: 52.521,
    lng: 13.388,
    totalRatings: 89
  },
  {
    id: 'mock-3',
    name: 'Pure Kitchen',
    address: 'Schoenhauser Allee 78, Berlin',
    rating: 4.7,
    priceLevel: 3,
    openNow: false,
    distance: 2.1,
    glutenFreeOptions: ['Komplett GF Menue', 'GF Baeckerei'],
    lat: 52.535,
    lng: 13.413,
    totalRatings: 234
  }
];

function getApiKey(): string {
  return localStorage.getItem('gf_google_api_key')
    || import.meta.env.VITE_GOOGLE_PLACES_API_KEY
    || '';
}

function getSearchRadius(): number {
  const stored = localStorage.getItem('gf_search_radius');
  if (stored) return parseInt(stored) * 1000;
  return parseInt(import.meta.env.VITE_SEARCH_RADIUS || '5000');
}

function calculateDistance(
  lat1: number, lon1: number,
  lat2: number, lon2: number
): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Cache for API responses
const apiCache = new Map<string, { data: Restaurant[]; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000;

function getCacheKey(query: string, lat: number, lng: number): string {
  return `${query}_${lat.toFixed(3)}_${lng.toFixed(3)}`;
}

async function searchWithGooglePlacesSDK(
  location: { lat: number; lng: number },
  keyword: string = ''
): Promise<Restaurant[]> {
  if (!window.google?.maps?.places) {
    return [];
  }

  const radius = getSearchRadius();

  const g = window.google!;

  return new Promise((resolve) => {
    const service = new g.maps.places.PlacesService(
      document.createElement('div')
    );

    const request = {
      location: new g.maps.LatLng(location.lat, location.lng),
      radius,
      type: 'restaurant',
      keyword: keyword ? `${keyword} gluten free` : 'gluten free'
    };

    service.nearbySearch(request, (results: any[] | null, status: string) => {
      if (status === g.maps.places.PlacesServiceStatus.OK && results) {
        const restaurants: Restaurant[] = results.map((place: any) => ({
          id: place.place_id || crypto.randomUUID(),
          name: place.name || '',
          address: place.vicinity || '',
          rating: place.rating || 0,
          priceLevel: place.price_level || 0,
          openNow: place.opening_hours?.isOpen?.(),
          distance: calculateDistance(
            location.lat, location.lng,
            place.geometry?.location?.lat() || 0,
            place.geometry?.location?.lng() || 0
          ),
          glutenFreeOptions: ['Glutenfreie Optionen verfuegbar'],
          phone: place.formatted_phone_number,
          website: place.website,
          photos: place.photos?.map((photo: any) => photo.getUrl({ maxWidth: 400 })),
          lat: place.geometry?.location?.lat(),
          lng: place.geometry?.location?.lng(),
          totalRatings: place.user_ratings_total
        }));

        resolve(restaurants);
      } else {
        resolve([]);
      }
    });
  });
}

export async function searchRestaurants(
  query: string,
  location?: { lat: number; lng: number } | null
): Promise<Restaurant[]> {
  if (!location) {
    return filterMockData(query);
  }

  const cacheKey = getCacheKey(query, location.lat, location.lng);
  const cached = apiCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const apiKey = getApiKey();

  if (apiKey && window.google?.maps?.places) {
    try {
      const results = await searchWithGooglePlacesSDK(location, query);
      if (results.length > 0) {
        apiCache.set(cacheKey, { data: results, timestamp: Date.now() });
        return results;
      }
    } catch (error) {
      console.warn('Google Places SDK failed:', error);
    }
  }

  try {
    const radiusKm = getSearchRadius() / 1000;
    const osmResults = await searchOpenStreetMap(location, radiusKm);
    if (osmResults.length > 0) {
      apiCache.set(cacheKey, { data: osmResults, timestamp: Date.now() });
      return osmResults;
    }
  } catch (error) {
    console.warn('OpenStreetMap search failed:', error);
  }

  return filterMockData(query);
}

function filterMockData(query: string): Restaurant[] {
  if (!query) return mockRestaurants;
  const q = query.toLowerCase();
  return mockRestaurants.filter(r =>
    r.name.toLowerCase().includes(q) ||
    r.glutenFreeOptions.some(opt => opt.toLowerCase().includes(q))
  );
}

export function getRestaurantById(id: string): Restaurant | undefined {
  for (const entry of apiCache.values()) {
    const found = entry.data.find(r => r.id === id);
    if (found) return found;
  }

  try {
    const favs = JSON.parse(localStorage.getItem('gf_finder_favorites') || '[]');
    return favs.find((r: Restaurant) => r.id === id);
  } catch {
    return undefined;
  }
}
