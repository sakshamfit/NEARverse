import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface ProfileSetupProps {
  user: any;
  onProfileComplete: (profile: any) => void;
  isEdit?: boolean;
}

export const ProfileSetup: React.FC<ProfileSetupProps> = ({ user, onProfileComplete, isEdit = false }) => {
  const [fullName, setFullName] = useState('');
  const [skills, setSkills] = useState<string>('');
  const [bio, setBio] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Fetch current profile if editing
  useEffect(() => {
    if (isEdit) {
      const fetchCurrentProfile = async () => {
        setLoading(true);
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (error) throw error;
          if (data) {
            setFullName(data.full_name || '');
            setSkills(Array.isArray(data.skills) ? data.skills.join(', ') : '');
            setBio(data.bio || '');
            if (data.latitude && data.longitude) {
              setLocation({ latitude: data.latitude, longitude: data.longitude });
            }
          }
        } catch (err) {
          console.error('Error fetching profile for edit:', err);
          setError('Failed to load profile');
        } finally {
          setLoading(false);
        }
      };

      fetchCurrentProfile();
    }
  }, [isEdit, user.id]);

  // Get user's location on mount (if not editing or if we want to update location)
  useEffect(() => {
    if (!isEdit) {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser');
        return;
      }

      setIsLoadingLocation(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          setIsLoadingLocation(false);
        },
        (error) => {
          console.warn('Geolocation failed:', error);
          setIsLoadingLocation(false);
          // We'll still allow profile creation without location
          setLocation(null);
        }
      );
    }
  }, [isEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const updates: any = {
        id: user.id,
        full_name: fullName || user.email?.split('@')[0] || 'Anonymous',
        skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
        bio: bio || null,
        updated_at: new Date().toISOString(),
      };

      if (location) {
        updates.latitude = location.latitude;
        updates.longitude = location.longitude;
      }

      const { error: upsertError } = await supabase
        .from('profiles')
        .upsert(updates);

      if (upsertError) throw upsertError;

      // Fetch the updated profile
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (fetchError) throw fetchError;
      onProfileComplete(data);
    } catch (err: any) {
      setError(err.message || 'Failed to save profile');
      console.error('Profile save error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshLocation = () => {
    setIsLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoadingLocation(false);
      },
      (error) => {
        console.warn('Geolocation failed:', error);
        setIsLoadingLocation(false);
        setLocation(null);
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white rounded-2xl shadow-2xl backdrop-blur-sm border border-white/20">
        <div className="pt-10 px-8">
          <div className="text-center space-y-4">
            <div className="relative h-16 w-16 mx-auto">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-sm font-bold">N</span>
                </div>
              </div>
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900">
              {isEdit ? 'Edit your profile' : 'Complete your profile'}
            </h2>
            <p className="text-sm text-gray-600">
              {isEdit
                ? 'Update your details to help others find you nearby'
                : 'Add your name, skills, and bio to help others find you nearby'}
            </p>
          </div>
        </div>

        <form className="mt-8 space-y-6 px-8" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <input
              type="text"
              id="fullName"
              placeholder="Full name"
              required
              className="block w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-indigo-600 sm:text-sm sm:leading-6 transition-all duration-200 hover:shadow-md"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              type="text"
              id="skills"
              placeholder="e.g., JavaScript, Cooking, Guitar"
              className="block w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-indigo-600 sm:text-sm sm:leading-6 transition-all duration-200 hover:shadow-md"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
            <p className="mt-1 text-sm text-gray-500">
              We'll use your skills to find compatible people nearby
            </p>
            <textarea
              id="bio"
              rows={4}
              placeholder="Bio (optional)"
              className="block w-full rounded-xl border-0 py-3 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus-indigo-600 sm:text-sm sm:leading-6 transition-all duration-200 hover:shadow-md"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {!isEdit && (
            <>
              <div className="flex items-center text-sm text-gray-500 mb-4">
                {isLoadingLocation ? (
                  <>
                    <div className="h-4 w-4 mr-2 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Detecting your location...</span>
                  </>
                ) : location ? (
                  <>
                    <div className="h-4 w-4 mr-2 flex items-center justify-center bg-indigo-100 text-indigo-800 rounded-full">
                      <span className="text-xs">📍</span>
                    </div>
                    <span>
                      Location detected: Latitude {location?.latitude?.toFixed(4)}, Longitude {location?.longitude?.toFixed(4)}
                    </span>
                  </>
                ) : (
                  <>
                    <div className="h-4 w-4 mr-2 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-full">
                      <span className="text-xs">📍</span>
                    </div>
                    <span className="cursor-pointer hover:text-gray-900 transition-colors duration-200">
                      Click to detect location
                    </span>
                  </>
                )}
              </div>
              {location ? (
                <div className="mt-2">
                  <button
                    onClick={handleRefreshLocation}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    Refresh location
                  </button>
                </div>
              ) : (
                <div className="mt-2">
                  <button
                    onClick={handleRefreshLocation}
                    className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                  >
                    Use my location
                  </button>
                </div>
              )}
            </>
          )}

          <div className="flex items-center justify-between mt-4">
            {isEdit && (
              <button
                type="button"
                onClick={handleRefreshLocation}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                Refresh location
              </button>
            )}
          </div>

          <div className="mt-6 space-y-4">
            {error ? (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            ) : null}
            <button type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus-ring-offset-2 focus-ring-indigo-500 disabled:opacity-50 transition-all duration-200 transform hover:-translate-y-05 active:translate-y-0"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save and Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};