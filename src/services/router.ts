import { TabId } from '../types';

type RouteChangeCallback = (tab: TabId, params?: Record<string, string>) => void;

class Router {
  private currentTab: TabId = 'nearby';
  private listeners: RouteChangeCallback[] = [];
  private detailRestaurantId: string | null = null;

  navigate(tab: TabId): void {
    this.currentTab = tab;
    this.detailRestaurantId = null;
    this.notify();
  }

  showDetail(restaurantId: string): void {
    this.detailRestaurantId = restaurantId;
    this.notify();
  }

  hideDetail(): void {
    this.detailRestaurantId = null;
    this.notify();
  }

  getDetailId(): string | null {
    return this.detailRestaurantId;
  }

  getCurrentTab(): TabId {
    return this.currentTab;
  }

  onChange(callback: RouteChangeCallback): void {
    this.listeners.push(callback);
  }

  private notify(): void {
    this.listeners.forEach(cb => cb(this.currentTab));
  }
}

export const router = new Router();
