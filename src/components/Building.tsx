import { Html } from '@react-three/drei';

interface BuildingProps {
  position: [number, number, number];
  scale?: [number, number, number];
  color: string;
  type: 'cafe' | 'shop' | 'office' | 'house' | 'tech' | 'factory' | 'workshop' | 'temple' | 'ghat' | 'hotel';
}

export function Building({ position, scale = [1, 1, 1], color, type }: BuildingProps) {
  const [sx, sy, sz] = scale;
  
  const getRoofColor = () => {
    switch (type) {
      case 'tech': return '#1a1a2e';
      case 'temple': return '#c1121f';
      case 'cafe': return '#e76f51';
      default: return '#264653';
    }
  };

  const roofColor = getRoofColor();

  return (
    <group position={position}>
      {/* Main building body */}
      <mesh position={[0, sy * 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[sx * 3.5, sy * 3, sz * 3.5]} />
        <meshLambertMaterial color={color} />
      </mesh>

      {/* Roof */}
      <mesh position={[0, sy * 1.6, 0]} castShadow>
        <coneGeometry args={[sx * 2.1, sy * 1.2, 4]} />
        <meshLambertMaterial color={roofColor} />
      </mesh>

      {/* Windows - front row */}
      {Array.from({ length: Math.floor(sy * 1.8) }).map((_, i) => (
        <mesh 
          key={`front-${i}`} 
          position={[-sx * 1.2, sy * 0.4 + i * 0.9, sz * 1.76]} 
          castShadow
        >
          <planeGeometry args={[0.7, 0.6]} />
          <meshLambertMaterial color="#a8dadc" emissive="#a8dadc" emissiveIntensity={0.1} />
        </mesh>
      ))}

      {/* Door */}
      <mesh position={[0, sy * 0.35, sz * 1.76]} castShadow>
        <planeGeometry args={[0.9, 1.5]} />
        <meshLambertMaterial color="#2c3e50" />
      </mesh>

      {/* Sign / Name */}
      {(type === 'cafe' || type === 'shop' || type === 'hotel') && (
        <Html position={[0, sy * 2.4, sz * 2]} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            padding: '3px 14px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: 700,
            color: '#222',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            whiteSpace: 'nowrap'
          }}>
            {type === 'cafe' && '☕ Hazratganj Cafe'}
            {type === 'shop' && '🛍️ Local Bazaar'}
            {type === 'hotel' && '🏨 Taj View Hotel'}
          </div>
        </Html>
      )}

      {/* Tech building special glow */}
      {type === 'tech' && (
        <mesh position={[0, sy * 2.8, 0]}>
          <sphereGeometry args={[0.4]} />
          <meshBasicMaterial color="#00ff88" transparent opacity={0.6} />
        </mesh>
      )}
    </group>
  );
}