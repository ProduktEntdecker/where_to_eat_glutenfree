import { Geolocation } from '@capacitor/geolocation';

export async function getCurrentLocation(): Promise<{ lat: number; lng: number } | null> {
  try {
    // On native iOS this triggers the system permission prompt (backed by the
    // NSLocationWhenInUseUsageDescription string in Info.plist). On web the
    // plugin delegates to the browser Geolocation API.
    try {
      const permission = await Geolocation.checkPermissions();
      if (permission.location !== 'granted') {
        await Geolocation.requestPermissions();
      }
    } catch {
      // checkPermissions/requestPermissions is not available in every browser;
      // getCurrentPosition still prompts on its own where supported.
    }

    const position = await Geolocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000 // 5 minutes
    });

    return {
      lat: position.coords.latitude,
      lng: position.coords.longitude
    };
  } catch (error) {
    console.error('Geolocation error:', error);
    return null;
  }
}
