import React from 'react';

interface UserCardProps {
  user: {
    id: string;
    full_name: string;
    skills: string[] | null;
    bio: string | null;
    distance: number; // in meters
    latitude?: number;
    longitude?: number;
    avatar_url?: string;
    distanceFormatted?: string;
  };
  onConnect: (userId: string) => void;
  connected: boolean;
}

export const UserCard: React.FC<UserCardProps> = ({ user, onConnect, connected }) => {
  const formatDistance = (meters: number): string => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${(meters / 1000).toFixed(1)} km`;
  };

  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-05">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {getInitials(user.full_name)}
              </span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-extrabold text-gray-900">{user.full_name}</h3>
            {user.distance !== undefined && (
              <p className="mt-1 text-sm text-gray-500">
                <span className="mr-2">•</span>
                {user.distanceFormatted || formatDistance(user.distance)} away
              </p>
            )}
            {user.skills && user.skills.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}
            {user.bio && (
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                {user.bio}
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <button
            onClick={() => onConnect(user.id)}
            disabled={connected}
            className={`w-full flex items-center justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus-ring-offset-2 focus-ring-indigo-500 transition-all duration-200 transform hover:-translate-y-05 disabled:opacity-50 ${
              connected
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : ''
            }`}
          >
            {connected ? 'Connected' : 'Connect'}
          </button>
        </div>
      </div>
    </div>
  );
};