import { Restaurant } from '../types';
import { isFavorite, toggleFavorite } from '../services/favorites';
import { router } from '../services/router';

export class RestaurantCard {
  private restaurant: Restaurant;

  constructor(restaurant: Restaurant) {
    this.restaurant = restaurant;
  }

  createElement(): HTMLElement {
    const card = document.createElement('div');
    card.className = 'ios-card press-effect mb-3 fade-in';
    card.style.cursor = 'pointer';

    const r = this.restaurant;
    const stars = this.renderStars(r.rating);
    const isFav = isFavorite(r.id);
    const distanceText = r.distance !== undefined ? `${r.distance.toFixed(1)} km` : '';

    const photoHtml = r.photos && r.photos.length > 0
      ? `<img src="${r.photos[0]}" alt="${r.name}" class="w-full h-40 object-cover" loading="lazy">`
      : `<div class="w-full h-32 photo-placeholder">
           <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" stroke-width="1.5">
             <path d="M21 15l-5-5L5 21"/>
             <circle cx="8.5" cy="8.5" r="2.5"/>
             <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
           </svg>
         </div>`;

    card.innerHTML = `
      ${photoHtml}
      <div class="p-3">
        <div class="flex items-start justify-between mb-1">
          <div class="flex-1 min-w-0">
            <h3 class="font-semibold text-base text-black truncate">${r.name}</h3>
            <div class="flex items-center gap-1 mt-0.5">
              ${stars}
              <span class="text-xs" style="color: var(--ios-gray)">${r.rating > 0 ? r.rating.toFixed(1) : ''}</span>
              ${r.totalRatings ? `<span class="text-xs" style="color: var(--ios-gray)">(${r.totalRatings})</span>` : ''}
              ${r.priceLevel > 0 ? `<span class="text-xs ml-1" style="color: var(--ios-gray)">${'€'.repeat(r.priceLevel)}</span>` : ''}
            </div>
          </div>
          <div class="flex items-center gap-2 ml-2 flex-shrink-0">
            ${distanceText ? `<span class="text-xs font-medium" style="color: var(--ios-gray)">${distanceText}</span>` : ''}
            <button class="favorite-btn p-1" data-id="${r.id}">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="${isFav ? 'var(--ios-red)' : 'none'}" stroke="${isFav ? 'var(--ios-red)' : 'var(--ios-gray3)'}" stroke-width="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="flex items-center gap-1.5 mb-2">
          ${r.openNow !== undefined ? `
            <span class="ios-chip ${r.openNow ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}" style="font-size: 11px; padding: 2px 8px;">
              ${r.openNow ? 'Geoeffnet' : 'Geschlossen'}
            </span>
          ` : ''}
          <span class="text-xs truncate" style="color: var(--ios-gray)">${r.address}</span>
        </div>

        <div class="flex flex-wrap gap-1">
          ${r.glutenFreeOptions.slice(0, 3).map(opt => `
            <span class="ios-chip" style="background: rgba(52, 199, 89, 0.12); color: #1a8a3e; font-size: 11px; padding: 2px 8px;">
              ${opt}
            </span>
          `).join('')}
          ${r.glutenFreeOptions.length > 3 ? `<span class="ios-chip" style="background: rgba(118, 118, 128, 0.12); color: var(--ios-gray); font-size: 11px; padding: 2px 8px;">+${r.glutenFreeOptions.length - 3}</span>` : ''}
        </div>
      </div>
    `;

    // Favorite button
    const favBtn = card.querySelector('.favorite-btn');
    if (favBtn) {
      favBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const nowFav = toggleFavorite(this.restaurant);
        const svg = favBtn.querySelector('svg');
        if (svg) {
          svg.setAttribute('fill', nowFav ? 'var(--ios-red)' : 'none');
          svg.setAttribute('stroke', nowFav ? 'var(--ios-red)' : 'var(--ios-gray3)');
        }
      });
    }

    // Card tap -> detail view
    card.addEventListener('click', () => {
      router.showDetail(this.restaurant.id);
    });

    return card;
  }

  private renderStars(rating: number): string {
    if (rating === 0) return '';
    let html = '';
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        html += '<span class="star-filled" style="font-size: 12px;">&#9733;</span>';
      } else if (i - 0.5 <= rating) {
        html += '<span class="star-filled" style="font-size: 12px;">&#9733;</span>';
      } else {
        html += '<span class="star-empty" style="font-size: 12px;">&#9733;</span>';
      }
    }
    return html;
  }
}
