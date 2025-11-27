export class NetworkStatus {
  private container: HTMLElement;
  private isOnline: boolean;

  constructor() {
    this.isOnline = navigator.onLine;
    this.container = this.createElement();
    this.setupEventListeners();
  }

  private createElement(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'fixed bottom-4 left-4 right-4 z-50 transition-all duration-300';
    container.id = 'network-status';
    this.updateUI(container);
    return container;
  }

  private updateUI(container: HTMLElement): void {
    if (!this.isOnline) {
      container.innerHTML = `
        <div class="bg-amber-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
          <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3"/>
          </svg>
          <span class="text-sm font-medium">You're offline - showing cached results</span>
        </div>
      `;
      container.style.transform = 'translateY(0)';
      container.style.opacity = '1';
    } else {
      container.innerHTML = '';
      container.style.transform = 'translateY(100%)';
      container.style.opacity = '0';
    }
  }

  private setupEventListeners(): void {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.updateUI(this.container);
      console.log('[Network] Back online');
    });

    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.updateUI(this.container);
      console.log('[Network] Gone offline');
    });
  }

  public render(): HTMLElement {
    return this.container;
  }

  public showCacheNotice(): void {
    if (this.isOnline) {
      const notice = document.createElement('div');
      notice.className = 'bg-blue-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3';
      notice.innerHTML = `
        <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
        <span class="text-sm font-medium">Showing cached results</span>
      `;
      this.container.appendChild(notice);
      this.container.style.transform = 'translateY(0)';
      this.container.style.opacity = '1';

      // Auto-hide after 3 seconds
      setTimeout(() => {
        notice.remove();
        if (this.container.children.length === 0) {
          this.container.style.transform = 'translateY(100%)';
          this.container.style.opacity = '0';
        }
      }, 3000);
    }
  }
}
