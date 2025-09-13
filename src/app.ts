@@ .. @@
-import { MapPin, Wifi } from 'lucide';
+import { MapPin, Wifi } from 'lucide';
 import { SearchBar } from './components/SearchBar';
 import { RestaurantCard } from './components/RestaurantCard';
 import { LoadingSpinner } from './components/LoadingSpinner';
 import { EmptyState } from './components/EmptyState';
 import { getCurrentLocation } from './services/geolocation';
 import { searchRestaurants } from './api/places';
 import { Restaurant } from './types';

 export class GlutenFreeFinderApp {
   private searchBar: SearchBar;
   private loadingSpinner: LoadingSpinner;
   private emptyState: EmptyState;
   private restaurants: Restaurant[] = [];
   private userLocation: { lat: number; lng: number } | null = null;

   constructor() {
     this.searchBar = new SearchBar(this.handleSearch.bind(this));
     this.loadingSpinner = new LoadingSpinner();
     this.emptyState = new EmptyState();
     this.init();
   }

   private async init() {
+    console.log('App initializing...');
     this.render();
     await this.requestLocation();
   }