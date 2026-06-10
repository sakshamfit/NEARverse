export interface Player {
  id: string;
  name: string;
  position: [number, number, number];
  rotation: number;
  profession: string;
  avatarColor: string;
  isLocal?: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  reward: number;
  location: string;
  category: string;
  posterId: string;
  posterName: string;
  status: 'open' | 'accepted' | 'completed';
}

export interface Message {
  id: string;
  playerId: string;
  playerName: string;
  text: string;
  timestamp: number;
  type: 'chat' | 'emote';
}

export interface Region {
  name: string;
  position: [number, number, number];
  color: string;
  buildings: number;
}