import { useState, useEffect } from 'react';
import { getCurrentLocation, calculateDistance } from '../utils/geolocation';

const GeoLogger = ({ onLocationUpdate, sessions = [] }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [isTracking, setIsTracking] = useState(false);
  const [nearbyWorkouts, setNearbyWorkouts] = useState([]);
  const [locationError, setLocationError] = useState(null);

  useEffect(() => {
    if (isTracking) {
      startLocationTracking();
    } else {
      stopLocationTracking();
    }
  }, [isTracking]);

  useEffect(() => {
    if (currentLocation && sessions.length > 0) {
      findNearbyWorkouts();
    }
  }, [currentLocation, sessions]);

  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000
    };

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: new Date().toISOString()
        };
        setCurrentLocation(location);
        setLocationError(null);
        onLocationUpdate(location);
      },
      (error) => {
        setLocationError(`Location error: ${error.message}`);
        console.error('Geolocation error:', error);
      },
      options
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  };

  const stopLocationTracking = () => {
    setCurrentLocation(null);
    setLocationError(null);
  };

  const findNearbyWorkouts = () => {
    if (!currentLocation) return;

    const nearby = sessions.filter(session => {
      if (!session.location) return false;
      
      const distance = calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        session.location.latitude,
        session.location.longitude
      );
      
      return distance <= 1; // Within 1km
    }).map(session => ({
      ...session,
      distance: calculateDistance(
        currentLocation.latitude,
        currentLocation.longitude,
        session.location.latitude,
        session.location.longitude
      )
    })).sort((a, b) => a.distance - b.distance);

    setNearbyWorkouts(nearby);
  };

  const getCurrentLocationOnce = async () => {
    try {
      const location = await getCurrentLocation();
      setCurrentLocation(location);
      setLocationError(null);
      onLocationUpdate(location);
    } catch (error) {
      setLocationError(`Failed to get location: ${error.message}`);
    }
  };

  const formatLocation = (location) => {
    if (!location) return 'Unknown location';
    return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Location Tracking</h3>
        <button
          onClick={() => setIsTracking(!isTracking)}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            isTracking
              ? 'bg-red-500 text-white hover:bg-red-600'
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {isTracking ? 'Stop Tracking' : 'Start Tracking'}
        </button>
      </div>

      {/* Current Location */}
      <div className="mb-4">
        <div className="flex items-center space-x-2 mb-2">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm font-medium text-gray-700">Current Location</span>
        </div>
        <p className="text-sm text-gray-600 font-mono">
          {currentLocation ? formatLocation(currentLocation) : 'Location not available'}
        </p>
        {currentLocation && (
          <p className="text-xs text-gray-500 mt-1">
            Accuracy: ±{currentLocation.accuracy}m
          </p>
        )}
      </div>

      {/* Manual Location Button */}
      {!isTracking && (
        <button
          onClick={getCurrentLocationOnce}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors mb-4"
        >
          Get Current Location
        </button>
      )}

      {/* Location Error */}
      {locationError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-red-600">{locationError}</p>
        </div>
      )}

      {/* Nearby Workouts */}
      {nearbyWorkouts.length > 0 && (
        <div className="mt-4">
          <h4 className="text-md font-semibold text-gray-800 mb-2">Nearby Workouts</h4>
          <div className="space-y-2">
            {nearbyWorkouts.slice(0, 3).map((workout, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">{workout.type}</p>
                    <p className="text-sm text-gray-600">{workout.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-600">
                      {workout.distance.toFixed(1)} km away
                    </p>
                    <p className="text-xs text-gray-500">
                      {workout.duration} min
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Location Status */}
      <div className="mt-4 flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${
          isTracking ? 'bg-green-500 animate-pulse' : 'bg-gray-300'
        }`}></div>
        <span className="text-sm text-gray-600">
          {isTracking ? 'Tracking active' : 'Tracking inactive'}
        </span>
      </div>
    </div>
  );
};

export default GeoLogger;