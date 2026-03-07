export interface Restaurant {
  id: string;
  name: string;
  address: string;
  rating: number;
  priceLevel: number;
  photos?: string[];
  phone?: string;
  website?: string;
  openNow?: boolean;
  distance?: number;
  glutenFreeOptions: string[];
  lat?: number;
  lng?: number;
  totalRatings?: number;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface SearchFilters {
  maxDistance: number; // in km
  minRating: number;
  openNow: boolean;
  maxPrice: number; // 1-4
}

export type TabId = 'nearby' | 'search' | 'favorites' | 'settings';
