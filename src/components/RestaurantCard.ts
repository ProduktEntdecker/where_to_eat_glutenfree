import { Restaurant } from '../types';

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
    `;

    return card;
  }
}