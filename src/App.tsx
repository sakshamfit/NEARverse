import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { GameWorld } from './components/GameWorld';
import { ChatPanel } from './components/ChatPanel';
import { TaskMarket } from './components/TaskMarket';
import { PlayerHUD } from './components/PlayerHUD';
import { AuthScreen } from './components/AuthScreen';
import { UsernameSetup } from './components/UsernameSetup';
import { useGameStore } from './store/gameStore';
import { socketManager } from './lib/socket';
import type { Player, Message } from './types';
import type { User } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';
import './App.css';

function App() {
  const [showTaskMarket, setShowTaskMarket] = useState(false);
  const [showChat, setShowChat] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsUsernameSetup, setNeedsUsernameSetup] = useState(false);

  const { 
    localPlayer, 
    players, 
    messages, 
    tasks,
    setLocalPlayer,
    updatePlayerPosition,
    addRemotePlayer,
    removeRemotePlayer,
    updateRemotePlayer,
    addMessage,
    acceptTask,
    completeTask
  } = useGameStore();

  // Check for existing session
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profileData) {
          setProfile(profileData);
          initializeGame(profileData, session.user);
        }
      }
      
      setIsLoading(false);
    };

    checkSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();
          
          if (profileData) {
            setProfile(profileData);
            setNeedsUsernameSetup(false);
            initializeGame(profileData, session.user);
          } else {
            // Google login or new user - needs username setup
            setNeedsUsernameSetup(true);
          }
        } else {
          setUser(null);
          setProfile(null);
          setNeedsUsernameSetup(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const initializeGame = (profileData: any, authUser: User) => {
    // Create local player from profile
    const local: Player = {
      id: authUser.id,
      name: profileData.name,
      position: [0, 0.5, 0],
      rotation: 0,
      profession: profileData.profession,
      avatarColor: profileData.avatar_color || '#7c3aed',
      isLocal: true,
    };
    
    setLocalPlayer(local);

    // Connect to Socket.IO server
    socketManager.connect();
    setIsConnected(true);

    // Join the world with real username
    socketManager.join({
      name: profileData.name,
      position: local.position,
      rotation: local.rotation,
      profession: profileData.profession,
      avatarColor: profileData.avatar_color || '#7c3aed',
    });

    // Set up socket listeners
    setupSocketListeners();
  };

  const setupSocketListeners = () => {
    const handleExistingPlayers = (existingPlayers: Player[]) => {
      existingPlayers.forEach(p => addRemotePlayer(p));
    };

    const handlePlayerJoined = (player: Player) => {
      addRemotePlayer(player);
    };

    const handlePlayerMoved = (data: { id: string; position: [number, number, number]; rotation: number }) => {
      updateRemotePlayer(data.id, data.position, data.rotation);
    };

    const handlePlayerLeft = (playerId: string) => {
      removeRemotePlayer(playerId);
    };

    const handleChatMessage = (message: Message) => {
      addMessage(message);
    };

    socketManager.on('existing_players', handleExistingPlayers);
    socketManager.on('player_joined', handlePlayerJoined);
    socketManager.on('player_moved', handlePlayerMoved);
    socketManager.on('player_left', handlePlayerLeft);
    socketManager.on('chat_message', handleChatMessage);
  };

  const handleAuthSuccess = (authUser: User, userProfile: any) => {
    setUser(authUser);
    setProfile(userProfile);
    initializeGame(userProfile, authUser);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setLocalPlayer({} as any); // reset player
    socketManager.disconnect();
    window.location.reload();
  };

  // Send movement updates to server
  const handlePlayerMove = (position: [number, number, number], rotation: number) => {
    updatePlayerPosition(position, rotation);
    socketManager.sendMovement(position, rotation);
  };

  const handleSendMessage = (text: string) => {
    if (!localPlayer) return;

    const message: Message = {
      id: Date.now().toString(),
      playerId: localPlayer.id,
      playerName: localPlayer.name,
      text,
      timestamp: Date.now(),
      type: 'chat'
    };

    addMessage(message);
    socketManager.sendChatMessage(text, 'chat');
  };

  const handleEmote = (emote: string) => {
    if (!localPlayer) return;

    const message: Message = {
      id: Date.now().toString(),
      playerId: localPlayer.id,
      playerName: localPlayer.name,
      text: emote,
      timestamp: Date.now(),
      type: 'emote'
    };

    addMessage(message);
    socketManager.sendChatMessage(emote, 'emote');
  };

  // Show auth screen if not logged in
  if (isLoading) {
    return (
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <span className="logo-text">NEAR</span>
            <span className="logo-world">VERSE</span>
          </div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  // Show username setup if user logged in (e.g. Google) but has no profile
  if (needsUsernameSetup && user) {
    return (
      <UsernameSetup 
        user={user} 
        onComplete={(newProfile) => {
          setProfile(newProfile);
          setNeedsUsernameSetup(false);
          initializeGame(newProfile, user);
        }} 
      />
    );
  }

  if (!profile) {
    return <AuthScreen onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="game-container">
      {/* Top Navigation Bar */}
      <nav className="game-nav">
        <div className="nav-left">
          <div className="logo">
            <span className="logo-text">NEAR</span>
            <span className="logo-world">VERSE</span>
          </div>
          <div className="tagline">Play Online. Work Offline.</div>
        </div>
        
        <div className="nav-center">
          <div className="region-indicator">
            📍 Lucknow District
          </div>
          <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
            {isConnected ? '🟢 Live' : '🔴 Offline'}
          </div>
        </div>

        <div className="nav-right">
          <button 
            className="nav-btn"
            onClick={() => setShowTaskMarket(!showTaskMarket)}
          >
            📋 Tasks
          </button>
          <button 
            className="nav-btn"
            onClick={() => setShowChat(!showChat)}
          >
            💬 Chat
          </button>
          <div className="player-info" onClick={handleLogout} style={{cursor: 'pointer'}}>
            <div className="player-avatar" style={{ backgroundColor: localPlayer?.avatarColor || '#ff6b6b' }} />
            <span>@{profile.username}</span>
          </div>
        </div>
      </nav>

      {/* Main 3D Canvas */}
      <div className="world-canvas">
        <Canvas
          camera={{ position: [0, 25, 35], fov: 50 }}
          style={{ background: 'linear-gradient(to bottom, #87CEEB 0%, #E0F7FA 100%)' }}
        >
          <ambientLight intensity={0.6} />
          <directionalLight 
            position={[50, 80, 30]} 
            intensity={1.2} 
            castShadow 
            shadow-mapSize={[2048, 2048]}
          />
          <pointLight position={[-30, 20, -30]} intensity={0.4} color="#fff4e6" />

          <GameWorld 
            localPlayer={localPlayer}
            players={players}
            onPlayerMove={handlePlayerMove}
          />
          
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={8}
            maxDistance={60}
            maxPolarAngle={Math.PI * 0.75}
          />
        </Canvas>
      </div>

      {/* Floating UI Panels */}
      {showChat && (
        <ChatPanel 
          messages={messages}
          onSendMessage={handleSendMessage}
          onEmote={handleEmote}
          onClose={() => setShowChat(false)}
        />
      )}

      {showTaskMarket && (
        <TaskMarket 
          tasks={tasks}
          onAcceptTask={acceptTask}
          onCompleteTask={completeTask}
          onClose={() => setShowTaskMarket(false)}
        />
      )}

      {/* Player HUD */}
      <PlayerHUD 
        player={localPlayer}
        nearbyPlayers={players.filter(p => p.id !== localPlayer?.id).slice(0, 3)}
      />

      {/* Controls Help */}
      <div className="controls-help">
        <div className="help-item">WASD • Move</div>
        <div className="help-item">SPACE • Jump</div>
        <div className="help-item">E • Interact</div>
        <div className="help-item">Mouse • Look</div>
      </div>

      {/* Bottom Status Bar */}
      <div className="status-bar">
        <div className="status-item">
          <span className="status-label">Connect Coins</span>
          <span className="status-value">{profile.connect_coins || 100}</span>
        </div>
        <div className="status-item">
          <span className="status-label">Trust Score</span>
          <span className="status-value">{profile.trust_score || 50}</span>
        </div>
        <div className="status-item">
          <span className="status-label">Players Online</span>
          <span className="status-value">{players.length + 1}</span>
        </div>
        <div className="status-item">
          <span className="status-label">Region</span>
          <span className="status-value">Hazratganj</span>
        </div>
      </div>
    </div>
  );
}

export default App;