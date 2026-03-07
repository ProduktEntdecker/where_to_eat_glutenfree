import { Restaurant } from '../types';
import { isFavorite, toggleFavorite } from '../services/favorites';
import { router } from '../services/router';

export class RestaurantDetail {
  private restaurant: Restaurant;
  private container: HTMLElement;

  constructor(restaurant: Restaurant) {
    this.restaurant = restaurant;
    this.container = document.createElement('div');
    this.container.className = 'detail-overlay slide-from-right';
    this.render();
  }

  private render(): void {
    const r = this.restaurant;
    const isFav = isFavorite(r.id);
    const stars = this.renderStars(r.rating);

    const photoHtml = r.photos && r.photos.length > 0
      ? `<div class="relative">
           <img src="${r.photos[0]}" alt="${r.name}" class="w-full h-56 object-cover">
           <div class="absolute inset-0" style="background: linear-gradient(transparent 50%, rgba(0,0,0,0.3) 100%);"></div>
         </div>`
      : `<div class="w-full h-40 photo-placeholder">
           <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#C7C7CC" stroke-width="1.5">
             <path d="M21 15l-5-5L5 21"/>
             <circle cx="8.5" cy="8.5" r="2.5"/>
             <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
           </svg>
         </div>`;

    this.container.innerHTML = `
      <div class="h-full flex flex-col">
        <!-- Nav bar -->
        <div class="ios-navbar safe-area-top px-4 py-3 flex items-center justify-between" style="z-index: 51;">
          <button id="detail-back" class="flex items-center" style="color: var(--ios-green);">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
            <span class="text-base ml-1">Zurueck</span>
          </button>
          <button id="detail-fav" class="p-1">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="${isFav ? 'var(--ios-red)' : 'none'}" stroke="${isFav ? 'var(--ios-red)' : 'var(--ios-gray3)'}" stroke-width="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="flex-1 scroll-container">
          ${photoHtml}

          <div class="px-4 py-4">
            <!-- Name & Rating -->
            <h1 class="text-2xl font-bold text-black mb-1">${r.name}</h1>
            <div class="flex items-center gap-2 mb-3">
              ${stars}
              <span class="text-sm" style="color: var(--ios-gray);">${r.rating > 0 ? r.rating.toFixed(1) : 'Keine Bewertung'}</span>
              ${r.totalRatings ? `<span class="text-sm" style="color: var(--ios-gray);">(${r.totalRatings} Bewertungen)</span>` : ''}
              ${r.priceLevel > 0 ? `<span class="text-sm" style="color: var(--ios-gray);">${'€'.repeat(r.priceLevel)}</span>` : ''}
            </div>

            <!-- Status -->
            <div class="flex items-center gap-3 mb-4">
              ${r.openNow !== undefined ? `
                <span class="ios-chip ${r.openNow ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}">
                  ${r.openNow ? 'Geoeffnet' : 'Geschlossen'}
                </span>
              ` : ''}
              ${r.distance !== undefined ? `
                <span class="text-sm" style="color: var(--ios-gray);">${r.distance.toFixed(1)} km entfernt</span>
              ` : ''}
            </div>

            <!-- Gluten-free Options -->
            <div class="ios-card p-4 mb-4">
              <h2 class="text-sm font-semibold text-black mb-2 flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--ios-green)" stroke-width="2">
                  <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                  <path d="M22 4L12 14.01l-3-3"/>
                </svg>
                Glutenfreie Optionen
              </h2>
              <div class="flex flex-wrap gap-2">
                ${r.glutenFreeOptions.map(opt => `
                  <span class="ios-chip" style="background: rgba(52, 199, 89, 0.12); color: #1a8a3e;">
                    ${opt}
                  </span>
                `).join('')}
              </div>
            </div>

            <!-- Contact Info -->
            <div class="ios-card mb-4">
              <!-- Address -->
              <a href="https://maps.apple.com/?q=${encodeURIComponent(r.name)}&address=${encodeURIComponent(r.address)}" target="_blank" class="ios-list-item">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ios-blue)" stroke-width="1.5" class="flex-shrink-0 mr-3">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                  <circle cx="12" cy="9" r="2.5"/>
                </svg>
                <div class="flex-1 min-w-0">
                  <span class="text-sm text-black block truncate">${r.address}</span>
                  <span class="text-xs" style="color: var(--ios-blue);">In Apple Maps oeffnen</span>
                </div>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ios-gray3)" stroke-width="2" class="flex-shrink-0 ml-2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </a>

              ${r.phone ? `
                <a href="tel:${r.phone}" class="ios-list-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ios-green)" stroke-width="1.5" class="flex-shrink-0 mr-3">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z"/>
                  </svg>
                  <div class="flex-1">
                    <span class="text-sm text-black">${r.phone}</span>
                    <span class="text-xs block" style="color: var(--ios-green);">Anrufen</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ios-gray3)" stroke-width="2" class="flex-shrink-0 ml-2">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </a>
              ` : ''}

              ${r.website ? `
                <a href="${r.website}" target="_blank" rel="noopener" class="ios-list-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--ios-blue)" stroke-width="1.5" class="flex-shrink-0 mr-3">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M2 12h20"/>
                    <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
                  </svg>
                  <div class="flex-1 min-w-0">
                    <span class="text-sm text-black block truncate">${r.website}</span>
                    <span class="text-xs" style="color: var(--ios-blue);">Webseite oeffnen</span>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--ios-gray3)" stroke-width="2" class="flex-shrink-0 ml-2">
                    <path d="M9 18l6-6-6-6"/>
                  </svg>
                </a>
              ` : ''}
            </div>

            <!-- Directions Button -->
            ${r.lat && r.lng ? `
              <a href="https://maps.apple.com/?daddr=${r.lat},${r.lng}" target="_blank"
                 class="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-white mb-4"
                 style="background: var(--ios-green);">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="3 11 22 2 13 21 11 13 3 11"/>
                </svg>
                Route planen
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    // Back button
    this.container.querySelector('#detail-back')?.addEventListener('click', () => {
      router.hideDetail();
    });

    // Favorite button
    this.container.querySelector('#detail-fav')?.addEventListener('click', () => {
      const nowFav = toggleFavorite(this.restaurant);
      const svg = this.container.querySelector('#detail-fav svg');
      if (svg) {
        svg.setAttribute('fill', nowFav ? 'var(--ios-red)' : 'none');
        svg.setAttribute('stroke', nowFav ? 'var(--ios-red)' : 'var(--ios-gray3)');
      }
    });
  }

  private renderStars(rating: number): string {
    if (rating === 0) return '';
    let html = '';
    for (let i = 1; i <= 5; i++) {
      html += `<span class="${i <= Math.round(rating) ? 'star-filled' : 'star-empty'}" style="font-size: 14px;">&#9733;</span>`;
    }
    return html;
  }

  getElement(): HTMLElement {
    return this.container;
  }
}
