import { Restaurant } from '../types';

const FAVORITES_KEY = 'gf_finder_favorites';

export function getFavorites(): Restaurant[] {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function addFavorite(restaurant: Restaurant): void {
  const favorites = getFavorites();
  if (!favorites.find(f => f.id === restaurant.id)) {
    favorites.push(restaurant);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }
}

export function removeFavorite(id: string): void {
  const favorites = getFavorites().filter(f => f.id !== id);
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function isFavorite(id: string): boolean {
  return getFavorites().some(f => f.id === id);
}

export function toggleFavorite(restaurant: Restaurant): boolean {
  if (isFavorite(restaurant.id)) {
    removeFavorite(restaurant.id);
    return false;
  } else {
    addFavorite(restaurant);
    return true;
  }
}
