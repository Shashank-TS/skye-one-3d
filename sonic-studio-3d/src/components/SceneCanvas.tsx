import { memo, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { ContactShadows, Environment, Lightformer } from '@react-three/drei';
import * as THREE from 'three';
import { HeadphonesModel } from './HeadphonesModel';
import { sceneMotionState } from '../scene/scrollState';
import { useConfiguratorStore } from '../store/useConfiguratorStore';

interface StudioLightsProps {
  ready: boolean;
}

const StudioLights = memo(function StudioLights({ ready }: StudioLightsProps) {
  const keyLightRef = useRef<THREE.SpotLight>(null);
  const rimLightRef = useRef<THREE.DirectionalLight>(null);
  const ambientRef = useRef<THREE.AmbientLight>(null);
  const fade = useRef(0);

  useFrame((_, delta) => {
    if (!ready) return;
    const dt = Math.min(delta, 0.05);
    if (fade.current < 1) {
      fade.current = Math.min(1, fade.current + dt * 0.85);
    }
    const ease = 1 - Math.pow(1 - fade.current, 3);
    const mode = useConfiguratorStore.getState().acousticMode;

    const targetKey = (mode === 'anc' ? 1.25 : mode === 'spatial' ? 2.3 : 2.1) * ease;
    const targetRim = (mode === 'anc' ? 0.9 : mode === 'spatial' ? 1.85 : 1.35) * ease;
    const targetAmbient = (mode === 'anc' ? 0.15 : 0.28) * ease;

    const lerp = Math.min(dt * 4.5, 1);
    if (keyLightRef.current) {
      keyLightRef.current.intensity = THREE.MathUtils.lerp(
        keyLightRef.current.intensity,
        targetKey,
        lerp
      );
    }
    if (rimLightRef.current) {
      rimLightRef.current.intensity = THREE.MathUtils.lerp(
        rimLightRef.current.intensity,
        targetRim,
        lerp
      );
    }
    if (ambientRef.current) {
      ambientRef.current.intensity = THREE.MathUtils.lerp(
        ambientRef.current.intensity,
        targetAmbient,
        lerp
      );
    }
  });

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0} />
      <spotLight
        ref={keyLightRef}
        position={[3.5, 6.5, 5.5]}
        angle={0.34}
        penumbra={1}
        intensity={0}
        color="#f8fafc"
      />
      <directionalLight
        ref={rimLightRef}
        position={[-4.5, 3.5, -4]}
        intensity={0}
        color="#dbeafe"
      />

      <Environment resolution={256} frames={1} environmentIntensity={0.85}>
        <Lightformer
          form="rect"
          intensity={2.4}
          position={[0, 5, 1.5]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={[6, 2.5, 1]}
          color="#ffffff"
        />
        <Lightformer
          form="rect"
          intensity={1.6}
          position={[-5, 1.5, 2]}
          rotation={[0, Math.PI / 2.2, 0]}
          scale={[4, 4, 1]}
          color="#e2e8f0"
        />
        <Lightformer
          form="rect"
          intensity={1.2}
          position={[5, 0.5, -1]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={[4, 3, 1]}
          color="#cbd5e1"
        />
      </Environment>
    </>
  );
});

const FloorShadow = memo(function FloorShadow() {
  const shadowRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const g = shadowRef.current;
    if (!g) return;
    const next = THREE.MathUtils.lerp(
      g.scale.x,
      sceneMotionState.shadowScale,
      Math.min(delta * 6, 1)
    );
    g.scale.setScalar(next);
    g.visible = next > 0.02;
  });

  return (
    <group ref={shadowRef}>
      <ContactShadows
        frames={1}
        position={[0, -1.45, 0]}
        opacity={0.45}
        scale={7}
        blur={2.6}
        far={3.5}
      />
    </group>
  );
});

interface SceneCanvasProps {
  ready: boolean;
}

export const SceneCanvas = memo(function SceneCanvas({ ready }: SceneCanvasProps) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)');
    const handleChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  const dpr = useMemo<[number, number]>(() => (isMobile ? [1, 1.5] : [1, 2]), [isMobile]);

  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      <Canvas
        dpr={dpr}
        camera={{ position: [0, 0.1, isMobile ? 4.5 : 3.9], fov: 36 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.05,
        }}
      >
        <StudioLights ready={ready} />
        <Suspense fallback={null}>
          <HeadphonesModel ready={ready} />
          <FloorShadow />
        </Suspense>
      </Canvas>
    </div>
  );
});