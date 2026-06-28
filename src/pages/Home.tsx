import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { UserCard } from '../components/UserCard';
import { Map, MapMarker, MarkerContent, MarkerPopup, MapControls } from '@/components/ui/map';

const EARTH_RADIUS = 6371e3; // meters

const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) *
    Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS * c; // in meters
};

export const Home: React.FC = () => {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [radius, setRadius] = useState(10000); // 10 km in meters
  const [weather, setWeather] = useState<{
    temperature: number;
    description: string;
    humidity: number;
    windSpeed: number;
    icon: string;
  } | null>(null);
  const [weatherLoaded, setWeatherLoaded] = useState(false);

  useEffect(() => {
    const fetchUserLocation = async () => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser');
        return;
      }

      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });

          // Fetch weather data when location is obtained
          fetchWeatherData(latitude, longitude);

          setLoading(false);
        },
        (error) => {
          setError(`Error getting location: ${error.message}`);
          setLoading(false);
        }
      );
    };

    // Also handle weather API key from environment
    const fetchWeatherData = async (lat: number, lon: number) => {
      try {
        // Using OpenWeatherMap API
        const apiKey = import.meta.env.VITE_WEATHER_API_KEY || 'd9bf160308f4ac43fa3f185bd18b7567';
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        setWeather({
          temperature: Math.round(data.main.temp),
          description: data.weather[0].description,
          humidity: data.main.humidity,
          windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
          icon: data.weather[0].icon
        });
      } catch (err) {
        console.error('Weather fetch error:', err);
        // Don't set error state for weather as it's not critical
      }
    };

    fetchUserLocation();
  }, []);

  useEffect(() => {
    // Text-to-speech for weather announcement when weather data loads
    if (weather && !weatherLoaded && 'speechSynthesis' in window) {
      setWeatherLoaded(true);

      // Wait a bit for UI to load before speaking
      setTimeout(() => {
        const utterance = new SpeechSynthesisUtterance();
        const timeOfDay = getTimeOfDay();
        utterance.text = `Good ${timeOfDay}. It's currently ${weather.temperature} degrees Celsius with ${weather.description}. The humidity is ${weather.humidity} percent and wind speed is ${weather.windSpeed} kilometers per hour. Enjoy using Nearverse!`;
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        utterance.volume = 0.8;
        window.speechSynthesis.speak(utterance);
      }, 1000);
    }
  }, [weather, weatherLoaded]);

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 17) return 'afternoon';
    if (hour < 20) return 'evening';
    return 'night';
  };

  useEffect(() => {
    const fetchUsers = async () => {
      if (!userLocation) return;

      setLoading(true);
      try {
        // Get the current user's session to get their ID
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          throw new Error('User not authenticated');
        }

        // Fetch all profiles except the current user's
        const { data: profiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .neq('id', user.id);

        if (profilesError) throw profilesError;

        // Calculate distance and filter by radius
        const nearby = profiles
          .map((profile) => {
            if (profile.latitude === null || profile.longitude === null) {
              return null;
            }
            const distance = haversineDistance(
              userLocation.latitude,
              userLocation.longitude,
              profile.latitude,
              profile.longitude
            );
            return { ...profile, distance };
          })
          .filter((profile): profile is any => profile !== null && profile.distance <= radius)
          .sort((a, b) => a.distance - b.distance);

        setUsers(nearby);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to load users');
        console.error('Error fetching users:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userLocation, radius]);

  const handleRadiusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRadius(parseInt(e.target.value) * 1000); // convert km to meters
  };

  if (loading && !userLocation) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <div className="relative h-12 w-12 mx-auto">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-dashed border-indigo-200 rounded-full animate-spin">
                <span className="text-white text-sm font-bold">N</span>
              </div>
            </div>
          </div>
          <p className="mt-2 text-sm text-gray-600">Getting your location...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="relative h-8 w-8 mx-auto">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                <svg className="h-4 w-4 text-red-600" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
            </div>
          </div>
          <h2 className="text-lg font-medium text-gray-900">Something went wrong</h2>
          <p className="sm:mx-auto mt-2 text-sm text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus-ring-offset-2 focus-ring-indigo-500 transition-all duration-200 transform hover:-translate-y-05"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Location not set */}
      {!userLocation && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Please allow location access to see nearby users.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Map and users list */}
      {userLocation && (
        <>
          <div className="relative h-[400px]">
            <Map className="h-full w-full" center={[userLocation.longitude, userLocation.latitude]} zoom={13}>
              {/* User's location marker */}
              <MapMarker longitude={userLocation.longitude} latitude={userLocation.latitude}>
                <MarkerContent className="bg-indigo-600 text-white rounded-full flex items-center justify-center w-8 h-8">
                  YOU
                </MarkerContent>
              </MapMarker>

              {/* Other users markers */}
              {users.map((user) => (
                <MapMarker
                  key={user.id}
                  longitude={user.longitude}
                  latitude={user.latitude}
                >
                  <MarkerContent className="bg-green-500 text-white rounded-full flex items-center justify-center w-6 h-6">
                    {/* Show first letter of name */}
                    {user.full_name ? user.full_name.charAt(0).toUpperCase() : '?'}
                  </MarkerContent>
                  <MarkerPopup>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-900">{user.full_name || 'Anonymous'}</h3>
                      <p className="text-sm text-gray-600">
                        {user.skills && user.skills.length > 0
                          ? user.skills.join(', ')
                          : 'No skills listed'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {Math.round(user.distance)} m away
                      </p>
                    </div>
                  </MarkerPopup>
                </MapMarker>
              ))}

              {/* Map controls */}
              <MapControls
                showZoom={true}
                showLocate={true}
                className="bottom-2 right-2"
              />
            </Map>
          </div>

          {/* Weather Display */}
          {weather && (
            <div className="absolute top-4 left-4 flex items-center space-x-3 bg-white/80 backdrop-blur-sm rounded-lg p-3 shadow-lg z-10">
              <div className="text-2xl">
                {/* Weather icon would go here - simplified for now */}
                {weather.temperature > 25 ? '☀️' : weather.temperature > 15 ? '⛅' : '☁️'}
              </div>
              <div className="space-y-1 text-left">
                <p className="font-medium text-gray-900">{weather.temperature}°C</p>
                <p className="text-sm text-gray-600 capitalize">{weather.description}</p>
                <p className="text-xs text-gray-500">
                  Humidity: {weather.humidity}% | Wind: {weather.windSpeed}km/h
                </p>
              </div>
            </div>
          )}

          {/* Users list */}
          <div className="mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Nearby Users
            </h2>
            <div className="space-y-4">
              {users.length > 0 ? (
                users.map((user) => (
                  <UserCard
                    key={user.id}
                    user={{
                      id: user.id,
                      full_name: user.full_name,
                      skills: user.skills,
                      bio: user.bio,
                      distance: user.distance,
                    }}
                    onConnect={() => {
                      // Handle connect action
                      alert(`Connect request sent to ${user.full_name}`);
                    }}
                    connected={false}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No users found within {radius / 1000}km. Try increasing the search radius.
                </p>
              )}
            </div>

            {/* Radius selector */}
            <div className="mt-4 flex items-center space-x-3">
              <span className="text-sm text-gray-600">Search radius:</span>
              <select
                value={radius / 1000}
                onChange={handleRadiusChange}
                className="border border-gray-300 rounded-md px-2 py-1 bg-white text-sm focus:outline-none focus:ring-2 focus-ring-indigo-500"
              >
                <option value="5">5 km</option>
                <option value="10" selected>
                  10 km
                </option>
                <option value="20">20 km</option>
                <option value="50">50 km</option>
                <option value="100">100 km</option>
              </select>
            </div>
          </div>
        </>
      )}
    </div>
  );
};