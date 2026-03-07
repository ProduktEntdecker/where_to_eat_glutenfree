/* eslint-disable @typescript-eslint/no-explicit-any */
interface Window {
  google?: {
    maps: {
      LatLng: new (lat: number, lng: number) => any;
      places: {
        PlacesService: new (el: HTMLElement) => {
          nearbySearch: (request: any, callback: (results: any[] | null, status: string) => void) => void;
        };
        PlacesServiceStatus: {
          OK: string;
        };
      };
    };
  };
}
