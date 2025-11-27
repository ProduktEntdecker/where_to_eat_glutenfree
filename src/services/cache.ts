import { Restaurant } from '../types';

const CACHE_KEY_PREFIX = 'gf-finder-cache';
const CACHE_DURATION_MS = (import.meta.env.VITE_CACHE_DURATION_MINUTES || 30) * 60 * 1000;
const CACHE_ENABLED = import.meta.env.VITE_ENABLE_CACHE !== 'false';

interface CacheEntry {
  data: Restaurant[];
  timestamp: number;
  location: { lat: number; lng: number };
}

function getCacheKey(location: { lat: number; lng: number }): string {
  // Round location to 3 decimal places (~100m precision) for cache grouping
  const lat = location.lat.toFixed(3);
  const lng = location.lng.toFixed(3);
  return `${CACHE_KEY_PREFIX}-${lat}-${lng}`;
}

export function getCachedResults(
  location: { lat: number; lng: number }
): Restaurant[] | null {
  if (!CACHE_ENABLED) return null;

  try {
    const key = getCacheKey(location);
    const cached = localStorage.getItem(key);

    if (!cached) return null;

    const entry: CacheEntry = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is expired
    if (now - entry.timestamp > CACHE_DURATION_MS) {
      localStorage.removeItem(key);
      console.log('[Cache] Expired, removed');
      return null;
    }

    console.log('[Cache] Hit - serving cached results');
    return entry.data;
  } catch (error) {
    console.error('[Cache] Error reading cache:', error);
    return null;
  }
}

export function setCachedResults(
  location: { lat: number; lng: number },
  data: Restaurant[]
): void {
  if (!CACHE_ENABLED) return;

  try {
    const key = getCacheKey(location);
    const entry: CacheEntry = {
      data,
      timestamp: Date.now(),
      location
    };

    localStorage.setItem(key, JSON.stringify(entry));
    console.log('[Cache] Saved results');
  } catch (error) {
    // localStorage might be full or disabled
    console.error('[Cache] Error saving cache:', error);
    cleanOldCaches();
  }
}

export function cleanOldCaches(): void {
  try {
    const now = Date.now();
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(CACHE_KEY_PREFIX)) {
        try {
          const cached = localStorage.getItem(key);
          if (cached) {
            const entry: CacheEntry = JSON.parse(cached);
            if (now - entry.timestamp > CACHE_DURATION_MS) {
              keysToRemove.push(key);
            }
          }
        } catch {
          keysToRemove.push(key);
        }
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
    if (keysToRemove.length > 0) {
      console.log(`[Cache] Cleaned ${keysToRemove.length} expired entries`);
    }
  } catch (error) {
    console.error('[Cache] Error cleaning cache:', error);
  }
}

export function clearAllCaches(): void {
  try {
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(CACHE_KEY_PREFIX)) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach(key => localStorage.removeItem(key));
    console.log(`[Cache] Cleared ${keysToRemove.length} entries`);
  } catch (error) {
    console.error('[Cache] Error clearing cache:', error);
  }
}
