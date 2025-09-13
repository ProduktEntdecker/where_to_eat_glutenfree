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
  private userLocation: { lat: number; lng: number } | undefined = undefined;

  constructor() {
    this.searchBar = new SearchBar(this.handleSearch.bind(this));
    this.loadingSpinner = new LoadingSpinner();
    this.emptyState = new EmptyState();
    this.init();
  }

  private async init() {
    console.log('App initializing...');
    this.render();
    await this.requestLocation(); 
    // Load initial restaurants
    this.handleSearch('');
  }

  private render(): void {
    const app = document.querySelector('#app');
    if (!app) {
      console.error('App element not found');
      return;
    }

    // Clear any existing content
    app.innerHTML = '';

    app.innerHTML = `
      <div class="min-h-screen bg-gray-50">
        <div class="max-w-md mx-auto bg-white min-h-screen">
          <!-- Header -->
          <div class="bg-green-500 text-white p-4">
            <h1 class="text-xl font-bold text-center">Gluten-Free Finder</h1>
            <p class="text-green-100 text-sm text-center mt-1">Find safe dining options near you</p>
          </div>
          
          <!-- Search Bar Container -->
          <div id="search-container"></div>
          
          <!-- Content Container -->
          <div id="content-container" class="p-4">
            <!-- Results will be rendered here -->
          </div>
        </div>
      </div>
    `;

    // Mount search bar
    const searchContainer = document.querySelector('#search-container');
    if (searchContainer) {
      searchContainer.appendChild(this.searchBar.render());
    }
  }

  private async handleSearch(query: string): Promise<void> {
    const contentContainer = document.querySelector('#content-container');
    if (!contentContainer) return;

    // Show loading
    contentContainer.innerHTML = '';
    contentContainer.appendChild(this.loadingSpinner.render());
    this.loadingSpinner.show();

    try {
      console.log('Searching for:', query);
      this.restaurants = await searchRestaurants(query, this.userLocation);
      
      // Hide loading
      this.loadingSpinner.hide();
      
      // Render results
      this.renderResults();
    } catch (error) {
      console.error('Search error:', error);
      this.loadingSpinner.hide();
      this.renderError();
    }
  }

  private renderResults(): void {
    const contentContainer = document.querySelector('#content-container');
    if (!contentContainer) return;

    contentContainer.innerHTML = '';

    if (this.restaurants.length === 0) {
      contentContainer.appendChild(this.emptyState.render());
      return;
    }

    // Create results container
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'space-y-4';

    // Add restaurant cards
    this.restaurants.forEach(restaurant => {
      const card = new RestaurantCard(restaurant);
      resultsContainer.appendChild(card.createElement());
    });

    contentContainer.appendChild(resultsContainer);
  }

  private renderError(): void {
    const contentContainer = document.querySelector('#content-container');
    if (!contentContainer) return;

    contentContainer.innerHTML = `
      <div class="flex flex-col items-center justify-center py-12 text-center">
        <div class="text-red-500 mb-4">
          <svg class="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">Something went wrong</h3>
        <p class="text-gray-500">Please try again later</p>
      </div>
    `;
  }

  private async requestLocation(): Promise<void> {
    try {
      console.log('Requesting location...');
      const location = await getCurrentLocation();
      if (location) {
        this.userLocation = location;
        console.log('Location obtained:', this.userLocation);
      } else {
        this.userLocation = undefined;
        console.log('Location not available');
      }
    } catch (error) {
      console.error('Location error:', error);
      this.userLocation = undefined;
    }
  }
}