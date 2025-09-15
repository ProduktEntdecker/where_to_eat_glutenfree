/// <reference types="vite/client" />
import './style.css';
import { GlutenFreeFinderApp } from './app';
import { ErrorBoundary } from './utils/errorBoundary';

console.log('Main script loading...');

// Initialize error boundary first
ErrorBoundary.init();

// Initialize the app when DOM is loaded
function initApp() {
  console.log('Initializing app...');
  ErrorBoundary.wrap(() => {
    new GlutenFreeFinderApp();

    // Allow recovery
    window.addEventListener('app:reinit', () => {
      console.log('Re-initializing app after error recovery...');
      new GlutenFreeFinderApp();
    });
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}