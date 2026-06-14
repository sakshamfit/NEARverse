export function Ground() {
  return (
    <group>
      {/* Main ground plane */}
      <mesh position={[0, 0, 0]} rotation={[-Math.PI * 0.5, 0, 0]} receiveShadow>
        <planeGeometry args={[100, 80]} />
        <meshLambertMaterial color="#a7c957" />
      </mesh>

      {/* Stylized paths / roads */}
      <mesh position={[-12, 0.02, 0]} rotation={[-Math.PI * 0.5, 0, 0]} receiveShadow>
        <planeGeometry args={[6, 75]} />
        <meshLambertMaterial color="#e8d5b7" />
      </mesh>

      <mesh position={[14, 0.02, -8]} rotation={[-Math.PI * 0.5, 0, 0.6]} receiveShadow>
        <planeGeometry args={[5, 55]} />
        <meshLambertMaterial color="#e8d5b7" />
      </mesh>

      {/* Decorative grass patches */}
      {Array.from({ length: 18 }).map((_, i) => (
        <mesh 
          key={i} 
          position={[
            (Math.sin(i) * 28) + (i % 3) * 6 - 20, 
            0.03, 
            (Math.cos(i * 1.3) * 22) - 12 + (i % 2) * 8
          ]} 
          rotation={[-Math.PI * 0.5, 0, Math.random() * 2]}
        >
          <planeGeometry args={[2.8 + (i % 3), 2.8 + (i % 2)]} />
          <meshLambertMaterial color={i % 2 === 0 ? "#7cb342" : "#8bc34a"} />
        </mesh>
      ))}
    </group>
  );
}