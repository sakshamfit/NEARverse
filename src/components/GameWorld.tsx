import { useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import type { Player } from '../types';
import { PlayerAvatar } from './PlayerAvatar';
import { Building } from './Building';
import { Ground } from './Ground';
import { Trees } from './Trees';
import { RegionMarkers } from './RegionMarkers';
import { ProximityIndicator } from './ProximityIndicator';

interface GameWorldProps {
  localPlayer: Player | null;
  players: Player[];
  onPlayerMove: (position: [number, number, number], rotation: number) => void;
}

export function GameWorld({ localPlayer, players, onPlayerMove }: GameWorldProps) {
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const localPlayerRef = useRef<THREE.Group>(null);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(prev => new Set(prev).add(e.key.toLowerCase()));
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      const newKeys = new Set(keys);
      newKeys.delete(e.key.toLowerCase());
      setKeys(newKeys);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keys]);

  // Movement loop
  useFrame((_, delta) => {
    if (!localPlayer || !localPlayerRef.current) return;

    const speed = keys.has('shift') ? 12 : 6;
    const moveSpeed = speed * delta;
    
    let moveX = 0;
    let moveZ = 0;

    if (keys.has('w')) moveZ -= 1;
    if (keys.has('s')) moveZ += 1;
    if (keys.has('a')) moveX -= 1;
    if (keys.has('d')) moveX += 1;

    if (moveX !== 0 || moveZ !== 0) {
      // Normalize diagonal movement
      const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
      moveX /= length;
      moveZ /= length;

      const currentPos = localPlayer.position;
      const newX = Math.max(-45, Math.min(45, currentPos[0] + moveX * moveSpeed));
      const newZ = Math.max(-35, Math.min(35, currentPos[2] + moveZ * moveSpeed));

      // Calculate rotation based on movement direction
      const rotation = Math.atan2(moveX, moveZ);

      onPlayerMove([newX, currentPos[1], newZ], rotation);
      
      // Update local mesh position
      localPlayerRef.current.position.x = newX;
      localPlayerRef.current.position.z = newZ;
      localPlayerRef.current.rotation.y = rotation;
    }
  });

  return (
    <>
      {/* Ground */}
      <Ground />

      {/* Stylized Buildings - Lucknow District */}
      <Building position={[-25, 0, -20]} scale={[1.2, 1.8, 1.2]} color="#f4a261" type="cafe" />
      <Building position={[-15, 0, -18]} scale={[1, 2.2, 1]} color="#e76f51" type="shop" />
      <Building position={[-5, 0, -22]} scale={[1.5, 2.5, 1.3]} color="#2a9d8f" type="office" />
      <Building position={[8, 0, -19]} scale={[0.9, 1.6, 0.9]} color="#e9c46a" type="house" />
      
      {/* Noida Tech City Buildings */}
      <Building position={[25, 0, -15]} scale={[1.8, 3.2, 1.8]} color="#264653" type="tech" />
      <Building position={[32, 0, -8]} scale={[1.3, 2.8, 1.3]} color="#457b9d" type="tech" />
      <Building position={[18, 0, -25]} scale={[1.5, 2.4, 1.5]} color="#1d3557" type="tech" />

      {/* Kanpur Industrial Zone */}
      <Building position={[-35, 0, 8]} scale={[2.2, 1.4, 2.5]} color="#6d6875" type="factory" />
      <Building position={[-28, 0, 18]} scale={[1.6, 1.8, 1.8]} color="#b5838d" type="workshop" />

      {/* Varanasi Heritage */}
      <Building position={[-8, 0, 22]} scale={[1.1, 2.1, 1.1]} color="#e63946" type="temple" />
      <Building position={[3, 0, 28]} scale={[0.8, 1.5, 0.8]} color="#f4a261" type="ghat" />

      {/* Agra Tourism */}
      <Building position={[28, 0, 20]} scale={[1.4, 1.9, 1.4]} color="#ffd166" type="hotel" />
      <Building position={[35, 0, 12]} scale={[1.0, 1.3, 1.0]} color="#06d6a0" type="shop" />

      {/* Trees and Environment */}
      <Trees />

      {/* Region Markers */}
      <RegionMarkers />

      {/* Local Player Avatar */}
      {localPlayer && (
        <group ref={localPlayerRef} position={localPlayer.position}>
          <PlayerAvatar 
            profession={localPlayer.profession} 
            color={localPlayer.avatarColor}
            isLocal={true}
          />
        </group>
      )}

      {/* Other Players */}
      {players.map((player) => (
        <group key={player.id} position={player.position} rotation={[0, player.rotation, 0]}>
          <PlayerAvatar 
            profession={player.profession} 
            color={player.avatarColor}
            name={player.name}
          />
        </group>
      ))}

      {/* Proximity indicators for nearby players */}
      <ProximityIndicator localPlayer={localPlayer} players={players} />

      {/* Simple sky dome effect */}
      <mesh position={[0, 60, 0]}>
        <sphereGeometry args={[120]} />
        <meshBasicMaterial 
          color="#87CEEB" 
          side={THREE.BackSide} 
          transparent 
          opacity={0.15} 
        />
      </mesh>
    </>
  );
}