import { useFrame } from '@react-three/fiber';
import { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import type { Player } from '../types';
import { RealisticPlayer } from '../characters/RealisticPlayer';
import { usePlayerAnimation } from '../characters/usePlayerAnimation';
import { BuildingZone } from '../environment/BuildingZone';
import { cityBuildings, villageBuildings } from '../environment/BuildingTypes';
import { ProximityIndicator } from './ProximityIndicator';

interface GameWorldProps {
  localPlayer: Player | null;
  players: Player[];
  onPlayerMove: (position: [number, number, number], rotation: number) => void;
}

export function GameWorld({ localPlayer, players, onPlayerMove }: GameWorldProps) {
  const [keys, setKeys] = useState<Set<string>>(new Set());
  const localPlayerRef = useRef<THREE.Group>(null!);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => setKeys(prev => new Set(prev).add(e.key.toLowerCase()));
    const handleKeyUp = (e: KeyboardEvent) => {
      const newKeys = new Set(keys); newKeys.delete(e.key.toLowerCase()); setKeys(newKeys);
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [keys]);

  const isMoving = keys.has('w') || keys.has('s') || keys.has('a') || keys.has('d');
  const isRunning = keys.has('shift');
  const currentAnimation = usePlayerAnimation({ isMoving, isRunning });

  useFrame((_, delta) => {
    if (!localPlayer || !localPlayerRef.current) return;
    const speed = isRunning ? 12 : 6;
    const moveSpeed = speed * delta;
    let moveX = 0, moveZ = 0;
    if (keys.has('w')) moveZ -= 1;
    if (keys.has('s')) moveZ += 1;
    if (keys.has('a')) moveX -= 1;
    if (keys.has('d')) moveX += 1;

    if (moveX !== 0 || moveZ !== 0) {
      const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
      moveX /= length; moveZ /= length;
      const currentPos = localPlayer.position;
      const newX = Math.max(-45, Math.min(45, currentPos[0] + moveX * moveSpeed));
      const newZ = Math.max(-35, Math.min(35, currentPos[2] + moveZ * moveSpeed));
      const rotation = Math.atan2(moveX, moveZ);
      onPlayerMove([newX, currentPos[1], newZ], rotation);
      localPlayerRef.current.position.x = newX;
      localPlayerRef.current.position.z = newZ;
      localPlayerRef.current.rotation.y = rotation;
    }
  });

  return (
    <>
      {cityBuildings.map((b) => (
        <BuildingZone key={b.id} modelUrl={b.modelUrl} position={b.position} rotation={b.rotation} scale={b.scale} />
      ))}
      {villageBuildings.map((b) => (
        <BuildingZone key={b.id} modelUrl={b.modelUrl} position={b.position} rotation={b.rotation} scale={b.scale} />
      ))}

      {localPlayer && (
        <group ref={localPlayerRef} position={localPlayer.position}>
          <RealisticPlayer
            url="/assets/characters/male_character_in_suit.glb"
            animation={currentAnimation}
            rotation={localPlayer.rotation}
            scale={1}
            name={localPlayer.name}
            isLocal={true}
          />
        </group>
      )}

      {players.map((player) => (
        <group key={player.id} position={player.position} rotation={[0, player.rotation, 0]}>
          <RealisticPlayer
            url="/assets/characters/modern_tactical_female_character.glb"
            animation="Idle"
            rotation={player.rotation}
            scale={1}
            name={player.name}
          />
        </group>
      ))}

      <ProximityIndicator localPlayer={localPlayer} players={players} />
      <mesh position={[0, 60, 0]}>
        <sphereGeometry args={[120]} />
        <meshBasicMaterial color="#87CEEB" side={THREE.BackSide} transparent opacity={0.15} />
      </mesh>
    </>
  );
}