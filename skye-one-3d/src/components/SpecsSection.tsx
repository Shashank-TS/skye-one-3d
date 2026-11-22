import { memo } from 'react';
import { AudioWaveform, BatteryCharging, Bluetooth, Shield, Sparkles, Usb } from 'lucide-react';
import { useConfiguratorStore, type AcousticMode } from '../store/useConfiguratorStore';

const MODES: { key: AcousticMode; label: string; stat: string; caption: string }[] = [
  {
    key: 'studio',
    label: 'Studio',
    stat: 'Flat 20Hz–40kHz',
    caption: 'Uncolored reference tuning with neutral studio illumination.',
  },
  {
    key: 'anc',
    label: 'Quiet ANC',
    stat: '-48 dB Isolation',
    caption: 'Eight-mic adaptive cancellation dims the world to pure silence.',
  },
  {
    key: 'spatial',
    label: 'Spatial 360°',
    stat: 'Dynamic Head-Track',
    caption: 'Theater-wide acoustic staging with reactive ambient beacon pulse.',
  },
];

export const SpecsSection = memo(function SpecsSection() {
  const acousticMode = useConfiguratorStore((s) => s.acousticMode);
  const setAcousticMode = useConfiguratorStore((s) => s.setAcousticMode);
  const activeDetail = MODES.find((m) => m.key === acousticMode) ?? MODES[0];

  return (
    <section id="specs" className="relative w-full border-t border-white/[0.06]">
      {/* Part A: Interactive Acoustic Modes alongside the 3D Headphone */}
      <div className="relative flex min-h-[100svh] w-full items-end px-5 pt-[52vh] pb-16 sm:px-8 md:items-center md:py-24">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black via-black/80 to-transparent md:hidden"
        />

        <div className="relative z-20 mx-auto flex w-full max-w-6xl md:justify-end">
          <div className="w-full max-w-md">
            <p className="text-xs font-medium tracking-[0.2em] text-[#86868b] uppercase">
              Acoustics
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-[-0.035em] text-[#f5f5f7] sm:text-5xl">
              Hear only what matters.
            </h2>
            <p className="mt-4 text-base text-[#86868b]">
              Switch live sound profiles to preview studio lighting and acoustic tuning.
            </p>

            {/* Apple-style Segmented Mode Control */}
            <div
              role="tablist"
              aria-label="Acoustic Modes"
              className="mt-8 grid grid-cols-3 gap-1 rounded-2xl border border-white/[0.08] bg-[#111113] p-1"
            >
              {MODES.map((m) => {
                const selected = acousticMode === m.key;
                return (
                  <button
                    key={m.key}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    onClick={() => setAcousticMode(m.key)}
                    className={`rounded-xl px-3 py-2.5 text-xs font-medium transition sm:text-sm ${
                      selected
                        ? 'bg-[#f5f5f7] text-black'
                        : 'text-[#86868b] hover:text-[#f5f5f7]'
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-5 rounded-2xl border border-white/[0.08] bg-[#0b0b0d]/90 p-5">
              <p className="font-mono text-xs tracking-wider text-[#2997ff] uppercase">
                {activeDetail.stat}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-[#d2d2d7]">
                {activeDetail.caption}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Part B: Clean Matte Apple Bento Grid (opaque black keeps dense specs crisp) */}
      <div className="relative z-30 border-t border-white/[0.06] bg-black px-5 py-24 sm:px-8 sm:py-32">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 max-w-xl">
            <p className="text-xs font-medium tracking-[0.2em] text-[#86868b] uppercase">
              Specifications
            </p>
            <h3 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-[#f5f5f7] sm:text-5xl">
              Built for marathon sessions.
            </h3>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
            {/* Hero Metric 1 */}
            <div className="flex flex-col justify-between rounded-3xl border border-white/[0.08] bg-[#111113] p-7 lg:col-span-3">
              <BatteryCharging className="h-6 w-6 text-[#86868b]" />
              <div className="mt-12">
                <p className="text-5xl font-semibold tracking-[-0.04em] text-[#f5f5f7] sm:text-6xl">
                  60 hrs
                </p>
                <p className="mt-2 text-sm text-[#86868b]">
                  Continuous playback with ANC active. 5-minute charge yields 5 hours.
                </p>
              </div>
            </div>

            {/* Hero Metric 2 */}
            <div className="flex flex-col justify-between rounded-3xl border border-white/[0.08] bg-[#111113] p-7 lg:col-span-3">
              <AudioWaveform className="h-6 w-6 text-[#86868b]" />
              <div className="mt-12">
                <p className="text-5xl font-semibold tracking-[-0.04em] text-[#f5f5f7] sm:text-6xl">
                  40 mm
                </p>
                <p className="mt-2 text-sm text-[#86868b]">
                  Custom beryllium-coated dynamic drivers with &lt;0.02% total harmonic distortion.
                </p>
              </div>
            </div>

            {/* Secondary Metrics */}
            <div className="rounded-3xl border border-white/[0.08] bg-[#111113] p-6 lg:col-span-2">
              <Shield className="h-5 w-5 text-[#86868b]" />
              <p className="mt-6 text-2xl font-semibold tracking-tight text-[#f5f5f7]">-48 dB</p>
              <p className="mt-1 text-xs leading-relaxed text-[#86868b]">
                Hybrid adaptive noise cancellation calibrated 48,000 times per second.
              </p>
            </div>

            <div className="rounded-3xl border border-white/[0.08] bg-[#111113] p-6 lg:col-span-2">
              <Usb className="h-5 w-5 text-[#86868b]" />
              <p className="mt-6 text-2xl font-semibold tracking-tight text-[#f5f5f7]">
                24-bit / 96kHz
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#86868b]">
                Bit-perfect lossless DAC audio over USB-C and dedicated 3.5mm studio jack.
              </p>
            </div>

            <div className="rounded-3xl border border-white/[0.08] bg-[#111113] p-6 lg:col-span-2">
              <Bluetooth className="h-5 w-5 text-[#86868b]" />
              <p className="mt-6 text-2xl font-semibold tracking-tight text-[#f5f5f7]">
                BT 5.4 Multipoint
              </p>
              <p className="mt-1 text-xs leading-relaxed text-[#86868b]">
                Instant handoff between laptop and phone with ultra-low latency mode.
              </p>
            </div>

            {/* Clean Jump Banner into Section 5 */}
            <div className="flex flex-col items-start justify-between gap-4 rounded-3xl border border-white/[0.08] bg-[#111113] p-6 sm:flex-row sm:items-center lg:col-span-6">
              <div className="flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-[#f5f5f7]" />
                <div>
                  <p className="text-sm font-medium text-[#f5f5f7]">Make Skye One unmistakably yours.</p>
                  <p className="text-xs text-[#86868b]">
                    Tailor shell finish, cushions, titanium rails, emblem, and LED ring in real-time 3D.
                  </p>
                </div>
              </div>
              <a
                href="#studio"
                className="shrink-0 rounded-full bg-[#f5f5f7] px-5 py-2 text-xs font-medium text-black transition hover:bg-white"
              >
                Open 3D Studio
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});