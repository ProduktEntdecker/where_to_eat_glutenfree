export class EmptyState {
  private container: HTMLElement;

  constructor(
    private message = 'Keine Restaurants gefunden',
    private subMessage = 'Versuche einen anderen Suchbegriff oder Standort'
  ) {
    this.container = this.createElement();
  }

  private createElement(): HTMLElement {
    const container = document.createElement('div');
    container.className = 'flex flex-col items-center justify-center py-16 text-center px-8 fade-in';
    container.innerHTML = `
      <div class="w-16 h-16 rounded-full flex items-center justify-center mb-4" style="background: var(--ios-gray5);">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--ios-gray2)" stroke-width="1.5">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
          <circle cx="12" cy="9" r="2.5"/>
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-black mb-1">${this.message}</h3>
      <p class="text-sm" style="color: var(--ios-gray);">${this.subMessage}</p>
    `;
    return container;
  }

  render(): HTMLElement {
    return this.container;
  }
}
