import { Restaurant } from '../types';
import { Share } from '@capacitor/share';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

export class RestaurantCard {
  constructor(private restaurant: Restaurant) {}

  public createElement(): HTMLElement {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow';
    
    const stars = '★'.repeat(Math.floor(this.restaurant.rating)) + '☆'.repeat(5 - Math.floor(this.restaurant.rating));
    const priceSymbols = '$'.repeat(this.restaurant.priceLevel);
    
    card.innerHTML = `
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-semibold text-lg text-gray-900">${this.restaurant.name}</h3>
        <span class="text-sm text-gray-500">${this.restaurant.distance?.toFixed(1) || '—'} km</span>
      </div>
      
      <div class="flex items-center mb-2">
        <span class="text-yellow-400 mr-2">${stars}</span>
        <span class="text-sm text-gray-600">${this.restaurant.rating}</span>
        <span class="mx-2 text-gray-400">•</span>
        <span class="text-sm text-gray-600">${priceSymbols}</span>
        ${this.restaurant.openNow !== undefined ? `
          <span class="mx-2 text-gray-400">•</span>
          <span class="text-sm ${this.restaurant.openNow ? 'text-green-600' : 'text-red-600'}">
            ${this.restaurant.openNow ? 'Open' : 'Closed'}
          </span>
        ` : ''}
      </div>
      
      <p class="text-sm text-gray-600 mb-3">${this.restaurant.address}</p>
      
      <div class="space-y-2">
        <p class="text-sm font-medium text-gray-900">Gluten-free options:</p>
        <div class="flex flex-wrap gap-1">
          ${this.restaurant.glutenFreeOptions.map(option => `
            <span class="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              ${option}
            </span>
          `).join('')}
        </div>
      </div>

      <div class="mt-3 flex justify-end">
        <button
          class="share-btn inline-flex items-center gap-1.5 text-sm font-medium text-green-700 px-3 py-1.5 rounded-full hover:bg-green-50 active:bg-green-100 transition-colors"
          aria-label="Share ${this.restaurant.name}"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
          </svg>
          Share
        </button>
      </div>
    `;

    const shareBtn = card.querySelector('.share-btn');
    shareBtn?.addEventListener('click', () => this.handleShare());

    return card;
  }

  private async handleShare(): Promise<void> {
    // Light haptic tap on native devices; silently ignored on web.
    try {
      await Haptics.impact({ style: ImpactStyle.Light });
    } catch {
      // Haptics unsupported on this platform.
    }

    const { name, address, glutenFreeOptions, website } = this.restaurant;
    try {
      await Share.share({
        title: name,
        text: `${name} — ${address}\nGluten-free options: ${glutenFreeOptions.join(', ')}`,
        url: website,
        dialogTitle: 'Share this gluten-free spot'
      });
    } catch (error) {
      // User dismissed the share sheet, or Share is unavailable on this platform.
      console.debug('Share dismissed:', error);
    }
  }
}