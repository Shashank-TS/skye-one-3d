import { memo, useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Center, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useConfiguratorStore, type FinishType } from '../store/useConfiguratorStore';
import { sceneMotionState } from '../scene/scrollState';

useGLTF.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');

const FINISH_PROPS: Record<FinishType, { metalness: number; roughness: number; clearcoat: number }> = {
  anodized: { metalness: 0.45, roughness: 0.28, clearcoat: 0.25 },
  matte: { metalness: 0.02, roughness: 0.86, clearcoat: 0.0 },
  glossy: { metalness: 0.12, roughness: 0.12, clearcoat: 0.9 },
  brushed: { metalness: 0.9, roughness: 0.22, clearcoat: 0.12 },
};

const EXPLODE_OFFSETS: Record<string, [number, number, number]> = {
  Headband_Outer_Arch: [0, 0.42, 0],
  Headband_Outer_Seam: [0, 0.54, 0],
  Headband_Underside_Cushion: [0, 0.2, 0],

  Headband_Slider_Sleeve_L: [-0.2, 0.2, 0],
  Slider_Inset_Panel_L: [-0.32, 0.2, 0],
  Slider_Screw_L: [-0.42, 0.2, 0],
  Telescopic_Rail_L: [-0.26, 0.1, 0],
  Yoke_Arm_L: [-0.34, 0.04, 0],
  Hinge_Pivot_L: [-0.44, 0.02, 0],
  Hinge_Center_Cap_L: [-0.54, 0.02, 0],
  EarOpening_Shadow_L: [-0.12, 0, 0],
  EarCushion_Inner_Seam_L: [-0.14, 0, 0],
  EarCushion_Leather_L: [-0.16, 0, 0],
  Inner_Acoustic_Disc_L: [-0.3, 0, 0],
  EarShell_L: [-0.5, 0, 0],
  Cup_Shell_Seam_L: [-0.56, 0, 0],
  OuterCup_StepShoulder_L: [-0.7, 0, 0],
  OuterCup_Shoulder_Rim_L: [-0.78, 0, 0],
  OuterCup_Bezel_L: [-0.88, 0, 0],
  OuterFacePlate_L: [-1.04, 0, 0],
  OuterFace_Inner_Ring_L: [-1.12, 0, 0],
  OuterCup_LED_Ring_L: [-1.2, 0, 0],
  Logo_Mark_L: [-1.32, 0, 0],

  Headband_Slider_Sleeve_R: [0.2, 0.2, 0],
  Slider_Inset_Panel_R: [0.32, 0.2, 0],
  Slider_Screw_R: [0.42, 0.2, 0],
  Telescopic_Rail_R: [0.26, 0.1, 0],
  Yoke_Arm_R: [0.34, 0.04, 0],
  Hinge_Pivot_R: [0.44, 0.02, 0],
  Hinge_Center_Cap_R: [0.54, 0.02, 0],
  EarOpening_Shadow_R: [0.12, 0, 0],
  EarCushion_Inner_Seam_R: [0.14, 0, 0],
  EarCushion_Leather_R: [0.16, 0, 0],
  Inner_Acoustic_Disc_R: [0.3, 0, 0],
  EarShell_R: [0.5, 0, 0],
  Cup_Shell_Seam_R: [0.56, 0, 0],
  OuterCup_StepShoulder_R: [0.7, 0, 0],
  OuterCup_Shoulder_Rim_R: [0.78, 0, 0],
  OuterCup_Bezel_R: [0.88, 0, 0],
  OuterFacePlate_R: [1.04, 0, 0],
  OuterFace_Inner_Ring_R: [1.12, 0, 0],
  OuterCup_LED_Ring_R: [1.2, 0, 0],
  Logo_Mark_R: [1.32, 0, 0],

  MultiFunction_Button_R: [0.55, -0.06, 0.06],
  Volume_Rocker_R: [0.55, -0.06, 0.06],
  Audio_Port_R: [0.55, -0.06, 0.05],
  Audio_Port_Inner_R: [0.55, -0.06, 0.05],
  Bluetooth_Status_LED_R: [0.55, -0.06, 0.05],
};

const SPIN_DURATION = 0.92;
const EXPLODE_START = 0.85;
const EXPLODE_END = 1.48;
const HOLD_END = 1.66;
const ASSEMBLE_END = 2.38;
const INTRO_TOTAL = 2.75;

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutQuart = (t: number) =>
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

interface AnimatedMeshEntry {
  mesh: THREE.Mesh;
  base: THREE.Vector3;
  offset: [number, number, number];
}

interface HeadphonesModelProps {
  ready: boolean;
}

export const HeadphonesModel = memo(function HeadphonesModel({ ready }: HeadphonesModelProps) {
  const { scene, materials } = useGLTF('/models/headphones.glb');
  const parts = useConfiguratorStore((s) => s.parts);
  const width = useThree((s) => s.size.width);

  const rootRef = useRef<THREE.Group>(null);
  const animatedMeshes = useRef<AnimatedMeshEntry[]>([]);
  const ledMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);

  const introTime = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? INTRO_TOTAL
      : 0
  );

  const isMobile = width < 768;
  const baseScale = isMobile ? 0.5 : 0.68;

  useEffect(() => {
    const entries: AnimatedMeshEntry[] = [];

    scene.traverse((child) => {
      if ((child as THREE.Light).isLight) {
        child.visible = false;
        return;
      }
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        const offset = EXPLODE_OFFSETS[mesh.name];
        if (offset) {
          if (!mesh.userData.__basePosition) {
            mesh.userData.__basePosition = mesh.position.clone();
          }
          entries.push({
            mesh,
            base: mesh.userData.__basePosition as THREE.Vector3,
            offset,
          });
        }
      }
    });

    animatedMeshes.current = entries;
  }, [scene]);

  useEffect(() => {
    const updateMat = (
      matName: string,
      cfg: { color: string; finish: FinishType },
      shadeMultiplier = 1
    ) => {
      const mat = materials[matName] as THREE.MeshPhysicalMaterial | undefined;
      if (!mat) return;

      const color = new THREE.Color(cfg.color);
      if (shadeMultiplier !== 1) color.multiplyScalar(shadeMultiplier);
      mat.color.copy(color);

      const props = FINISH_PROPS[cfg.finish];
      mat.metalness = props.metalness;
      mat.roughness = props.roughness;
      if ('clearcoat' in mat) mat.clearcoat = props.clearcoat;
      mat.needsUpdate = true;
    };

    updateMat('MAT | Graphite Polymer', parts.earCup, 1);
    updateMat('MAT | Satin Black', parts.earCup, 0.72);
    updateMat('MAT | Soft Black Leather', parts.cushion, 1);
    updateMat('MAT | Dark Titanium', parts.metal, 1);
    updateMat('MAT | Anodized Edge', parts.accent, 1);
    updateMat('MAT | Logo Silver', parts.accent, 1);

    const ledMat = materials['MAT | Outer Cup LED Ring Cyan'] as
      | THREE.MeshStandardMaterial
      | undefined;
    if (ledMat) {
      ledMat.color.set(parts.ledColor);
      ledMat.emissive.set(parts.ledColor);
      ledMat.emissiveIntensity = 2.2;
      ledMat.toneMapped = false;
      ledMat.needsUpdate = true;
      ledMaterialRef.current = ledMat;
    }
  }, [parts, materials]);

  useFrame((state, delta) => {
    const group = rootRef.current;
    if (!group) return;

    const dt = Math.min(delta, 0.05);
    const t = state.clock.elapsedTime;
    const { studioActive, autoRotate, exploded: manualExploded, acousticMode } =
      useConfiguratorStore.getState();

    // Intro timer
    if (ready && introTime.current < INTRO_TOTAL) {
      introTime.current = Math.min(INTRO_TOTAL, introTime.current + dt);
    }
    const it = introTime.current;
    const isIntroActive = it < INTRO_TOTAL;

    const spinEase = easeOutQuart(clamp01(it / SPIN_DURATION));
    const introRotY = (1 - spinEase) * Math.PI;
    const introScaleFactor = 0.84 + 0.16 * spinEase;
    const introDropY = -(1 - spinEase) * 0.22;

    const maxIntroExplode = isMobile ? 0.78 : 0.92;
    let introExplode = 0;
    if (it > EXPLODE_START && it < ASSEMBLE_END) {
      if (it < EXPLODE_END) {
        const p = clamp01((it - EXPLODE_START) / (EXPLODE_END - EXPLODE_START));
        introExplode = easeOutCubic(p) * maxIntroExplode;
      } else if (it < HOLD_END) {
        introExplode = maxIntroExplode;
      } else {
        const p = clamp01((it - HOLD_END) / (ASSEMBLE_END - HOLD_END));
        introExplode = (1 - easeInOutQuart(p)) * maxIntroExplode;
      }
    }

    // Studio free-spin & smooth reset when leaving Studio section
    if (studioActive) {
      if (autoRotate && !sceneMotionState.isDragging && !manualExploded) {
        sceneMotionState.userRotY += dt * 0.48;
      }
    } else if (!sceneMotionState.isDragging) {
      const resetLerp = Math.min(dt * 4, 1);
      sceneMotionState.userRotX = THREE.MathUtils.lerp(sceneMotionState.userRotX, 0, resetLerp);
      // Wrap userRotY into [-PI, PI] before resetting so it takes the shortest path
      const wrapped = Math.atan2(
        Math.sin(sceneMotionState.userRotY),
        Math.cos(sceneMotionState.userRotY)
      );
      sceneMotionState.userRotY = THREE.MathUtils.lerp(wrapped, 0, resetLerp);
    }

    // Live Acoustic Mode LED behavior
    if (ledMaterialRef.current) {
      const targetEmissive =
        acousticMode === 'spatial'
          ? 2.2 + Math.sin(t * 3.2) * 0.9
          : acousticMode === 'anc'
          ? 1.35
          : 2.2;
      ledMaterialRef.current.emissiveIntensity = THREE.MathUtils.lerp(
        ledMaterialRef.current.emissiveIntensity,
        targetEmissive,
        Math.min(dt * 6, 1)
      );
    }

    const idleBlend = easeOutCubic(clamp01((it - 2.05) / (INTRO_TOTAL - 2.05)));
    const floatAmp = acousticMode === 'spatial' ? 0.065 : 0.045;
    const floatY = Math.sin(t * 1.15) * floatAmp * idleBlend;
    const idleSwayY = studioActive ? 0 : Math.sin(t * 0.35) * 0.12 * idleBlend;
    const pointerX = isMobile || studioActive ? 0 : state.pointer.x * 0.16 * idleBlend;
    const pointerY = isMobile || studioActive ? 0 : state.pointer.y * 0.08 * idleBlend;

    const burstTiltY = introExplode * 0.22;
    const groupLerp = Math.min(dt * (isIntroActive ? 11 : sceneMotionState.isDragging ? 14 : 5.5), 1);
    const meshLerp = Math.min(dt * (isIntroActive ? 12 : 6.5), 1);

    const targetScale = baseScale * sceneMotionState.scale * introScaleFactor;
    const targetX = sceneMotionState.posX;
    const targetY = sceneMotionState.posY + (isMobile ? -0.06 : -0.05) + floatY + introDropY;
    const targetZ = sceneMotionState.posZ;
    const targetRotX =
      sceneMotionState.rotX + sceneMotionState.userRotX - pointerY + (1 - spinEase) * 0.14;
    const targetRotY =
      sceneMotionState.rotY +
      sceneMotionState.userRotY +
      introRotY +
      burstTiltY +
      idleSwayY +
      pointerX;
    const targetRotZ = sceneMotionState.rotZ;

    group.scale.setScalar(THREE.MathUtils.lerp(group.scale.x, targetScale, groupLerp));
    group.position.x = THREE.MathUtils.lerp(group.position.x, targetX, groupLerp);
    group.position.y = THREE.MathUtils.lerp(group.position.y, targetY, groupLerp);
    group.position.z = THREE.MathUtils.lerp(group.position.z, targetZ, groupLerp);
    group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, targetRotX, groupLerp);
    group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, targetRotY, groupLerp);
    group.rotation.z = THREE.MathUtils.lerp(group.rotation.z, targetRotZ, groupLerp);

    const studioExplode = studioActive && manualExploded ? (isMobile ? 0.78 : 0.95) : 0;
    const explodeFactor = Math.max(introExplode, sceneMotionState.explode, studioExplode);
    const entries = animatedMeshes.current;
    for (let i = 0; i < entries.length; i++) {
      const { mesh, base, offset } = entries[i];
      mesh.position.x = THREE.MathUtils.lerp(mesh.position.x, base.x + offset[0] * explodeFactor, meshLerp);
      mesh.position.y = THREE.MathUtils.lerp(mesh.position.y, base.y + offset[1] * explodeFactor, meshLerp);
      mesh.position.z = THREE.MathUtils.lerp(mesh.position.z, base.z + offset[2] * explodeFactor, meshLerp);
    }
  });

  return (
    <group
      ref={rootRef}
      scale={baseScale * 0.84}
      rotation={[sceneMotionState.rotX + 0.14, sceneMotionState.rotY + Math.PI, 0]}
    >
      <Center>
        <primitive object={scene} />
      </Center>
    </group>
  );
});

useGLTF.preload('/models/headphones.glb');