import { memo } from 'react';
import { ChevronRight } from 'lucide-react';
import { useConfiguratorStore } from '../store/useConfiguratorStore';

interface HeroSectionProps {
  ready: boolean;
}

export const HeroSection = memo(function HeroSection({ ready }: HeroSectionProps) {
  // Granular selector: only re-renders if LED color changes
  const ledColor = useConfiguratorStore((s) => s.parts.ledColor);

  return (
    <section
      id="hero"
      className="relative flex min-h-[100svh] w-full flex-col justify-between overflow-hidden px-5 pt-20 pb-8 sm:px-8 sm:pt-24 sm:pb-10"
    >
      {/* Subtle Apple-style studio overhead radial glow behind the 3D canvas */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-1000"
        style={{
          opacity: ready ? 1 : 0,
          background: `
            radial-gradient(55% 42% at 50% 48%, rgba(255,255,255,0.065) 0%, rgba(0,0,0,0) 70%),
            radial-gradient(35% 28% at 50% 52%, ${ledColor}14 0%, rgba(0,0,0,0) 72%)
          `,
        }}
      />

      {/* Top Editorial Lockup */}
      <div
        className={`relative z-20 mx-auto flex max-w-3xl flex-col items-center text-center transition-all duration-1000 ease-out ${
          ready ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        <p className="mb-2 text-xs font-medium tracking-[0.18em] text-[#86868b] uppercase sm:text-sm">
          Skye One
        </p>
        <h1 className="bg-gradient-to-b from-[#ffffff] via-[#f5f5f7] to-[#a1a1a6] bg-clip-text text-4xl font-semibold tracking-[-0.035em] text-transparent sm:text-6xl md:text-7xl">
          Pure sound. Sculpted.
        </h1>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-[#86868b] sm:text-base">
          Precision-milled acoustics with adaptive spatial clarity and studio-grade silence.
        </p>
      </div>

      {/* Center Stage Spacer reserved for the 3D Headphones */}
      <div className="h-[42vh] min-h-[260px] w-full sm:h-[48vh]" aria-hidden="true" />

      {/* Bottom Minimal Action Bar & Scroll Cue */}
      <div
        className={`relative z-20 mx-auto flex flex-col items-center gap-5 transition-all delay-200 duration-1000 ease-out ${
          ready ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        }`}
      >
        <div className="flex flex-wrap items-center justify-center gap-4">
          <a
            href="#studio"
            className="rounded-full bg-[#f5f5f7] px-6 py-2.5 text-sm font-medium text-black transition hover:bg-white active:scale-[0.98]"
          >
            Customize in 3D
          </a>
          <a
            href="#craft"
            className="group inline-flex items-center gap-1 px-2 py-2 text-sm font-medium text-[#2997ff] transition hover:text-[#64b5ff]"
          >
            Explore craft
            <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        {/* Quiet Scroll Indicator */}
        <div className="flex flex-col items-center gap-2 text-[11px] tracking-widest text-[#6e6e73] uppercase">
          <span>Scroll</span>
          <span className="h-6 w-[1px] bg-gradient-to-b from-[#6e6e73] to-transparent" />
        </div>
      </div>
    </section>
  );
});