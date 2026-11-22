import { memo } from 'react';

const CRAFT_SPECS = [
  { value: '268g', label: 'CNC Titanium Frame' },
  { value: '-48dB', label: 'Memory-Foam Seal' },
  { value: 'Tactile', label: 'Milled Cup Controls' },
] as const;

export const CraftSection = memo(function CraftSection() {
  return (
    <section
      id="craft"
      className="relative flex min-h-[100svh] w-full items-end border-t border-white/[0.06] px-5 pt-[52vh] pb-16 sm:px-8 md:items-center md:py-24"
    >
      {/* Mobile readability fade below the upper 3D model */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black via-black/80 to-transparent md:hidden"
      />

      <div className="relative z-20 mx-auto w-full max-w-6xl">
        <div className="max-w-md">
          <p className="text-xs font-medium tracking-[0.2em] text-[#86868b] uppercase">
            Craft
          </p>

          <h2 className="mt-3 text-4xl font-semibold tracking-[-0.035em] text-[#f5f5f7] sm:text-5xl md:text-6xl">
            Sculpted for silence.
          </h2>

          <p className="mt-4 text-base text-[#86868b] sm:text-lg">
            Dark titanium rails, stepped acoustic housing, and featherweight comfort.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-white/[0.08] pt-6">
            {CRAFT_SPECS.map((spec) => (
              <div key={spec.label}>
                <p className="text-xl font-semibold tracking-tight text-[#f5f5f7] sm:text-2xl">
                  {spec.value}
                </p>
                <p className="mt-1 text-xs leading-snug text-[#86868b]">
                  {spec.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});