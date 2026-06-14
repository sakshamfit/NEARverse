import { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import * as THREE from 'three';

interface RealisticPlayerProps {
  url: string;
  animation?: string;
  position?: [number, number, number];
  rotation?: number;
  scale?: number;
  name?: string;
  isLocal?: boolean;
}

export function RealisticPlayer({
  url,
  animation = 'Idle',
  position = [0, 0, 0],
  rotation = 0,
  scale = 1,
  name,
  isLocal = false
}: RealisticPlayerProps) {
  const group = useRef<THREE.Group>(null!);
  const { scene, animations } = useGLTF(url);
  const { actions } = useAnimations(animations, group);

  // Play animation when it changes
  useEffect(() => {
    if (!actions) return;

    // Stop all current animations
    Object.values(actions).forEach((action) => {
      if (action) action.stop();
    });

    // Play the requested animation
    const currentAction = actions[animation];
    if (currentAction) {
      currentAction.reset().fadeIn(0.2).play();
    }
  }, [animation, actions]);

  return (
    <group ref={group} position={position} rotation={[0, rotation, 0]} scale={scale}>
      <primitive object={scene} />
      
      {/* Name tag above player */}
      {name && (
        <group position={[0, 2.4, 0]}>
          <mesh>
            <planeGeometry args={[2.2, 0.45]} />
            <meshBasicMaterial color="#000000" transparent opacity={0.65} />
          </mesh>
        </group>
      )}

      {/* Local player indicator */}
      {isLocal && (
        <group position={[0, 2.8, 0]}>
          <mesh>
            <planeGeometry args={[1.2, 0.3]} />
            <meshBasicMaterial color="#7c3aed" transparent opacity={0.9} />
          </mesh>
        </group>
      )}
    </group>
  );
}

// Preload models for better performance
useGLTF.preload('/models/male-realistic.glb');
useGLTF.preload('/models/female-realistic.glb');
useGLTF.preload('/models/doctor-realistic.glb');
useGLTF.preload('/models/chef-realistic.glb');
useGLTF.preload('/models/developer-realistic.glb');
useGLTF.preload('/models/worker-realistic.glb');