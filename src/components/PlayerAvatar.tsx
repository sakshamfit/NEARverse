import { Html } from '@react-three/drei';

interface PlayerAvatarProps {
  profession: string;
  color: string;
  name?: string;
  isLocal?: boolean;
}

export function PlayerAvatar({ profession, color, name, isLocal }: PlayerAvatarProps) {

  return (
    <group>
      {/* Body */}
      <mesh position={[0, 1.1, 0]} castShadow>
        <capsuleGeometry args={[0.35, 0.9, 4]} />
        <meshLambertMaterial color={color} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 2.0, 0]} castShadow>
        <sphereGeometry args={[0.38]} />
        <meshLambertMaterial color="#f5d0c5" />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 2.35, 0]} castShadow>
        <sphereGeometry args={[0.4]} />
        <meshLambertMaterial color="#3a2f1f" />
      </mesh>

      {/* Profession-specific items */}
      {profession.toLowerCase() === 'doctor' && (
        <>
          {/* Lab coat accent */}
          <mesh position={[0, 1.0, 0.45]} rotation={[0.2, 0, 0]}>
            <planeGeometry args={[0.6, 0.8]} />
            <meshLambertMaterial color="#ffffff" />
          </mesh>
          {/* Stethoscope */}
          <mesh position={[0.25, 1.4, 0.3]}>
            <torusGeometry args={[0.15, 0.03, 8, 20, Math.PI]} />
            <meshLambertMaterial color="#333333" />
          </mesh>
        </>
      )}

      {profession.toLowerCase() === 'developer' && (
        <>
          {/* Laptop bag */}
          <mesh position={[0.5, 1.2, 0]} rotation={[0, 0, 0.3]}>
            <boxGeometry args={[0.5, 0.7, 0.15]} />
            <meshLambertMaterial color="#2c3e50" />
          </mesh>
          {/* Hoodie accent */}
          <mesh position={[0, 1.3, 0.5]}>
            <planeGeometry args={[0.7, 0.5]} />
            <meshLambertMaterial color="#1a1a2e" />
          </mesh>
        </>
      )}

      {profession.toLowerCase() === 'chef' && (
        <>
          {/* Chef hat */}
          <mesh position={[0, 2.55, 0]}>
            <cylinderGeometry args={[0.32, 0.28, 0.35, 16]} />
            <meshLambertMaterial color="#ffffff" />
          </mesh>
          {/* Apron */}
          <mesh position={[0, 0.9, 0.5]}>
            <planeGeometry args={[0.65, 0.9]} />
            <meshLambertMaterial color="#e74c3c" />
          </mesh>
        </>
      )}

      {profession.toLowerCase() === 'electrician' && (
        <>
          {/* Helmet */}
          <mesh position={[0, 2.4, 0]}>
            <sphereGeometry args={[0.42]} />
            <meshLambertMaterial color="#f39c12" />
          </mesh>
          {/* Tool belt */}
          <mesh position={[0, 0.85, 0]}>
            <cylinderGeometry args={[0.42, 0.42, 0.25, 16]} />
            <meshLambertMaterial color="#2c3e50" />
          </mesh>
        </>
      )}

      {profession.toLowerCase() === 'photographer' && (
        <>
          {/* Camera around neck */}
          <mesh position={[0, 1.5, 0.6]}>
            <boxGeometry args={[0.35, 0.25, 0.2]} />
            <meshLambertMaterial color="#222222" />
          </mesh>
          {/* Camera strap */}
          <mesh position={[0, 1.65, 0.3]}>
            <torusGeometry args={[0.35, 0.02, 8, 20]} />
            <meshLambertMaterial color="#333333" />
          </mesh>
        </>
      )}

      {/* Name tag above player */}
      {name && !isLocal && (
        <Html position={[0, 2.9, 0]} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: 'rgba(0,0,0,0.75)',
            color: 'white',
            padding: '2px 10px',
            borderRadius: '12px',
            fontSize: '12px',
            whiteSpace: 'nowrap',
            textAlign: 'center',
            fontWeight: 500,
          }}>
            {name}
            <div style={{ fontSize: '10px', opacity: 0.8, marginTop: '-1px' }}>
              {profession}
            </div>
          </div>
        </Html>
      )}

      {/* Local player indicator */}
      {isLocal && (
        <Html position={[0, 3.2, 0]} style={{ pointerEvents: 'none' }}>
          <div style={{
            background: '#7c3aed',
            color: 'white',
            padding: '1px 8px',
            borderRadius: '999px',
            fontSize: '11px',
            fontWeight: 600,
          }}>
            YOU
          </div>
        </Html>
      )}

      {/* Shadow */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI * 0.5, 0, 0]} receiveShadow>
        <circleGeometry args={[0.55]} />
        <meshLambertMaterial color="#000000" transparent opacity={0.2} />
      </mesh>
    </group>
  );
}