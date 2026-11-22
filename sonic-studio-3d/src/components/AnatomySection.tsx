import { memo } from 'react';

const CALLOUTS = [
  {
    id: 'arch',
    tag: 'Headband Assembly',
    detail: 'Reinforced polymer arch with tapered underside cushion',
    desktopPos: 'md:top-28 md:left-10',
  },
  {
    id: 'bezel',
    tag: 'Stepped Faceplate',
    detail: 'Three-tier acoustic housing with anodized trim bezel',
    desktopPos: 'md:top-28 md:right-10 md:text-right',
  },
  {
    id: 'driver',
    tag: '40mm Acoustic Chamber',
    detail: 'Recessed micro-weave driver disc & sealed leather pad',
    desktopPos: 'md:bottom-16 md:left-10',
  },
  {
    id: 'beacon',
    tag: 'Ambient LED Ring',
    detail: 'Coplanar light guide synced to active audio mode',
    desktopPos: 'md:bottom-16 md:right-10 md:text-right',
  },
] as const;

export const AnatomySection = memo(function AnatomySection() {
  return (
    <section
      id="anatomy"
      className="relative h-[220svh] w-full border-t border-white/[0.06]"
    >
      {/* Sticky full-viewport frame avoids GSAP DOM-pin mobile jank */}
      <div className="sticky top-0 flex h-[100svh] w-full flex-col justify-between overflow-hidden px-5 pt-20 pb-8 sm:px-8 md:py-20">
        {/* Top Heading */}
        <div className="relative z-20 mx-auto max-w-xl text-center">
          <p className="text-xs font-medium tracking-[0.2em] text-[#86868b] uppercase">
            Internal Anatomy
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[#f5f5f7] sm:text-5xl">
            Engineered in layers.
          </h2>
        </div>

        {/* Center Spacer reserved for Exploding 3D Headphones */}
        <div className="flex-1" aria-hidden="true" />

        {/* Callouts: floating corner annotations on desktop, compact 2x2 grid on mobile */}
        <div className="relative z-20 mx-auto grid w-full max-w-6xl grid-cols-2 gap-3 md:pointer-events-none md:static md:block">
          {CALLOUTS.map((item) => (
            <div
              key={item.id}
              className={`anatomy-callout rounded-2xl border border-white/[0.08] bg-black/70 p-3.5 backdrop-blur-md md:absolute md:max-w-[240px] md:border-white/[0.08] md:bg-black/55 md:p-4 ${item.desktopPos}`}
            >
              <p className="text-xs font-medium text-[#f5f5f7] sm:text-sm">{item.tag}</p>
              <p className="mt-1 text-[11px] leading-snug text-[#86868b] sm:text-xs">
                {item.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});