import { Html } from '@react-three/drei';
import type { Player } from '../types';

interface ProximityIndicatorProps {
  localPlayer: Player | null;
  players: Player[];
}

export function ProximityIndicator({ localPlayer, players }: ProximityIndicatorProps) {
  if (!localPlayer) return null;

  const PROXIMITY_RADIUS = 18;

  const getDistance = (pos1: [number, number, number], pos2: [number, number, number]) => {
    const dx = pos1[0] - pos2[0];
    const dz = pos1[2] - pos2[2];
    return Math.sqrt(dx * dx + dz * dz);
  };

  return (
    <>
      {players.map(player => {
        const distance = getDistance(localPlayer.position, player.position);
        const isNearby = distance <= PROXIMITY_RADIUS;

        if (!isNearby) return null;

        return (
          <group key={player.id} position={[player.position[0], 3.8, player.position[2]]}>
            <Html style={{ pointerEvents: 'none' }}>
              <div style={{
                background: 'rgba(16, 185, 129, 0.9)',
                color: 'white',
                padding: '2px 10px',
                borderRadius: '999px',
                fontSize: '11px',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              }}>
                Nearby • Chat enabled
              </div>
            </Html>
          </group>
        );
      })}
    </>
  );
}