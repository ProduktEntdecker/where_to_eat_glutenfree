export class EmptyState {
  private container: HTMLElement;

  constructor() {
    this.container = this.createElement();
  }

  private createElement(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'flex flex-col items-center justify-center py-12 text-center';
    container.innerHTML = `
      <svg class="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No restaurants found</h3>
      <p class="text-gray-500">Try adjusting your search or location</p>
    `;
    return container;
  }

  public render(): HTMLElement {
    return this.container;
  }
}