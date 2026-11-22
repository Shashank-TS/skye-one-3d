import { memo, useEffect, useState } from 'react';
import { useProgress } from '@react-three/drei';

interface StudioLoaderProps {
  onReady: () => void;
}

export const StudioLoader = memo(function StudioLoader({ onReady }: StudioLoaderProps) {
  const { active, progress } = useProgress();
  const [dismissed, setDismissed] = useState(false);
  const [unmounted, setUnmounted] = useState(false);

  useEffect(() => {
    if (!active && progress >= 100) {
      const t1 = window.setTimeout(() => {
        setDismissed(true);
        onReady();
      }, 180);
      const t2 = window.setTimeout(() => setUnmounted(true), 700);
      return () => {
        window.clearTimeout(t1);
        window.clearTimeout(t2);
      };
    }
  }, [active, progress, onReady]);

  // Safety fallback if assets load from instant browser cache
  useEffect(() => {
    const fallback = window.setTimeout(() => {
      setDismissed(true);
      onReady();
      window.setTimeout(() => setUnmounted(true), 550);
    }, 2200);
    return () => window.clearTimeout(fallback);
  }, [onReady]);

  if (unmounted) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black transition-opacity duration-500 ease-out ${
        dismissed ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <div className="flex flex-col items-center gap-5">
        <span className="text-sm font-medium tracking-[0.22em] text-[#f5f5f7] uppercase">
          Skye
        </span>
        <div className="h-[1px] w-40 overflow-hidden bg-white/15">
          <div
            className="h-full bg-[#f5f5f7] transition-[width] duration-200 ease-out"
            style={{ width: `${Math.max(8, Math.min(100, progress))}%` }}
          />
        </div>
      </div>
    </div>
  );
});