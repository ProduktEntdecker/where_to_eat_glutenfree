export class SettingsView {
  private container: HTMLElement;

  constructor() {
    this.container = document.createElement('div');
    this.render();
  }

  private render(): void {
    const radius = localStorage.getItem('gf_search_radius') || '5';
    const apiKey = localStorage.getItem('gf_google_api_key') || '';

    this.container.innerHTML = `
      <div class="px-4 py-4">
        <!-- Search Settings -->
        <p class="text-xs font-semibold uppercase px-4 mb-1" style="color: var(--ios-gray);">Sucheinstellungen</p>
        <div class="ios-list-group mb-6">
          <div class="ios-list-item">
            <div class="flex-1">
              <span class="text-sm text-black">Suchradius</span>
            </div>
            <select id="settings-radius" class="text-sm text-right" style="color: var(--ios-blue); background: transparent; border: none; outline: none;">
              <option value="1" ${radius === '1' ? 'selected' : ''}>1 km</option>
              <option value="2" ${radius === '2' ? 'selected' : ''}>2 km</option>
              <option value="5" ${radius === '5' ? 'selected' : ''}>5 km</option>
              <option value="10" ${radius === '10' ? 'selected' : ''}>10 km</option>
              <option value="20" ${radius === '20' ? 'selected' : ''}>20 km</option>
            </select>
          </div>
        </div>

        <!-- API Configuration -->
        <p class="text-xs font-semibold uppercase px-4 mb-1" style="color: var(--ios-gray);">Google Places API</p>
        <div class="ios-list-group mb-2">
          <div class="ios-list-item flex-col items-start">
            <span class="text-sm text-black mb-2">API Key</span>
            <input id="settings-api-key" type="password" value="${apiKey}" placeholder="Google Places API Key eingeben"
              class="w-full text-sm p-2 rounded-lg" style="background: var(--ios-gray6); border: none; outline: none;">
          </div>
        </div>
        <p class="text-xs px-4 mb-6" style="color: var(--ios-gray);">
          Fuer bessere Ergebnisse mit Fotos und Bewertungen. Ohne API Key wird OpenStreetMap verwendet.
        </p>

        <!-- Data Management -->
        <p class="text-xs font-semibold uppercase px-4 mb-1" style="color: var(--ios-gray);">Daten</p>
        <div class="ios-list-group mb-6">
          <button id="settings-clear-favorites" class="ios-list-item w-full text-left">
            <span class="text-sm" style="color: var(--ios-red);">Alle Favoriten loeschen</span>
          </button>
          <button id="settings-clear-cache" class="ios-list-item w-full text-left">
            <span class="text-sm" style="color: var(--ios-red);">Cache leeren</span>
          </button>
        </div>

        <!-- About -->
        <p class="text-xs font-semibold uppercase px-4 mb-1" style="color: var(--ios-gray);">Info</p>
        <div class="ios-list-group mb-6">
          <div class="ios-list-item">
            <span class="text-sm text-black flex-1">Version</span>
            <span class="text-sm" style="color: var(--ios-gray);">2.0.0</span>
          </div>
          <div class="ios-list-item">
            <span class="text-sm text-black flex-1">Datenquelle</span>
            <span class="text-sm" style="color: var(--ios-gray);">${apiKey ? 'Google Places' : 'OpenStreetMap'}</span>
          </div>
        </div>
      </div>
    `;

    // Event listeners
    this.container.querySelector('#settings-radius')?.addEventListener('change', (e) => {
      const value = (e.target as HTMLSelectElement).value;
      localStorage.setItem('gf_search_radius', value);
    });

    this.container.querySelector('#settings-api-key')?.addEventListener('change', (e) => {
      const value = (e.target as HTMLInputElement).value;
      localStorage.setItem('gf_google_api_key', value);
    });

    this.container.querySelector('#settings-clear-favorites')?.addEventListener('click', () => {
      if (confirm('Alle Favoriten wirklich loeschen?')) {
        localStorage.removeItem('gf_finder_favorites');
        alert('Favoriten geloescht');
      }
    });

    this.container.querySelector('#settings-clear-cache')?.addEventListener('click', () => {
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => caches.delete(name));
        });
      }
      localStorage.removeItem('gf_api_cache');
      alert('Cache geleert');
    });
  }

  getElement(): HTMLElement {
    return this.container;
  }
}
