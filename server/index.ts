import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

interface PlayerData {
  id: string;
  name: string;
  position: [number, number, number];
  rotation: number;
  profession: string;
  avatarColor: string;
}

interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  text: string;
  timestamp: number;
  type: 'chat' | 'emote';
}

const players = new Map<string, PlayerData>();
const PROXIMITY_RADIUS = 18; // Distance in world units

// Calculate distance between two positions
function getDistance(pos1: [number, number, number], pos2: [number, number, number]): number {
  const dx = pos1[0] - pos2[0];
  const dz = pos1[2] - pos2[2];
  return Math.sqrt(dx * dx + dz * dz);
}

// Get players within proximity of a given player
function getNearbyPlayers(playerId: string): PlayerData[] {
  const currentPlayer = players.get(playerId);
  if (!currentPlayer) return [];

  return Array.from(players.values()).filter(p => {
    if (p.id === playerId) return false;
    return getDistance(currentPlayer.position, p.position) <= PROXIMITY_RADIUS;
  });
}

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  // When a player joins
  socket.on('join', (playerData: Omit<PlayerData, 'id'>) => {
    const player: PlayerData = {
      ...playerData,
      id: socket.id
    };
    
    players.set(socket.id, player);
    
    // Send existing players to the new player
    const existingPlayers = Array.from(players.values()).filter(p => p.id !== socket.id);
    socket.emit('existing_players', existingPlayers);
    
    // Broadcast new player to everyone else
    socket.broadcast.emit('player_joined', player);
    
    console.log(`${player.name} joined the world`);
  });

  // Player movement update
  socket.on('player_move', (data: { position: [number, number, number]; rotation: number }) => {
    const player = players.get(socket.id);
    if (!player) return;

    player.position = data.position;
    player.rotation = data.rotation;

    // Broadcast movement to all other players
    socket.broadcast.emit('player_moved', {
      id: socket.id,
      position: data.position,
      rotation: data.rotation
    });
  });

  // Chat message - proximity based
  socket.on('chat_message', (message: Omit<ChatMessage, 'playerId' | 'playerName'>) => {
    const player = players.get(socket.id);
    if (!player) return;

    const fullMessage: ChatMessage = {
      ...message,
      playerId: socket.id,
      playerName: player.name
    };

    // Send only to nearby players + sender
    const nearbyPlayers = getNearbyPlayers(socket.id);
    
    // Send to sender
    socket.emit('chat_message', fullMessage);
    
    // Send to nearby players
    nearbyPlayers.forEach(nearbyPlayer => {
      io.to(nearbyPlayer.id).emit('chat_message', fullMessage);
    });
  });

  // Player disconnects
  socket.on('disconnect', () => {
    const player = players.get(socket.id);
    if (player) {
      console.log(`${player.name} left the world`);
      players.delete(socket.id);
      io.emit('player_left', socket.id);
    }
  });
});

const PORT = 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 NEARverse server running on http://localhost:${PORT}`);
});