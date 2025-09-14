import { Restaurant } from '../types';
import { searchOpenStreetMap } from './openstreetmap';

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

// Google Places API configuration
const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
const SEARCH_RADIUS = import.meta.env.VITE_SEARCH_RADIUS || 5000; // 5km default

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

async function searchGooglePlaces(
  location: { lat: number; lng: number },
  keyword: string = ''
): Promise<any[]> {
  const baseUrl = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
  
  // Build search query focusing on gluten-free restaurants
  const searchQuery = keyword 
    ? `${keyword} gluten free restaurant`
    : 'gluten free restaurant';
  
  const params = new URLSearchParams({
    key: GOOGLE_API_KEY,
    location: `${location.lat},${location.lng}`,
    radius: SEARCH_RADIUS.toString(),
    keyword: searchQuery,
    type: 'restaurant'
  });

  try {
    // Note: Direct API calls from browser will face CORS issues
    // In production, you'd need a backend proxy or use Google's JS SDK
    const response = await fetch(`${baseUrl}?${params}`);
    const data = await response.json();
    
    if (data.status === 'OK') {
      return data.results;
    } else {
      console.error('Google Places API error:', data.status);
      return [];
    }
  } catch (error) {
    console.error('Failed to fetch from Google Places:', error);
    return [];
  }
}

async function searchWithGooglePlacesSDK(
  location: { lat: number; lng: number },
  keyword: string = ''
): Promise<Restaurant[]> {
  // Check if Google Maps is loaded
  if (!window.google?.maps?.places) {
    console.warn('Google Maps not loaded, using mock data');
    return mockRestaurants;
  }

  return new Promise((resolve) => {
    const service = new google.maps.places.PlacesService(
      document.createElement('div')
    );

    const request = {
      location: new google.maps.LatLng(location.lat, location.lng),
      radius: SEARCH_RADIUS,
      type: 'restaurant',
      keyword: keyword ? `${keyword} gluten free` : 'gluten free'
    };

    service.nearbySearch(request, (results, status) => {
      if (status === google.maps.places.PlacesServiceStatus.OK && results) {
        const restaurants: Restaurant[] = results.map(place => ({
          id: place.place_id || '',
          name: place.name || '',
          address: place.vicinity || '',
          rating: place.rating || 0,
          priceLevel: place.price_level || 0,
          openNow: place.opening_hours?.open_now,
          distance: location ? calculateDistance(
            location.lat, location.lng,
            place.geometry?.location?.lat() || 0,
            place.geometry?.location?.lng() || 0
          ) : undefined,
          glutenFreeOptions: ['Check with restaurant for GF options'],
          phone: place.formatted_phone_number,
          website: place.website,
          photos: place.photos?.map(photo => photo.getUrl({ maxWidth: 400 }))
        }));
        
        resolve(restaurants);
      } else {
        console.error('Places search failed:', status);
        resolve(mockRestaurants);
      }
    });
  });
}

export async function searchRestaurants(
  query: string,
  location?: { lat: number; lng: number } | null
): Promise<Restaurant[]> {
  // If location is available, try OpenStreetMap first (FREE, no API key needed!)
  if (location) {
    try {
      console.log('Searching with OpenStreetMap (free, no API key needed)...');
      const osmResults = await searchOpenStreetMap(location, 5); // 5km radius
      if (osmResults.length > 0) {
        return osmResults;
      }
    } catch (error) {
      console.warn('OpenStreetMap search failed, trying Google Places...', error);
    }
    
    // Fallback to Google Places if API key is available
    if (GOOGLE_API_KEY) {
      try {
        return await searchWithGooglePlacesSDK(location, query);
      } catch (error) {
        console.error('Google Places search failed:', error);
      }
    }
  }

  // No location or all APIs failed, return filtered mock data
  const filtered = mockRestaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
    restaurant.glutenFreeOptions.some(option => 
      option.toLowerCase().includes(query.toLowerCase())
    )
  );
  
  return query ? filtered : mockRestaurants;
}