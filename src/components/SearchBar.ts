import { sanitizeInput } from '../utils/sanitize';

export class SearchBar {
  private container: HTMLElement;
  private searchInput!: HTMLInputElement;
  private onSearch: (query: string) => void;
  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(onSearchCallback: (query: string) => void) {
    this.onSearch = onSearchCallback;
    this.container = this.createElement();
  }

  private createElement(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'sticky top-0 z-20 bg-white border-b border-gray-200 p-4';
    
    container.innerHTML = `
      <div class="space-y-4">
        <div class="relative">
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <input
            type="text"
            id="search-input"
            class="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Search gluten-free restaurants..."
            aria-label="Search gluten-free restaurants"
            role="searchbox"
          >
        </div>
      </div>
    `;

    this.searchInput = container.querySelector('#search-input') as HTMLInputElement;
    this.setupEventListeners();

    return container;
  }

  private debounce(func: () => void, delay: number): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(func, delay);
  }

  private setupEventListeners(): void {
    this.searchInput.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      const sanitizedValue = sanitizeInput(target.value);
      this.debounce(() => {
        this.onSearch(sanitizedValue);
      }, 500);
    });

    this.searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const sanitizedValue = sanitizeInput(this.searchInput.value);
        this.onSearch(sanitizedValue);
      }
    });
  }

  public render(): HTMLElement {
    return this.container;
  }
}