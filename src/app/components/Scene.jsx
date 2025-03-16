'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useRef } from 'react';

const Scene = () => {
  const meshRef = useRef();

  return (
    <Canvas style={{ height: '100vh', background: '#001f3f' }}>
      {/* إضاءة */}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />

      {/* شبكة */}
      <mesh ref={meshRef} position={[0, 0, 0]}>
        <boxGeometry args={[2, 2, 2]} />
        <meshStandardMaterial wireframe color="#00f0ff" />
      </mesh>

      {/* حركة الكاميرا */}
      <OrbitControls />
    </Canvas>
  );
};

export default Scene;
