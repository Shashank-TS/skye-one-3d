import { useCallback, useState } from 'react';
import { Navbar } from './components/Navbar';
import { StudioLoader } from './components/StudioLoader';
import { SceneCanvas } from './components/SceneCanvas';
import { HeroSection } from './components/HeroSection';
import { CraftSection } from './components/CraftSection';
import { AnatomySection } from './components/AnatomySection';
import { SpecsSection } from './components/SpecsSection';
import { StudioSection } from './components/StudioSection';
import { Footer } from './components/Footer';
import { useScrollChoreography } from './hooks/useScrollChoreography';

export default function App() {
  const [sceneReady, setSceneReady] = useState(false);

  useScrollChoreography();

  const handleSceneReady = useCallback(() => {
    setSceneReady(true);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-[#f5f5f7] selection:bg-white/20 selection:text-white">
      <StudioLoader onReady={handleSceneReady} />
      <Navbar />
      <SceneCanvas ready={sceneReady} />

      <main className="relative z-20">
        <HeroSection ready={sceneReady} />
        <CraftSection />
        <AnatomySection />
        <SpecsSection />
        <StudioSection />
      </main>

      <Footer />
    </div>
  );
}