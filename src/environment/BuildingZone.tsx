// src/environment/BuildingZone.tsx
import { useGLTF } from '@react-three/drei';

interface BuildingZoneProps {
  modelUrl: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export function BuildingZone({
  modelUrl,
  position,
  rotation = [0, 0, 0],
  scale = [1, 1, 1]
}: BuildingZoneProps) {

  let scene = null;
  try {
    const gltf = useGLTF(modelUrl);
    scene = gltf.scene;
  } catch (e) {
    // Placeholder will show if model not found
  }

  return (
    <group position={position} rotation={rotation} scale={scale}>
      {scene ? (
        <primitive object={scene} />
      ) : (
        <mesh>
          <boxGeometry args={[4, 6, 4]} />
          <meshLambertMaterial color="#4a5568" />
        </mesh>
      )}
    </group>
  );
}