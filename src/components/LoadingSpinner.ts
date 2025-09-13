export class LoadingSpinner {
  private container: HTMLElement;

  constructor() {
    this.container = this.createElement();
  }

  private createElement(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'flex justify-center items-center py-12';
    container.innerHTML = `
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
    `;
    return container;
  }

  public render(): HTMLElement {
    return this.container;
  }

  public show(): void {
    this.container.style.display = 'flex';
  }

  public hide(): void {
    this.container.style.display = 'none';
  }
}