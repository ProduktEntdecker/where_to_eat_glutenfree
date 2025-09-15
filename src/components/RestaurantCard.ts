import { Restaurant } from '../types';
import { escapeText, sanitizeURL } from '../utils/sanitize';

export class RestaurantCard {
  constructor(private restaurant: Restaurant) {}

  public createElement(): HTMLElement {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow';
    
    const stars = '★'.repeat(Math.floor(this.restaurant.rating)) + '☆'.repeat(5 - Math.floor(this.restaurant.rating));
    const priceSymbols = '$'.repeat(this.restaurant.priceLevel);
    
    card.innerHTML = `
      <div class="flex justify-between items-start mb-2">
        <h3 class="font-semibold text-lg text-gray-900">${escapeText(this.restaurant.name)}</h3>
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
      
      <p class="text-sm text-gray-600 mb-3">${escapeText(this.restaurant.address)}</p>
      
      <div class="space-y-2">
        <p class="text-sm font-medium text-gray-900">Gluten-free info:</p>
        <div class="flex flex-wrap gap-1">
          ${this.restaurant.glutenFreeOptions.map(option => {
            // Color code based on confidence level
            let colorClass = 'bg-gray-100 text-gray-700'; // Default
            if (option.includes('Fully gluten-free') || option.includes('Certified')) {
              colorClass = 'bg-green-100 text-green-800 font-semibold';
            } else if (option.includes('naturally GF') || option.includes('Rice') || option.includes('Corn tortillas')) {
              colorClass = 'bg-blue-100 text-blue-800';
            } else if (option.includes('No GF info') || option.includes('call to confirm')) {
              colorClass = 'bg-orange-100 text-orange-800';
            } else if (option.includes('available') || option.includes('options')) {
              colorClass = 'bg-green-50 text-green-700';
            }

            return `<span class="inline-block ${colorClass} text-xs px-2 py-1 rounded-full">
              ${escapeText(option)}
            </span>`;
          }).join('')}
        </div>
        ${this.restaurant.phone ? `
          <div class="mt-2">
            <a href="tel:${escapeText(this.restaurant.phone)}" class="text-sm text-blue-600 hover:underline">
              📞 ${escapeText(this.restaurant.phone)}
            </a>
          </div>
        ` : ''}
        ${this.restaurant.website ? `
          <div class="mt-1">
            <a href="${sanitizeURL(this.restaurant.website)}" target="_blank" rel="noopener noreferrer" class="text-sm text-blue-600 hover:underline">
              🌐 Visit website
            </a>
          </div>
        ` : ''}
      </div>
    `;

    return card;
  }
}