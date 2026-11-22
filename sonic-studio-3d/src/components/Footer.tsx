import { memo } from 'react';

export const Footer = memo(function Footer() {
  return (
    <footer className="relative z-30 border-t border-white/[0.08] bg-black px-5 py-12 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-tight text-[#f5f5f7]">Skye Audio</p>
          <p className="mt-1 text-xs text-[#6e6e73]">
            Interactive 3D product experience crafted with React, TypeScript, Three.js, GSAP &amp;
            Zustand.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-[#86868b]">
          <a href="#hero" className="transition hover:text-[#f5f5f7]">
            Overview
          </a>
          <a href="#craft" className="transition hover:text-[#f5f5f7]">
            Craft
          </a>
          <a href="#anatomy" className="transition hover:text-[#f5f5f7]">
            Anatomy
          </a>
          <a href="#specs" className="transition hover:text-[#f5f5f7]">
            Specs
          </a>
          <a href="#studio" className="transition hover:text-[#f5f5f7]">
            Studio
          </a>
        </div>
      </div>
    </footer>
  );
});