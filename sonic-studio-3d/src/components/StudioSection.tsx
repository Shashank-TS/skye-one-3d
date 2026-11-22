import { memo, useCallback, useMemo, useRef, useState } from 'react';
import { Check, Layers, MoveHorizontal, RotateCcw, RotateCw, Share2, X } from 'lucide-react';
import {
  buildShareUrl,
  calculateBuildPrice,
  useConfiguratorStore,
  type CustomPartKey,
  type FinishType,
} from '../store/useConfiguratorStore';
import { sceneMotionState } from '../scene/scrollState';

type TabKey = CustomPartKey | 'led';

const PART_TABS: { key: TabKey; label: string }[] = [
  { key: 'earCup', label: 'Earcup' },
  { key: 'cushion', label: 'Cushions' },
  { key: 'metal', label: 'Frame' },
  { key: 'accent', label: 'Accent' },
  { key: 'led', label: 'LED' },
];

const SWATCHES = [
  { name: 'Obsidian', hex: '#181a20' },
  { name: 'Space Grey', hex: '#484b52' },
  { name: 'Cloud Silver', hex: '#dfe2e6' },
  { name: 'Titanium Sand', hex: '#b8a99a' },
  { name: 'Midnight Blue', hex: '#1e3a5f' },
  { name: 'Alpine Sage', hex: '#4b6356' },
  { name: 'Champagne', hex: '#d99e52' },
];

const LED_SWATCHES = [
  { name: 'Sky Cyan', hex: '#38bdf8' },
  { name: 'Pure White', hex: '#f8fafc' },
  { name: 'Warm Amber', hex: '#fbbf24' },
  { name: 'Electric Violet', hex: '#a855f7' },
  { name: 'Neon Mint', hex: '#2dd4bf' },
  { name: 'Pulse Rose', hex: '#fb7185' },
];

const FINISHES: { key: FinishType; label: string }[] = [
  { key: 'anodized', label: 'Anodized' },
  { key: 'brushed', label: 'Brushed' },
  { key: 'matte', label: 'Matte' },
  { key: 'glossy', label: 'Ceramic' },
];

const EDITIONS = [
  {
    name: 'Noir Gold',
    preset: {
      earCup: { color: '#181a20', finish: 'anodized' as FinishType },
      cushion: { color: '#141417', finish: 'matte' as FinishType },
      metal: { color: '#9ca3af', finish: 'brushed' as FinishType },
      accent: { color: '#d99e52', finish: 'brushed' as FinishType },
      ledColor: '#fbbf24',
    },
  },
  {
    name: 'Studio Silver',
    preset: {
      earCup: { color: '#dfe2e6', finish: 'anodized' as FinishType },
      cushion: { color: '#a3a8b0', finish: 'matte' as FinishType },
      metal: { color: '#d1d5db', finish: 'brushed' as FinishType },
      accent: { color: '#484b52', finish: 'anodized' as FinishType },
      ledColor: '#38bdf8',
    },
  },
  {
    name: 'Midnight Cobalt',
    preset: {
      earCup: { color: '#1e3a5f', finish: 'anodized' as FinishType },
      cushion: { color: '#181a20', finish: 'matte' as FinishType },
      metal: { color: '#9ca3af', finish: 'brushed' as FinishType },
      accent: { color: '#dfe2e6', finish: 'brushed' as FinishType },
      ledColor: '#38bdf8',
    },
  },
  {
    name: 'Titanium Sand',
    preset: {
      earCup: { color: '#b8a99a', finish: 'matte' as FinishType },
      cushion: { color: '#484b52', finish: 'matte' as FinishType },
      metal: { color: '#d99e52', finish: 'brushed' as FinishType },
      accent: { color: '#dfe2e6', finish: 'anodized' as FinishType },
      ledColor: '#f8fafc',
    },
  },
];

export const StudioSection = memo(function StudioSection() {
  const [activeTab, setActiveTab] = useState<TabKey>('earCup');
  const [hasDragged, setHasDragged] = useState(false);
  const [copied, setCopied] = useState(false);
  const [justReset, setJustReset] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const parts = useConfiguratorStore((s) => s.parts);
  const exploded = useConfiguratorStore((s) => s.exploded);
  const autoRotate = useConfiguratorStore((s) => s.autoRotate);
  const setPartColor = useConfiguratorStore((s) => s.setPartColor);
  const setPartFinish = useConfiguratorStore((s) => s.setPartFinish);
  const setLedColor = useConfiguratorStore((s) => s.setLedColor);
  const toggleExploded = useConfiguratorStore((s) => s.toggleExploded);
  const toggleAutoRotate = useConfiguratorStore((s) => s.toggleAutoRotate);
  const applyPreset = useConfiguratorStore((s) => s.applyPreset);
  const resetCustomization = useConfiguratorStore((s) => s.resetCustomization);

  const price = useMemo(() => calculateBuildPrice(parts), [parts]);

  const dragRef = useRef({
    active: false,
    lockedAxis: null as 'x' | 'y' | null,
    lastX: 0,
    lastY: 0,
    startX: 0,
    startY: 0,
  });

  const handlePointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    dragRef.current = {
      active: true,
      lockedAxis: e.pointerType === 'mouse' ? 'x' : null,
      lastX: e.clientX,
      lastY: e.clientY,
      startX: e.clientX,
      startY: e.clientY,
    };
    if (e.pointerType === 'mouse') {
      e.currentTarget.setPointerCapture(e.pointerId);
      sceneMotionState.isDragging = true;
    }
  }, []);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d.active) return;

    const dx = e.clientX - d.lastX;
    const dy = e.clientY - d.lastY;

    if (!d.lockedAxis) {
      const totalX = Math.abs(e.clientX - d.startX);
      const totalY = Math.abs(e.clientY - d.startY);
      if (totalX < 6 && totalY < 6) return;
      d.lockedAxis = totalX >= totalY ? 'x' : 'y';
      if (d.lockedAxis === 'y') {
        d.active = false;
        return;
      }
      sceneMotionState.isDragging = true;
    }

    sceneMotionState.userRotY += dx * 0.011;
    if (e.pointerType === 'mouse') {
      sceneMotionState.userRotX = Math.max(
        -0.45,
        Math.min(0.45, sceneMotionState.userRotX + dy * 0.005)
      );
    }

    d.lastX = e.clientX;
    d.lastY = e.clientY;
    setHasDragged((prev) => (prev ? prev : true));
  }, []);

  const handlePointerEnd = useCallback(() => {
    dragRef.current.active = false;
    dragRef.current.lockedAxis = null;
    sceneMotionState.isDragging = false;
  }, []);

  const handleResetAll = useCallback(() => {
    resetCustomization();
    sceneMotionState.userRotX = 0;
    sceneMotionState.userRotY = 0;
    setActiveTab('earCup');
    if (window.location.search) {
      window.history.replaceState(null, '', `${window.location.pathname}#studio`);
    }
    setJustReset(true);
    window.setTimeout(() => setJustReset(false), 1600);
  }, [resetCustomization]);

  const handleShareBuild = useCallback(async () => {
    const url = buildShareUrl(useConfiguratorStore.getState().parts);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.history.replaceState(null, '', url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  const isLedTab = activeTab === 'led';
  const currentPart = !isLedTab ? parts[activeTab] : null;
  const activeSwatchName = isLedTab
    ? LED_SWATCHES.find((s) => s.hex === parts.ledColor)?.name ?? 'Custom'
    : SWATCHES.find((s) => s.hex === currentPart?.color)?.name ?? 'Custom';

  return (
    // Tall sticky track on desktop keeps the full Studio locked flush at top:0 until user scrolls past to Footer
    <section
      id="studio"
      className="relative w-full border-t border-white/[0.06] md:h-[165svh]"
    >
      <div className="flex min-h-[100svh] w-full flex-col px-4 pt-16 pb-6 sm:px-8 md:sticky md:top-0 md:h-[100svh] md:pt-[72px] md:pb-6">
        <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col">
          {/* Top Studio Header Bar */}
          <div className="relative z-30 flex flex-wrap items-center justify-between gap-3 pb-4">
            <div>
              <p className="text-[11px] font-medium tracking-[0.2em] text-[#86868b] uppercase">
                Skye Studio
              </p>
              <h2 className="text-xl font-semibold tracking-tight text-[#f5f5f7] sm:text-2xl">
                Customize Skye One
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={toggleAutoRotate}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                  autoRotate
                    ? 'border-white/25 bg-white/10 text-[#f5f5f7]'
                    : 'border-white/[0.08] bg-[#111113]/85 text-[#86868b] hover:text-[#f5f5f7]'
                }`}
              >
                <RotateCw className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">360° Spin</span>
              </button>

              <button
                type="button"
                onClick={toggleExploded}
                className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${
                  exploded
                    ? 'border-[#2997ff]/60 bg-[#2997ff]/15 text-[#64b5ff]'
                    : 'border-white/[0.08] bg-[#111113]/85 text-[#a1a1a6] hover:text-[#f5f5f7]'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                {exploded ? 'Assemble' : 'Explode'}
              </button>

              <button
                type="button"
                onClick={handleResetAll}
                title="Reset all colors, finishes, and camera angle"
                className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-[#111113]/85 px-3.5 py-1.5 text-xs font-medium text-[#d2d2d7] transition hover:border-white/25 hover:text-white active:scale-[0.98]"
              >
                {justReset ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    Reset
                  </>
                ) : (
                  <>
                    <RotateCcw className="h-3.5 w-3.5" />
                    Reset
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleShareBuild}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.08] bg-[#111113]/85 px-3.5 py-1.5 text-xs font-medium text-[#d2d2d7] transition hover:border-white/25 hover:text-white"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                    Copied
                  </>
                ) : (
                  <>
                    <Share2 className="h-3.5 w-3.5" />
                    Share
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Split Workspace: Left Customizer Panel + Right Open 3D Stage */}
          <div className="flex flex-1 flex-col-reverse gap-4 md:grid md:grid-cols-12 md:items-center md:gap-6">
            {/* Left Customizer Sidebar (~33% on desktop) */}
            <aside className="relative z-30 w-full rounded-3xl border border-white/[0.1] bg-[#111113]/92 p-4 backdrop-blur-xl sm:p-5 md:col-span-5 lg:col-span-4">
              {/* Part Tabs */}
              <div className="grid grid-cols-5 gap-1 rounded-2xl bg-black/55 p-1">
                {PART_TABS.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setActiveTab(tab.key)}
                    className={`rounded-xl px-1.5 py-2 text-[11px] font-medium transition sm:text-xs ${
                      activeTab === tab.key
                        ? 'bg-[#f5f5f7] text-black'
                        : 'text-[#86868b] hover:text-[#f5f5f7]'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Color Swatches */}
              <div className="mt-5">
                <div className="mb-2.5 flex items-center justify-between text-xs">
                  <span className="text-[#86868b]">{isLedTab ? 'Beacon Glow' : 'Color'}</span>
                  <span className="font-medium text-[#f5f5f7]">{activeSwatchName}</span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  {(isLedTab ? LED_SWATCHES : SWATCHES).map((s) => {
                    const isSelected = isLedTab
                      ? parts.ledColor === s.hex
                      : currentPart?.color === s.hex;
                    return (
                      <button
                        key={s.hex}
                        type="button"
                        title={s.name}
                        aria-label={`Set ${activeTab} to ${s.name}`}
                        onClick={() =>
                          isLedTab ? setLedColor(s.hex) : setPartColor(activeTab, s.hex)
                        }
                        style={{ backgroundColor: s.hex }}
                        className={`h-7 w-7 rounded-full border-2 transition-transform ${
                          isSelected
                            ? 'scale-110 border-white ring-2 ring-white/25'
                            : 'border-white/15 hover:scale-105'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Surface Finish */}
              {!isLedTab && currentPart ? (
                <div className="mt-5">
                  <p className="mb-2 text-xs text-[#86868b]">Surface Finish</p>
                  <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4 md:grid-cols-2">
                    {FINISHES.map((f) => (
                      <button
                        key={f.key}
                        type="button"
                        onClick={() => setPartFinish(activeTab, f.key)}
                        className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                          currentPart.finish === f.key
                            ? 'border-white/40 bg-white/15 text-[#f5f5f7]'
                            : 'border-white/[0.08] bg-black/25 text-[#86868b] hover:text-[#f5f5f7]'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="mt-5 rounded-xl border border-white/[0.06] bg-black/30 px-3.5 py-2.5 text-xs text-[#86868b]">
                  Syncs both outer earcup light rings and the right status indicator.
                </p>
              )}

              {/* Signature Editions */}
              <div className="mt-5 border-t border-white/[0.08] pt-4">
                <p className="mb-2 text-xs text-[#86868b]">Signature Editions</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {EDITIONS.map((ed) => (
                    <button
                      key={ed.name}
                      type="button"
                      onClick={() => applyPreset(ed.preset)}
                      className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-1.5 text-left text-xs text-[#d2d2d7] transition hover:border-white/25 hover:text-white"
                    >
                      {ed.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Total + Review Build */}
              <div className="mt-5 flex items-center justify-between border-t border-white/[0.08] pt-4">
                <div>
                  <p className="text-[10px] tracking-wider text-[#86868b] uppercase">Est. Total</p>
                  <p className="text-xl font-semibold tracking-tight text-[#f5f5f7]">${price}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSummaryOpen(true)}
                  className="rounded-full bg-[#2997ff] px-5 py-2.5 text-xs font-medium text-white transition hover:bg-[#3aa0ff] active:scale-[0.98]"
                >
                  Review Build
                </button>
              </div>
            </aside>

            {/* Right Interactive 360° Drag Stage (~67% on desktop, upper 42vh on mobile) */}
            <div
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              className="relative z-20 flex h-[42vh] min-h-[280px] w-full cursor-grab items-end justify-center pb-3 touch-pan-y select-none active:cursor-grabbing md:col-span-7 md:h-full lg:col-span-8"
            >
              <div
                className={`pointer-events-none inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-black/60 px-3.5 py-1.5 text-[11px] text-[#86868b] backdrop-blur-md transition-opacity duration-500 ${
                  hasDragged ? 'opacity-0' : 'opacity-100'
                }`}
              >
                <MoveHorizontal className="h-3.5 w-3.5" />
                Drag to rotate 360°
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Build Summary Modal */}
      {summaryOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Custom Skye One Summary"
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 px-4 backdrop-blur-md"
          onClick={() => setSummaryOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-white/[0.1] bg-[#111113] p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] tracking-[0.2em] text-[#86868b] uppercase">Bespoke Spec</p>
                <h3 className="text-xl font-semibold text-[#f5f5f7]">Skye One — Custom</h3>
              </div>
              <button
                type="button"
                aria-label="Close build summary"
                onClick={() => setSummaryOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.06] text-[#a1a1a6] hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-5 divide-y divide-white/[0.08] border-y border-white/[0.08] text-sm">
              {(
                [
                  ['Earcup Shell', parts.earCup.color, parts.earCup.finish],
                  ['Ear Cushions', parts.cushion.color, parts.cushion.finish],
                  ['Titanium Frame', parts.metal.color, parts.metal.finish],
                  ['Accent & S Emblem', parts.accent.color, parts.accent.finish],
                  ['Ambient LED Ring', parts.ledColor, 'Emissive'],
                ] as const
              ).map(([label, hex, finish]) => (
                <div key={label} className="flex items-center justify-between py-3">
                  <span className="text-[#86868b]">{label}</span>
                  <span className="flex items-center gap-2 font-medium text-[#f5f5f7] capitalize">
                    <span
                      className="h-3.5 w-3.5 rounded-full border border-white/25"
                      style={{ backgroundColor: hex }}
                    />
                    {finish}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-between">
              <span className="text-sm text-[#86868b]">Total</span>
              <span className="text-2xl font-semibold text-[#f5f5f7]">${price}</span>
            </div>

            <div className="mt-6 flex gap-2.5">
              <button
                type="button"
                onClick={handleShareBuild}
                className="flex-1 rounded-full border border-white/15 py-2.5 text-xs font-medium text-[#f5f5f7] transition hover:bg-white/10"
              >
                {copied ? 'Build URL Copied' : 'Copy Share Link'}
              </button>
              <button
                type="button"
                onClick={() => setSummaryOpen(false)}
                className="flex-1 rounded-full bg-[#f5f5f7] py-2.5 text-xs font-medium text-black transition hover:bg-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
});