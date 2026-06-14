import { useState, useEffect } from 'react';

export type AnimationState = 'Idle' | 'Walk' | 'Run' | 'Wave' | 'Sit' | 'Dance';

interface UsePlayerAnimationProps {
  isMoving: boolean;
  isRunning: boolean;
  isEmoting?: boolean;
}

export function usePlayerAnimation({ 
  isMoving, 
  isRunning, 
  isEmoting = false 
}: UsePlayerAnimationProps): AnimationState {
  const [currentAnimation, setCurrentAnimation] = useState<AnimationState>('Idle');

  useEffect(() => {
    let newAnimation: AnimationState = 'Idle';

    if (isEmoting) {
      newAnimation = 'Wave';
    } else if (isMoving) {
      newAnimation = isRunning ? 'Run' : 'Walk';
    } else {
      newAnimation = 'Idle';
    }

    // Only change if different (prevents unnecessary restarts)
    if (newAnimation !== currentAnimation) {
      setCurrentAnimation(newAnimation);
    }
  }, [isMoving, isRunning, isEmoting]);

  return currentAnimation;
}