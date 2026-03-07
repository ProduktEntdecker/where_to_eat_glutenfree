export class LoadingSpinner {
  private container: HTMLElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'flex flex-col items-center justify-center py-16';
    this.container.innerHTML = `
      <div class="animate-spin rounded-full h-8 w-8 border-2 border-transparent mb-3" style="border-top-color: var(--ios-green); border-right-color: var(--ios-green);"></div>
      <p class="text-sm" style="color: var(--ios-gray);">Restaurants werden gesucht...</p>
    `;
  }

  render(): HTMLElement {
    return this.container;
  }

  show(): void {
    this.container.style.display = 'flex';
  }

  hide(): void {
    this.container.style.display = 'none';
  }
}
