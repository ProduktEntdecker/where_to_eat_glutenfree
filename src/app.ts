import { SearchBar } from './components/SearchBar';
import { RestaurantCard } from './components/RestaurantCard';
import { LoadingSpinner } from './components/LoadingSpinner';
import { EmptyState } from './components/EmptyState';
import { TabBar } from './components/TabBar';
import { FilterBar } from './components/FilterBar';
import { RestaurantDetail } from './components/RestaurantDetail';
import { SettingsView } from './components/SettingsView';
import { getCurrentLocation } from './services/geolocation';
import { searchRestaurants, getRestaurantById } from './api/places';
import { getFavorites } from './services/favorites';
import { router } from './services/router';
import { Restaurant, SearchFilters, TabId } from './types';

export class GlutenFreeFinderApp {
  private restaurants: Restaurant[] = [];
  private userLocation: { lat: number; lng: number } | undefined;
  private loadingSpinner: LoadingSpinner;
  private filters: SearchFilters = {
    maxDistance: 50,
    minRating: 0,
    openNow: false,
    maxPrice: 4
  };
  private currentQuery = '';

  constructor() {
    this.loadingSpinner = new LoadingSpinner();
    this.init();
  }

  private async init(): Promise<void> {
    this.renderShell();

    router.onChange((_tab: TabId) => {
      const detailId = router.getDetailId();
      if (detailId) {
        this.showRestaurantDetail(detailId);
      } else {
        this.hideDetail();
        this.renderTab(router.getCurrentTab());
      }
    });

    await this.requestLocation();
    this.renderTab('nearby');
    this.handleSearch('');
  }

  private renderShell(): void {
    const app = document.querySelector('#app');
    if (!app) return;

    app.innerHTML = `
      <div class="h-full flex flex-col" style="background: var(--ios-bg);">
        <div class="ios-navbar safe-area-top px-4 pt-2 pb-2">
          <h1 id="nav-title" class="text-lg font-bold text-black text-center">In der Naehe</h1>
        </div>
        <div id="main-content" class="flex-1 overflow-hidden flex flex-col"></div>
        <div id="tab-bar-container"></div>
        <div id="detail-container"></div>
      </div>
    `;

    const tabBar = new TabBar();
    document.querySelector('#tab-bar-container')?.appendChild(tabBar.render());
  }

  private renderTab(tab: TabId): void {
    const titleMap: Record<TabId, string> = {
      nearby: 'In der Naehe',
      search: 'Suche',
      favorites: 'Favoriten',
      settings: 'Einstellungen'
    };

    const navTitle = document.querySelector('#nav-title');
    if (navTitle) navTitle.textContent = titleMap[tab];

    const content = document.querySelector('#main-content');
    if (!content) return;

    switch (tab) {
      case 'nearby':
        this.renderNearbyTab(content);
        break;
      case 'search':
        this.renderSearchTab(content);
        break;
      case 'favorites':
        this.renderFavoritesTab(content);
        break;
      case 'settings':
        this.renderSettingsTab(content);
        break;
    }
  }

  private renderNearbyTab(container: Element): void {
    container.innerHTML = `
      <div id="filter-container"></div>
      <div id="results-container" class="flex-1 scroll-container px-4 pb-24 pt-2"></div>
    `;

    const filterBar = new FilterBar(this.filters, (newFilters) => {
      this.filters = newFilters;
      this.renderResults();
    });
    document.querySelector('#filter-container')?.appendChild(filterBar.getElement());

    if (this.restaurants.length > 0) {
      this.renderResults();
    } else {
      const results = document.querySelector('#results-container');
      if (results) {
        results.innerHTML = '';
        results.appendChild(this.loadingSpinner.render());
        this.loadingSpinner.show();
      }
    }
  }

  private renderSearchTab(container: Element): void {
    container.innerHTML = `
      <div id="search-bar-container"></div>
      <div id="search-results" class="flex-1 scroll-container px-4 pb-24 pt-2"></div>
    `;

    const searchBar = new SearchBar((query) => {
      this.currentQuery = query;
      this.handleSearch(query);
    });
    document.querySelector('#search-bar-container')?.appendChild(searchBar.render());

    if (this.currentQuery && this.restaurants.length > 0) {
      this.renderResults('search-results');
    }
  }

  private renderFavoritesTab(container: Element): void {
    container.innerHTML = `
      <div id="favorites-list" class="flex-1 scroll-container px-4 pb-24 pt-4"></div>
    `;

    const favorites = getFavorites();
    const listContainer = container.querySelector('#favorites-list');
    if (!listContainer) return;

    if (favorites.length === 0) {
      const empty = new EmptyState(
        'Noch keine Favoriten',
        'Tippe auf das Herz bei einem Restaurant, um es zu speichern'
      );
      listContainer.appendChild(empty.render());
      return;
    }

    favorites.forEach(restaurant => {
      const card = new RestaurantCard(restaurant);
      listContainer.appendChild(card.createElement());
    });
  }

  private renderSettingsTab(container: Element): void {
    container.innerHTML = `
      <div class="flex-1 scroll-container pb-24">
        <div id="settings-content"></div>
      </div>
    `;

    const settingsView = new SettingsView();
    container.querySelector('#settings-content')?.appendChild(settingsView.getElement());
  }

  private async handleSearch(query: string): Promise<void> {
    const targetId = router.getCurrentTab() === 'search' ? 'search-results' : 'results-container';
    const resultsContainer = document.querySelector(`#${targetId}`);
    if (!resultsContainer) return;

    resultsContainer.innerHTML = '';
    resultsContainer.appendChild(this.loadingSpinner.render());
    this.loadingSpinner.show();

    try {
      this.restaurants = await searchRestaurants(query, this.userLocation);
      this.loadingSpinner.hide();
      this.renderResults(targetId);
    } catch (error) {
      console.error('Search error:', error);
      this.loadingSpinner.hide();
      this.renderError(targetId);
    }
  }

  private renderResults(containerId = 'results-container'): void {
    const container = document.querySelector(`#${containerId}`);
    if (!container) return;

    container.innerHTML = '';

    let filtered = this.restaurants;

    if (this.filters.openNow) {
      filtered = filtered.filter(r => r.openNow === true);
    }
    if (this.filters.minRating > 0) {
      filtered = filtered.filter(r => r.rating >= this.filters.minRating);
    }
    if (this.filters.maxDistance < 50) {
      filtered = filtered.filter(r => (r.distance || 0) <= this.filters.maxDistance);
    }
    if (this.filters.maxPrice < 4) {
      filtered = filtered.filter(r => r.priceLevel <= this.filters.maxPrice && r.priceLevel > 0);
    }

    if (filtered.length === 0) {
      const empty = new EmptyState();
      container.appendChild(empty.render());
      return;
    }

    const countEl = document.createElement('p');
    countEl.className = 'text-xs mb-3';
    countEl.style.color = 'var(--ios-gray)';
    countEl.textContent = `${filtered.length} Restaurant${filtered.length !== 1 ? 's' : ''} gefunden`;
    container.appendChild(countEl);

    filtered.forEach(restaurant => {
      const card = new RestaurantCard(restaurant);
      container.appendChild(card.createElement());
    });
  }

  private renderError(containerId = 'results-container'): void {
    const container = document.querySelector(`#${containerId}`);
    if (!container) return;

    container.innerHTML = '';
    const errorState = new EmptyState(
      'Etwas ist schiefgelaufen',
      'Bitte versuche es spaeter erneut'
    );
    container.appendChild(errorState.render());
  }

  private showRestaurantDetail(id: string): void {
    const restaurant = getRestaurantById(id)
      || this.restaurants.find(r => r.id === id)
      || getFavorites().find(r => r.id === id);

    if (!restaurant) return;

    const detailContainer = document.querySelector('#detail-container');
    if (!detailContainer) return;

    detailContainer.innerHTML = '';
    const detail = new RestaurantDetail(restaurant);
    detailContainer.appendChild(detail.getElement());
  }

  private hideDetail(): void {
    const detailContainer = document.querySelector('#detail-container');
    if (detailContainer) {
      detailContainer.innerHTML = '';
    }
  }

  private async requestLocation(): Promise<void> {
    try {
      const location = await getCurrentLocation();
      if (location) {
        this.userLocation = location;
      }
    } catch {
      this.userLocation = undefined;
    }
  }
}
