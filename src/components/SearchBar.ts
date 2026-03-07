export class SearchBar {
  private container: HTMLElement;
  private searchInput!: HTMLInputElement;
  private onSearch: (query: string) => void;
  private debounceTimer: number | null = null;

  constructor(onSearchCallback: (query: string) => void) {
    this.onSearch = onSearchCallback;
    this.container = this.createElement();
  }

  private createElement(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'px-4 py-2';

    container.innerHTML = `
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E8E93" stroke-width="2">
            <circle cx="11" cy="11" r="7"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
        </div>
        <input
          type="text"
          class="ios-search"
          placeholder="Restaurants suchen..."
        >
      </div>
    `;

    this.searchInput = container.querySelector('input') as HTMLInputElement;
    this.setupEventListeners();

    return container;
  }

  private debounce(func: () => void, delay: number): void {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
    this.debounceTimer = setTimeout(func, delay) as unknown as number;
  }

  private setupEventListeners(): void {
    this.searchInput.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      this.debounce(() => {
        this.onSearch(target.value);
      }, 400);
    });

    this.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.onSearch(this.searchInput.value);
        this.searchInput.blur();
      }
    });
  }

  render(): HTMLElement {
    return this.container;
  }
}
