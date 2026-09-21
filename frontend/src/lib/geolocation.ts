export function getCurrentPosition(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      reject(new Error('Geolocation is not supported on this device.'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      resolve,
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          reject(
            new Error(
              'Location permission is required to login. Please enable location permission and try again.',
            ),
          );
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          reject(new Error('GPS is unavailable. Please enable location services and try again.'));
        } else {
          reject(new Error('Unable to retrieve your location. Please try again.'));
        }
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 },
    );
  });
}
