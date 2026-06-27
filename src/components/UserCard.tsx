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
    <div className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="p-6">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
                {getInitials(user.full_name)}
              </span>
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">{user.full_name}</h3>
            {user.distance !== undefined && (
              <p className="mt-1 text-sm text-gray-500">
                <span className="mr-2">•</span>
                {formatDistance(user.distance)} away
              </p>
            )}
            {user.skills && user.skills.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {user.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
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
            className={`flex-1 px-4 py-2 text-sm font-medium transition-colors duration-200 ${
              connected
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {connected ? 'Connected' : 'Connect'}
          </button>
        </div>
      </div>
    </div>
  );
};