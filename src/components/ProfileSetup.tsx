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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <img className="mx-auto h-12 w-12" src="https://ui-avatars.com/api/?background=random&size=128" alt="Logo" />
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isEdit ? 'Edit your profile' : 'Complete your profile'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isEdit ? 'Update your details to help others find you nearby' : 'Add your name, skills, and bio to help others find you nearby'}
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
              Full name
            </label>
            <input
              type="text"
              id="fullName"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700">
              Skills (comma-separated)
            </label>
            <input
              type="text"
              id="skills"
              placeholder="e.g., JavaScript, Cooking, Guitar"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
            <p className="mt-1 text-sm text-gray-500">
              We'll use your skills to find compatible people nearby
            </p>
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
              Bio (optional)
            </label>
            <textarea
              id="bio"
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          {!isEdit && (
            <>
              <div className="flex items-center text-sm text-gray-500">
                {isLoadingLocation ? (
                  <>
                    <svg className="h-4 w-4 mr-2 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                    </svg>
                    <span>Detecting your location...</span>
                  </>
                ) : location ? (
                  <>
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      Location detected: Latitude {location?.latitude?.toFixed(4)}, Longitude {location?.longitude?.toFixed(4)}
                    </span>
                  </>
                : (
                  <>
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Click to detect location</span>
                  </>
                )}
              </div>
              {location ? (
                <div className="mt-2">
                  <button
                    onClick={handleRefreshLocation}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Refresh location
                  </button>
                </div>
              ) : (
                <div className="mt-2">
                  <button
                    onClick={handleRefreshLocation}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    Use my location
                  </button>
                </div>
              )}
            </>
          )}

          <div className="flex items-center justify-between">
            {isEdit && (
              <button
                type="button"
                onClick={() => {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                      );
                    },
                    (error) => {
                      setLocation(null);
                    }
                  );
                }}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Refresh location
              </button>
            )}
          </div>

          <div>
            {error ? (
              <p className="mt-2 text-sm text-red-600">{error}</p>
            ) : null}
            <button type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus-ring-offset-2 focus-ring-indigo-500 disabled:opacity-50"
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