import { create } from 'zustand';

export type FinishType = 'anodized' | 'matte' | 'glossy' | 'brushed';
export type CustomPartKey = 'earCup' | 'cushion' | 'metal' | 'accent';
export type AcousticMode = 'studio' | 'anc' | 'spatial';

export interface PartConfig {
  color: string;
  finish: FinishType;
}

export interface ConfiguratorParts {
  earCup: PartConfig;
  cushion: PartConfig;
  metal: PartConfig;
  accent: PartConfig;
  ledColor: string;
}

export const DEFAULT_PARTS: ConfiguratorParts = {
  earCup: { color: '#181a20', finish: 'anodized' },
  cushion: { color: '#141417', finish: 'matte' },
  metal: { color: '#9ca3af', finish: 'brushed' },
  accent: { color: '#d99e52', finish: 'brushed' },
  ledColor: '#38bdf8',
};

const VALID_FINISHES: FinishType[] = ['anodized', 'matte', 'glossy', 'brushed'];
const HEX_RE = /^[0-9a-fA-F]{6}$/;

const FINISH_UPCHARGE: Record<FinishType, number> = {
  matte: 0,
  anodized: 0,
  brushed: 20,
  glossy: 30,
};

export function calculateBuildPrice(parts: ConfiguratorParts): number {
  const base = 549;
  return (
    base +
    FINISH_UPCHARGE[parts.earCup.finish] +
    FINISH_UPCHARGE[parts.metal.finish] +
    FINISH_UPCHARGE[parts.accent.finish]
  );
}

export function buildShareUrl(parts: ConfiguratorParts): string {
  const url = new URL(window.location.href);
  const p = url.searchParams;
  p.set('ec', parts.earCup.color.replace('#', ''));
  p.set('ef', parts.earCup.finish);
  p.set('cc', parts.cushion.color.replace('#', ''));
  p.set('cf', parts.cushion.finish);
  p.set('mc', parts.metal.color.replace('#', ''));
  p.set('mf', parts.metal.finish);
  p.set('ac', parts.accent.color.replace('#', ''));
  p.set('af', parts.accent.finish);
  p.set('led', parts.ledColor.replace('#', ''));
  url.hash = 'studio';
  return url.toString();
}

function readInitialParts(): ConfiguratorParts {
  if (typeof window === 'undefined') {
    return {
      earCup: { ...DEFAULT_PARTS.earCup },
      cushion: { ...DEFAULT_PARTS.cushion },
      metal: { ...DEFAULT_PARTS.metal },
      accent: { ...DEFAULT_PARTS.accent },
      ledColor: DEFAULT_PARTS.ledColor,
    };
  }

  const p = new URLSearchParams(window.location.search);
  const safeHex = (key: string, fallback: string) => {
    const val = p.get(key);
    return val && HEX_RE.test(val) ? `#${val}` : fallback;
  };
  const safeFinish = (key: string, fallback: FinishType): FinishType => {
    const val = p.get(key) as FinishType | null;
    return val && VALID_FINISHES.includes(val) ? val : fallback;
  };

  return {
    earCup: {
      color: safeHex('ec', DEFAULT_PARTS.earCup.color),
      finish: safeFinish('ef', DEFAULT_PARTS.earCup.finish),
    },
    cushion: {
      color: safeHex('cc', DEFAULT_PARTS.cushion.color),
      finish: safeFinish('cf', DEFAULT_PARTS.cushion.finish),
    },
    metal: {
      color: safeHex('mc', DEFAULT_PARTS.metal.color),
      finish: safeFinish('mf', DEFAULT_PARTS.metal.finish),
    },
    accent: {
      color: safeHex('ac', DEFAULT_PARTS.accent.color),
      finish: safeFinish('af', DEFAULT_PARTS.accent.finish),
    },
    ledColor: safeHex('led', DEFAULT_PARTS.ledColor),
  };
}

interface ConfiguratorState {
  parts: ConfiguratorParts;
  exploded: boolean;
  autoRotate: boolean;
  acousticMode: AcousticMode;
  studioActive: boolean;
  setPartColor: (part: CustomPartKey, color: string) => void;
  setPartFinish: (part: CustomPartKey, finish: FinishType) => void;
  setLedColor: (color: string) => void;
  setAcousticMode: (mode: AcousticMode) => void;
  setStudioActive: (active: boolean) => void;
  toggleExploded: () => void;
  toggleAutoRotate: () => void;
  applyPreset: (preset: Omit<ConfiguratorParts, 'ledColor'> & { ledColor?: string }) => void;
  resetCustomization: () => void;
}

export const useConfiguratorStore = create<ConfiguratorState>((set) => ({
  parts: readInitialParts(),
  exploded: false,
  autoRotate: true,
  acousticMode: 'studio',
  studioActive: false,
  setPartColor: (part, color) =>
    set((state) => ({
      parts: { ...state.parts, [part]: { ...state.parts[part], color } },
    })),
  setPartFinish: (part, finish) =>
    set((state) => ({
      parts: { ...state.parts, [part]: { ...state.parts[part], finish } },
    })),
  setLedColor: (ledColor) =>
    set((state) => ({
      parts: { ...state.parts, ledColor },
    })),
  setAcousticMode: (acousticMode) => set({ acousticMode }),
  setStudioActive: (studioActive) =>
    set((state) => (state.studioActive === studioActive ? state : { studioActive })),
  toggleExploded: () => set((state) => ({ exploded: !state.exploded })),
  toggleAutoRotate: () => set((state) => ({ autoRotate: !state.autoRotate })),
  applyPreset: (preset) =>
    set((state) => ({
      parts: {
        ...state.parts,
        ...preset,
        ledColor: preset.ledColor ?? state.parts.ledColor,
      },
    })),
  resetCustomization: () =>
    set({
      parts: {
        earCup: { ...DEFAULT_PARTS.earCup },
        cushion: { ...DEFAULT_PARTS.cushion },
        metal: { ...DEFAULT_PARTS.metal },
        accent: { ...DEFAULT_PARTS.accent },
        ledColor: DEFAULT_PARTS.ledColor,
      },
      exploded: false,
    }),
}));