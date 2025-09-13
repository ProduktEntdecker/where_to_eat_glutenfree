import { Restaurant } from '../types';

// Mock data for demonstration
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

export async function searchRestaurants(
  query: string,
  location?: { lat: number; lng: number }
): Promise<Restaurant[]> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Filter mock data based on query
  const filtered = mockRestaurants.filter(restaurant =>
    restaurant.name.toLowerCase().includes(query.toLowerCase()) ||
    restaurant.glutenFreeOptions.some(option => 
      option.toLowerCase().includes(query.toLowerCase())
    )
  );
  
  return query ? filtered : mockRestaurants;
}