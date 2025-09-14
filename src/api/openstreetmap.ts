import { Restaurant } from '../types';

/**
 * OpenStreetMap/Overpass API - Completely free, no API key needed!
 * Searches for restaurants with gluten-free options
 */

// Overpass API endpoint (free, no registration needed)
const OVERPASS_API = 'https://overpass-api.de/api/interpreter';

// Helper to calculate distance between two points
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

/**
 * Search restaurants using OpenStreetMap Overpass API
 * No API key required!
 */
export async function searchOpenStreetMap(
  location: { lat: number; lng: number },
  radiusKm: number = 5
): Promise<Restaurant[]> {
  
  // Convert radius to meters for Overpass
  const radiusMeters = radiusKm * 1000;
  
  // Overpass QL query to find restaurants
  // This searches for:
  // - Places tagged as restaurant, cafe, fast_food
  // - With diet:gluten_free=* or gluten_free=* tags
  // - Or just all restaurants if no specific gluten-free tags
  const query = `
    [out:json][timeout:25];
    (
      // Restaurants with gluten-free tags
      node["amenity"~"restaurant|cafe|fast_food"]["diet:gluten_free"](around:${radiusMeters},${location.lat},${location.lng});
      node["amenity"~"restaurant|cafe|fast_food"]["gluten_free"](around:${radiusMeters},${location.lat},${location.lng});
      // All restaurants (we'll filter later)
      node["amenity"~"restaurant|cafe|fast_food"](around:${radiusMeters},${location.lat},${location.lng});
    );
    out body;
  `;

  try {
    const response = await fetch(OVERPASS_API, {
      method: 'POST',
      body: `data=${encodeURIComponent(query)}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });

    if (!response.ok) {
      throw new Error(`Overpass API error: ${response.status}`);
    }

    const data = await response.json();
    
    // Convert OSM data to our Restaurant format
    const restaurants: Restaurant[] = data.elements
      .filter((element: any) => element.tags?.name) // Must have a name
      .map((element: any) => {
        const tags = element.tags || {};
        
        // Determine if explicitly gluten-free
        const hasGlutenFree = 
          tags['diet:gluten_free'] === 'yes' ||
          tags['gluten_free'] === 'yes' ||
          tags['diet:gluten_free'] === 'only';
        
        // Build gluten-free options description
        const glutenFreeOptions: string[] = [];
        if (tags['diet:gluten_free'] === 'yes') {
          glutenFreeOptions.push('Gluten-free options available');
        }
        if (tags['diet:gluten_free'] === 'only') {
          glutenFreeOptions.push('Fully gluten-free restaurant');
        }
        if (tags['gluten_free'] === 'yes') {
          glutenFreeOptions.push('Gluten-free menu available');
        }
        if (tags.cuisine?.includes('gluten_free')) {
          glutenFreeOptions.push('Gluten-free cuisine');
        }
        
        // If no specific tags, but it's a health/vegan place, mention to check
        if (glutenFreeOptions.length === 0) {
          if (tags['diet:vegan'] === 'yes' || tags['diet:vegetarian'] === 'yes') {
            glutenFreeOptions.push('Vegan/Vegetarian - likely has GF options');
          } else if (tags.cuisine?.includes('asian') || tags.cuisine?.includes('thai') || tags.cuisine?.includes('vietnamese')) {
            glutenFreeOptions.push('Asian cuisine - often has rice-based GF options');
          } else {
            glutenFreeOptions.push('Call to confirm gluten-free options');
          }
        }
        
        // Calculate distance
        const distance = calculateDistance(
          location.lat, location.lng,
          element.lat, element.lon
        );
        
        // Determine if currently open (basic check)
        const openingHours = tags.opening_hours;
        const openNow = openingHours ? undefined : undefined; // Complex to parse
        
        return {
          id: element.id.toString(),
          name: tags.name,
          address: [
            tags['addr:street'],
            tags['addr:housenumber'],
            tags['addr:city'],
            tags['addr:postcode']
          ].filter(Boolean).join(' ') || tags.vicinity || 'Address not available',
          rating: 0, // OSM doesn't have ratings
          priceLevel: tags.price_range ? parseInt(tags.price_range) : 0,
          openNow,
          distance: Math.round(distance * 10) / 10, // Round to 1 decimal
          glutenFreeOptions,
          phone: tags.phone || tags['contact:phone'],
          website: tags.website || tags['contact:website'],
          photos: [] // OSM doesn't provide photos directly
        } as Restaurant;
      })
      // Sort by distance and prioritize confirmed gluten-free places
      .sort((a: Restaurant, b: Restaurant) => {
        // Prioritize restaurants with confirmed GF options
        const aConfirmed = !a.glutenFreeOptions.some(opt => opt.includes('Call to confirm'));
        const bConfirmed = !b.glutenFreeOptions.some(opt => opt.includes('Call to confirm'));
        
        if (aConfirmed && !bConfirmed) return -1;
        if (!aConfirmed && bConfirmed) return 1;
        
        // Then sort by distance
        return (a.distance || 0) - (b.distance || 0);
      })
      // Limit to top 20 results
      .slice(0, 20);

    return restaurants;

  } catch (error) {
    console.error('OpenStreetMap search error:', error);
    throw error;
  }
}

/**
 * Alternative: Search using Nominatim (OSM's geocoding service)
 * Good for searching by restaurant name
 */
export async function searchNominatim(
  query: string,
  location?: { lat: number; lng: number }
): Promise<Restaurant[]> {
  const baseUrl = 'https://nominatim.openstreetmap.org/search';
  
  const params = new URLSearchParams({
    q: `${query} restaurant gluten free`,
    format: 'json',
    limit: '20',
    extratags: '1',
    addressdetails: '1'
  });

  if (location) {
    params.append('viewbox', `${location.lng-0.1},${location.lat-0.1},${location.lng+0.1},${location.lat+0.1}`);
    params.append('bounded', '1');
  }

  try {
    const response = await fetch(`${baseUrl}?${params}`, {
      headers: {
        'User-Agent': 'GlutenFreeRestaurantFinder/1.0' // Required by Nominatim
      }
    });

    const data = await response.json();
    
    return data
      .filter((place: any) => place.type === 'restaurant' || place.class === 'amenity')
      .map((place: any) => ({
        id: place.place_id.toString(),
        name: place.name || place.display_name.split(',')[0],
        address: place.display_name,
        rating: 0,
        priceLevel: 0,
        distance: location ? calculateDistance(
          location.lat, location.lng,
          parseFloat(place.lat), parseFloat(place.lon)
        ) : undefined,
        glutenFreeOptions: ['Search for gluten-free options'],
        phone: place.extratags?.phone,
        website: place.extratags?.website
      }));

  } catch (error) {
    console.error('Nominatim search error:', error);
    return [];
  }
}