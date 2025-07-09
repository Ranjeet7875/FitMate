export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString()
        });
      },
      (error) => {
        reject(new Error(getGeolocationErrorMessage(error)));
      },
      options
    );
  });
};

export const watchLocation = (callback, errorCallback) => {
  if (!navigator.geolocation) {
    errorCallback(new Error('Geolocation is not supported by this browser'));
    return null;
  }

  const options = {
    enableHighAccuracy: true,
    timeout: 10000,
    maximumAge: 60000
  };

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      callback({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date().toISOString()
      });
    },
    (error) => {
      errorCallback(new Error(getGeolocationErrorMessage(error)));
    },
    options
  );

  return watchId;
};

export const clearLocationWatch = (watchId) => {
  if (watchId && navigator.geolocation) {
    navigator.geolocation.clearWatch(watchId);
  }
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return distance;
};

export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance.toFixed(1)}km`;
};

export const getLocationName = async (latitude, longitude) => {
  try {
    // In a real app, you'd use a geocoding service like Google Maps API
    // For now, we'll return a formatted coordinate string
    const lat = latitude.toFixed(4);
    const lon = longitude.toFixed(4);
    return `${lat}, ${lon}`;
  } catch (error) {
    console.error('Error getting location name:', error);
    return 'Unknown location';
  }
};

export const isLocationPermissionGranted = () => {
  return new Promise((resolve) => {
    if (!navigator.permissions) {
      resolve(false);
      return;
    }

    navigator.permissions.query({ name: 'geolocation' }).then((result) => {
      resolve(result.state === 'granted');
    }).catch(() => {
      resolve(false);
    });
  });
};

export const requestLocationPermission = async () => {
  try {
    const position = await getCurrentLocation();
    return { granted: true, location: position };
  } catch (error) {
    return { granted: false, error: error.message };
  }
};

const toRad = (degrees) => {
  return degrees * (Math.PI / 180);
};

const getGeolocationErrorMessage = (error) => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return 'Location access denied by user';
    case error.POSITION_UNAVAILABLE:
      return 'Location information is unavailable';
    case error.TIMEOUT:
      return 'Location request timed out';
    default:
      return 'An unknown error occurred while retrieving location';
  }
};

export const createLocationTracker = () => {
  let watchId = null;
  let isTracking = false;
  const listeners = new Set();

  const start = () => {
    if (isTracking) return;

    isTracking = true;
    watchId = watchLocation(
      (location) => {
        listeners.forEach(listener => listener(location));
      },
      (error) => {
        console.error('Location tracking error:', error);
        isTracking = false;
      }
    );
  };

  const stop = () => {
    if (!isTracking) return;

    isTracking = false;
    if (watchId) {
      clearLocationWatch(watchId);
      watchId = null;
    }
  };

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  return { start, stop, subscribe, isTracking: () => isTracking };
};