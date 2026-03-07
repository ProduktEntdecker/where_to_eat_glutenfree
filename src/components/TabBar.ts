import { TabId } from '../types';
import { router } from '../services/router';

interface TabConfig {
  id: TabId;
  label: string;
  icon: string;
}

const TABS: TabConfig[] = [
  {
    id: 'nearby',
    label: 'In der Naehe',
    icon: '<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>'
  },
  {
    id: 'search',
    label: 'Suche',
    icon: '<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>'
  },
  {
    id: 'favorites',
    label: 'Favoriten',
    icon: '<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>'
  },
  {
    id: 'settings',
    label: 'Einstellungen',
    icon: '<svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>'
  }
];

export class TabBar {
  private container: HTMLElement;

  constructor() {
    this.container = document.createElement('div');
    this.container.className = 'ios-tabbar safe-area-bottom flex justify-around items-start pt-1 px-2';
    this.container.style.position = 'fixed';
    this.container.style.bottom = '0';
    this.container.style.left = '0';
    this.container.style.right = '0';
    this.container.style.zIndex = '40';

    this.renderTabs();

    router.onChange(() => this.updateActive());
  }

  private renderTabs(): void {
    this.container.innerHTML = TABS.map(tab => `
      <button data-tab="${tab.id}" class="flex flex-col items-center pt-1 pb-1 px-3 min-w-0" style="flex: 1;">
        <span class="tab-icon" style="color: ${tab.id === router.getCurrentTab() ? 'var(--ios-green)' : 'var(--ios-gray)'}">${tab.icon}</span>
        <span class="text-[10px] mt-0.5" style="color: ${tab.id === router.getCurrentTab() ? 'var(--ios-green)' : 'var(--ios-gray)'}">${tab.label}</span>
      </button>
    `).join('');

    this.container.querySelectorAll('button[data-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab') as TabId;
        router.navigate(tabId);
      });
    });
  }

  private updateActive(): void {
    const current = router.getCurrentTab();
    this.container.querySelectorAll('button[data-tab]').forEach(btn => {
      const tabId = btn.getAttribute('data-tab');
      const isActive = tabId === current;
      const icon = btn.querySelector('.tab-icon') as HTMLElement;
      const label = btn.querySelector('span:last-child') as HTMLElement;
      if (icon) icon.style.color = isActive ? 'var(--ios-green)' : 'var(--ios-gray)';
      if (label) label.style.color = isActive ? 'var(--ios-green)' : 'var(--ios-gray)';
    });
  }

  render(): HTMLElement {
    return this.container;
  }
}
