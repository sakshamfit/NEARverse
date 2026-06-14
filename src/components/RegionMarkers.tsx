import { Html } from '@react-three/drei';

export function RegionMarkers() {
  const regions = [
    { name: 'Hazratganj', position: [-18, 6, -18], color: '#e76f51' },
    { name: 'Tech Park', position: [26, 8, -12], color: '#00b4d8' },
    { name: 'Industrial Zone', position: [-32, 5, 14], color: '#6c757d' },
    { name: 'Heritage Ghat', position: [-4, 5, 26], color: '#e63946' },
    { name: 'Tourism Hub', position: [32, 5, 18], color: '#ffd166' },
  ];

  return (
    <group>
      {regions.map((region, index) => (
          <group key={index} position={region.position as [number, number, number]}>
          {/* Floating marker */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[1.8, 2.2, 0.6, 6]} />
            <meshLambertMaterial color={region.color} transparent opacity={0.3} />
          </mesh>
          
          <Html position={[0, 3.5, 0]} style={{ pointerEvents: 'none' }}>
            <div style={{
              background: region.color,
              color: 'white',
              padding: '4px 16px',
              borderRadius: '999px',
              fontSize: '13px',
              fontWeight: 700,
              boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
              whiteSpace: 'nowrap',
              textAlign: 'center',
            }}>
              {region.name}
            </div>
          </Html>
        </group>
      ))}
    </group>
  );
}