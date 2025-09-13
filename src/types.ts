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
}

export interface Location {
  lat: number;
  lng: number;
}