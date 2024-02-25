import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "./Loader";
const Brain = ({ isMobile }) => {
  const brain = useGLTF("./neuralnet/scene.gltf");

  return (
    <mesh>
      <hemisphereLight intensity={0.15} groundColor="black" />
      <spotLight
        position={[0, 150, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={1} />
      <primitive
        object={brain.scene}
        scale={isMobile ? 1.2 : 1.25}
        position={isMobile ? [0, -2, 0] : [0, -2.5, 0]}
        rotation={[-0.01, 1.9, -0.1]}
      />
      {/* Additional Directional Light */}
      <directionalLight
        position={[5, 5, 5]}
        intensity={0.3}
        castShadow
        shadow-mapSize={1024}
      />
      <directionalLight
        position={[-5, -5, -5]}
        intensity={0.3}
        castShadow
        shadow-mapSize={1024}
      />
    </mesh>
  );
};

const BrainCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);
  const canvasRef = useRef();
  const touchStartY = useRef(null);
  
  useEffect(() => {
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    const mediaQuery = window.matchMedia("(max-width: 1000px)");
    setIsMobile(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  const handleTouchStart = (e) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e) => {
    if (touchStartY.current !== null) {
      const deltaY = touchStartY.current - e.touches[0].clientY;
      const verticalSwipeThreshold = 0;

      if (Math.abs(deltaY) > verticalSwipeThreshold) {
        window.scrollBy(0, deltaY);
        touchStartY.current = e.touches[0].clientY;
      }
    }
  };

  const handleTouchEnd = () => {
    touchStartY.current = null;
  };

  return (
    <Canvas
      ref={canvasRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      shadows
      dpr={[1, 2]}
      camera={{ position: isMobile ? [25, 0, 25] : [20, 3, 0], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          rotateSpeed={0.5} // Adjust rotation speed
          target={[0, 0, 0]} // Set rotation center
          minDistance={10} // Minimum distance from the center
          maxDistance={30} // Maximum distance from the center
          minPolarAngle={Math.PI / 2} // Limit rotation angle from top view
          maxPolarAngle={Math.PI / 2} // Limit rotation angle from bottom view
          autoRotate
          autoRotateSpeed={2} // Adjust auto-rotation speed
        />
        <Brain isMobile={isMobile} />
      </Suspense>
      <Preload all />
    </Canvas>
  );
};

export default BrainCanvas;