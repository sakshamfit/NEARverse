import { create } from 'zustand';
import type { Player, Task, Message } from '../types';

interface GameState {
  localPlayer: Player | null;
  players: Player[];
  messages: Message[];
  tasks: Task[];
  
  // Actions
  setLocalPlayer: (player: Player) => void;
  updatePlayerPosition: (position: [number, number, number], rotation: number) => void;
  
  // Remote player actions
  addRemotePlayer: (player: Player) => void;
  removeRemotePlayer: (id: string) => void;
  updateRemotePlayer: (id: string, position: [number, number, number], rotation: number) => void;
  
  addMessage: (message: Message) => void;
  addTask: (task: Task) => void;
  acceptTask: (taskId: string) => void;
  completeTask: (taskId: string) => void;
}

export const useGameStore = create<GameState>((set) => ({
  localPlayer: null,
  
  players: [],
  messages: [],
  tasks: [
    {
      id: 't1',
      title: 'Need electrician for home wiring',
      description: 'My ceiling fan wiring needs repair in Gomti Nagar',
      reward: 450,
      location: 'Lucknow - Gomti Nagar',
      category: 'Electrical',
      posterId: 'p1',
      posterName: 'Sunita Devi',
      status: 'open',
    },
    {
      id: 't2',
      title: 'Looking for logo designer',
      description: 'Need modern logo for my new cafe business',
      reward: 1200,
      location: 'Noida - Sector 62',
      category: 'Design',
      posterId: 'p2',
      posterName: 'Arjun Mehra',
      status: 'open',
    },
    {
      id: 't3',
      title: 'Math tutor needed for class 10',
      description: '2 hours daily, weekends preferred',
      reward: 800,
      location: 'Varanasi - Assi Ghat area',
      category: 'Education',
      posterId: 'p3',
      posterName: 'Ramesh Kumar',
      status: 'open',
    },
  ],

  setLocalPlayer: (player) => set({ localPlayer: player }),
  
  updatePlayerPosition: (position, rotation) =>
    set((state) => ({
      localPlayer: state.localPlayer
        ? { ...state.localPlayer, position, rotation }
        : null,
    })),

  addRemotePlayer: (player) =>
    set((state) => ({
      players: [...state.players.filter((p) => p.id !== player.id), player],
    })),

  removeRemotePlayer: (id) =>
    set((state) => ({
      players: state.players.filter((p) => p.id !== id),
    })),

  updateRemotePlayer: (id, position, rotation) =>
    set((state) => ({
      players: state.players.map((p) =>
        p.id === id ? { ...p, position, rotation } : p
      ),
    })),

  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages.slice(-40), message],
    })),

  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),

  acceptTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status: 'accepted' } : t
      ),
    })),

  completeTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, status: 'completed' } : t
      ),
    })),
}));