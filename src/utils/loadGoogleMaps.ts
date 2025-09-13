// Google Maps loader utility
declare global {
  interface Window {
    google: any;
    initGoogleMaps?: () => void;
  }
}

let isLoading = false;
let isLoaded = false;

export function loadGoogleMapsAPI(): Promise<void> {
  return new Promise((resolve, reject) => {
    // Already loaded
    if (isLoaded && window.google?.maps) {
      resolve();
      return;
    }

    // Currently loading
    if (isLoading) {
      const checkLoaded = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(checkLoaded);
          isLoaded = true;
          resolve();
        }
      }, 100);
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
    
    if (!apiKey) {
      console.warn('Google Maps API key not found');
      reject(new Error('Missing API key'));
      return;
    }

    isLoading = true;

    // Create callback function
    window.initGoogleMaps = () => {
      isLoaded = true;
      isLoading = false;
      resolve();
    };

    // Create and append script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMaps`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      isLoading = false;
      reject(new Error('Failed to load Google Maps'));
    };
    
    document.head.appendChild(script);
  });
}