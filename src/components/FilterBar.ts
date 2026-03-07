import { SearchFilters } from '../types';

export class FilterBar {
  private container: HTMLElement;
  private filters: SearchFilters;
  private onChange: (filters: SearchFilters) => void;

  constructor(initialFilters: SearchFilters, onChange: (filters: SearchFilters) => void) {
    this.filters = { ...initialFilters };
    this.onChange = onChange;
    this.container = document.createElement('div');
    this.container.className = 'px-4 py-2 flex gap-2 overflow-x-auto';
    this.container.style.scrollbarWidth = 'none';
    this.render();
  }

  private render(): void {
    const pills = [
      { key: 'openNow', label: 'Geoeffnet', active: this.filters.openNow },
      { key: 'rating', label: '★ 4+', active: this.filters.minRating >= 4 },
      { key: 'distance', label: '< 2 km', active: this.filters.maxDistance <= 2 },
      { key: 'price1', label: '€', active: this.filters.maxPrice === 1 },
      { key: 'price2', label: '€€', active: this.filters.maxPrice === 2 },
    ];

    this.container.innerHTML = pills.map(p => `
      <button data-filter="${p.key}" class="ios-chip ${p.active ? 'filter-active' : 'filter-inactive'} flex-shrink-0 press-effect" style="padding: 6px 14px;">
        ${p.label}
      </button>
    `).join('');

    this.container.querySelectorAll('button[data-filter]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-filter')!;
        this.toggleFilter(key);
      });
    });
  }

  private toggleFilter(key: string): void {
    switch (key) {
      case 'openNow':
        this.filters.openNow = !this.filters.openNow;
        break;
      case 'rating':
        this.filters.minRating = this.filters.minRating >= 4 ? 0 : 4;
        break;
      case 'distance':
        this.filters.maxDistance = this.filters.maxDistance <= 2 ? 50 : 2;
        break;
      case 'price1':
        this.filters.maxPrice = this.filters.maxPrice === 1 ? 4 : 1;
        break;
      case 'price2':
        this.filters.maxPrice = this.filters.maxPrice === 2 ? 4 : 2;
        break;
    }
    this.render();
    this.onChange(this.filters);
  }

  getElement(): HTMLElement {
    return this.container;
  }
}
