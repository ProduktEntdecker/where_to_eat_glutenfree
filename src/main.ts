/// <reference types="vite/client" />
import './style.css';
import { GlutenFreeFinderApp } from './app';

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Service worker registration failed - app works without it
    });
  });
}

// Initialize app
function initApp() {
  new GlutenFreeFinderApp();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
