export class SearchBar {
  private container: HTMLElement;
  private searchInput!: HTMLInputElement;
  private onSearch: (query: string) => void;

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
          >
        </div>
      </div>
    `;

    this.searchInput = container.querySelector('#search-input') as HTMLInputElement;
    this.setupEventListeners();

    return container;
  }

  private setupEventListeners(): void {
    this.searchInput.addEventListener('input', (e) => {
      const target = e.target as HTMLInputElement;
      this.onSearch(target.value);
    });

    this.searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.onSearch(this.searchInput.value);
      }
    });
  }

  public render(): HTMLElement {
    return this.container;
  }
}