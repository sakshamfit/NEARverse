export function Trees() {
  const positions = [
    [-42, 0, -28], [-38, 0, -22], [-32, 0, -30], [38, 0, -26],
    [-40, 0, 24], [-35, 0, 18], [33, 0, 26], [29, 0, 18],
    [12, 0, -32], [-18, 0, 32], [22, 0, 30], [-8, 0, -30],
  ];

  return (
    <group>
      {positions.map((pos, index) => (
        <group key={index} position={pos as [number, number, number]}>
          {/* Trunk */}
          <mesh position={[0, 1.8, 0]} castShadow>
            <cylinderGeometry args={[0.35, 0.45, 3.2, 8]} />
            <meshLambertMaterial color="#5c4033" />
          </mesh>
          
          {/* Foliage layers */}
          <mesh position={[0, 3.6, 0]} castShadow>
            <coneGeometry args={[2.1, 3.2, 8]} />
            <meshLambertMaterial color="#2d6a4f" />
          </mesh>
          <mesh position={[0, 4.8, 0]} castShadow>
            <coneGeometry args={[1.6, 2.8, 8]} />
            <meshLambertMaterial color="#40916c" />
          </mesh>
          <mesh position={[0, 5.8, 0]} castShadow>
            <coneGeometry args={[1.1, 2.2, 8]} />
            <meshLambertMaterial color="#52b788" />
          </mesh>
        </group>
      ))}
    </group>
  );
}