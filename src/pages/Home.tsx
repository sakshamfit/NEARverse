import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { UserCard } from '../components/UserCard';

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
  const navigate = useNavigate();
  const [users, setUsers] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [radius, setRadius] = useState(10000); // 10 km in meters
  const [connected, setConnected] = useState<Set<string>>(new Set());

  useEffect(() => {
    let isMounted = true;
    const loadUsers = async () => {
      if (!loading && !refreshing) setLoading(true);
      try {
        // Get current user's profile to get their location
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', (await supabase.auth.getUser()).data.user?.id)
          .single();

        if (profileError) throw profileError;

        if (!profile?.latitude || !profile?.longitude) {
          setError('Location not set. Please update your profile to enable nearby discovery.');
          setUsers([]);
          setLoading(false);
          return;
        }

        // Fetch all profiles with location (excluding current user)
        const { data: allProfiles, error: profilesError } = await supabase
          .from('profiles')
          .select('*')
          .not('latitude', 'is', null)
          .not('longitude', 'is', null)
          .neq('id', profile.id);

        if (profilesError) throw profilesError;

        // Filter by distance
        const nearby = allProfiles
          .map((user) => {
            const distance = haversineDistance(
              profile.latitude,
              profile.longitude,
              user.latitude,
              user.longitude
            );
            return { ...user, distance };
          })
          .filter((user) => user.distance <= radius)
          .sort((a, b) => a.distance - b.distance);

        if (isMounted) {
          setUsers(nearby);
          setError(null);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || 'Failed to load nearby users');
          setUsers([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    };

    if (!loading && !refreshing) loadUsers();
  }, [loading, refreshing, radius]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setLoading(true), 0);
  };

  const handleConnect = async (userId: string) => {
    try {
      // In a real app, you would send a connection request to the server
      // For now, we'll just update the local state
      setConnected((prev) => {
        const newSet = new Set(prev);
        newSet.add(userId);
        return newSet;
      });
      // Optionally, show a success message
      // You could also update the database here
    } catch (err) {
      console.error('Error connecting:', err);
    }
  };

  const handleProfile = () => {
    navigate('/profile');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="space-y-4">
          <svg className="h-8 w-8 text-indigo-500 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <p className="text-sm text-gray-600">Finding people near you...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <svg className="h-8 w-8 text-red-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h2 className="text-lg font-medium text-gray-900">Something went wrong</h2>
          <p className="text-sm text-gray-600">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            People near you
          </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleProfile}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus-ring-offset-2 focus-ring-indigo-500"
            >
              Edit profile
            </button>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus-ring-offset-2 focus-ring-indigo-500"
            >
              <svg className="h-4 w-4 mr-1" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.001 8.001 0 01-4.582-9m0 0h11m-11 11a8.005 8.005 0 01-4.582 9m0 0H7m11-9v3m-3 0h.008M16 11h.01"></path>
              </svg>
              Refresh
            </button>
          </div>
        </div>

        {users.length > 0 ? (
          <div className="space-y-4">
            {users.map((user) => (
              <UserCard
                key={user.id}
                user={user}
                onConnect={handleConnect}
                connected={connected.has(user.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <svg className="h-12 w-12 text-gray-400 mx-auto mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"></circle>
              <path d="M12 8v4m0 4h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
            </svg>
            <p className="text-lg font-medium text-gray-900">
              No one nearby yet
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Try increasing your search radius or check back later.
            </p>
            <div className="mt-6 flex justify-center space-x-3">
              <button
                onClick={() => setRadius(20000)}
                className={`px-3 py-1 text-sm font-medium ${radius === 20000 ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300'} rounded-md hover:bg-gray-50`}
              >
                20km
              </button>
              <button
                onClick={() => setRadius(50000)}
                className={`px-3 py-1 text-sm font-medium ${radius === 50000 ? 'bg-indigo-600 text-white' : 'bg-white border border-gray-300'} rounded-md hover:bg-gray-50`}
              >
                50km
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};