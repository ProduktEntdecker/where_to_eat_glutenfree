/// <reference types="vite/client" />
import './style.css';
import { GlutenFreeFinderApp } from './app';

console.log('Main script loading...');

// Register service worker for PWA support
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('[SW] Registered:', registration.scope);

        // Handle updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('[SW] New version available');
              }
            });
          }
        });
      } catch (error) {
        console.error('[SW] Registration failed:', error);
      }
    });
  }
}

// Initialize the app when DOM is loaded
function initApp() {
  console.log('Initializing app...');
  new GlutenFreeFinderApp();
  registerServiceWorker();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}