<div align="center">

# SKYE ONE

**An Apple-inspired 3D scrollytelling launch experience and real-time bespoke headphone configurator.**

[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://skye-one-3d.vercel.app/)
[![React](https://img.shields.io/badge/React-18+-111113?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-111113?style=for-the-badge&logo=typescript&logoColor=3178C6)](https://www.typescriptlang.org)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-111113?style=for-the-badge&logo=threedotjs&logoColor=white)](https://docs.pmnd.rs/react-three-fiber)
[![GSAP](https://img.shields.io/badge/GSAP-ScrollTrigger-111113?style=for-the-badge&logo=greensock&logoColor=88CE02)](https://gsap.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-111113?style=for-the-badge&logo=tailwindcss&logoColor=38BDF8)](https://tailwindcss.com)

<br />

<!-- Tip: Record a crisp 10–15s clip of the intro reveal + scroll explode + studio customization, drop it in /docs/preview.gif or upload it directly to a GitHub issue to get a hosted video URL -->
<img src="./docs/preview.gif" alt="Skye One 3D Interactive Showcase" width="100%" />

</div>

---

## Overview

**Skye One** combines cinematic hardware scrollytelling with a real-time 3D product configurator—engineered around a single persistent WebGL `<Canvas>` that glides smoothly across every section of the page at 60 FPS on both desktop and mobile devices.

Every visual change made inside **Skye Studio** (colors, PBR finishes, and emissive LED beacon) persists across the entire scroll narrative and serializes directly into a shareable URL.

---

## Key Features

- **Choreographed Studio Opening Reveal** — Preloads the Draco-compressed `.glb` asset with a minimal progress bar, followed by a 2.4-second studio light-up, a 180° whip rotation, a mid-air layered dismemberment, and magnetic reassembly into a calm hero float.
- **Scroll-Synced 3D Choreography** — Powered by **GSAP ScrollTrigger** + **Lenis** smooth inertial scrolling with dedicated desktop, tablet, and mobile 3D trajectories (`gsap.matchMedia`).
- **Scroll-Driven Exploded Anatomy** — A sticky viewport sequence that separates 34+ individual meshes (headband arch, sliders, hinges, acoustic chambers, stepped bezels, LED rings, and emblem) directly in sync with scroll progress alongside timed architectural callouts.
- **Interactive Acoustic Modes** — Live switcher between **Studio**, **Quiet ANC**, and **Spatial 360°** that dynamically modulates 3D scene lighting intensity, float amplitude, and reactive LED ring pulse in real time.
- **Skye Studio (Bespoke 3D Configurator)** — Split-screen desktop workspace (and stacked mobile layout) featuring:
  - Per-part color & PBR material finishes (**Anodized**, **Brushed Metal**, **Soft Matte**, **Glossy Ceramic**)
  - Custom emissive **LED Ring** color picker synced to the ambient stage glow
  - Curated **Signature Editions**, one-click **Explode / Assemble**, **360° Auto-Spin**, and full **Reset**
  - Dynamic build pricing, a **Review Build** spec modal, and **Shareable Build URLs** via query parameter hydration

---

## Engineering & Performance Highlights

Designed to run smoothly without frame drops or bloated asset downloads:

| Optimization | Implementation |
| :--- | :--- |
| **Zero React Re-Renders on Scroll** | GSAP mutates a plain module-level `sceneMotionState` object read directly inside R3F's `useFrame` loop—keeping React's reconciler completely idle while scrolling or dragging. |
| **Cached Mesh Traversal** | All 34+ animatable meshes and their base vectors are indexed once on model mount (`useRef`), eliminating per-frame `scene.traverse()` calls. |
| **0 KB Procedural Studio Lighting** | Uses `<Environment resolution={256} frames={1}>` with procedural `<Lightformer>` softboxes instead of downloading heavy external `.hdr` environment maps. |
| **Single-Frame Baked Shadows** | `<ContactShadows frames={1} />` bakes the studio floor shadow once rather than recomputing shadow maps every frame. |
| **Mobile-Safe 360° Dragging** | Custom pointer drag with horizontal axis locking and `touch-pan-y` lets mobile users spin the headphones horizontally without trapping vertical page scroll. |
| **Adaptive GPU & Accessibility** | Caps device pixel ratio (`dpr`) at `[1, 1.5]` on mobile and `[1, 2]` on desktop, and respects `prefers-reduced-motion` by skipping the intro choreography and inertial scroll smoothing. |

---

## Tech Stack

- **Core:** React, TypeScript, Vite
- **3D & WebGL:** Three.js, React Three Fiber (`@react-three/fiber`), Drei (`@react-three/drei`), Draco Mesh Compression
- **Animation & Scroll:** GSAP (`ScrollTrigger`), Lenis
- **State & Styling:** Zustand, Tailwind CSS, Lucide React
- **3D Asset Pipeline:** Procedural multi-part headphone geometry generated via Python (`bpy`) in Blender and exported as a Draco-compressed glTF Binary (`.glb`)

---

## Project Structure

```text
├── public/
│   └── models/
│       └── headphones.glb             # Draco-compressed multi-part 3D model
├── src/
│   ├── components/
│   │   ├── Navbar.tsx                 # Responsive frosted Apple-style sticky header
│   │   ├── StudioLoader.tsx           # Asset preloader synced to drei useProgress
│   │   ├── SceneCanvas.tsx            # Persistent WebGL canvas, procedural lights & floor shadow
│   │   ├── HeadphonesModel.tsx        # Intro reveal, PBR material updates & exploded-view physics
│   │   ├── HeroSection.tsx            # Opening studio hero stage
│   │   ├── CraftSection.tsx           # Minimal hardware craft overview
│   │   ├── AnatomySection.tsx         # Sticky scroll-exploded layer showcase
│   │   ├── SpecsSection.tsx           # Interactive acoustic modes + matte Bento specs grid
│   │   ├── StudioSection.tsx          # Bespoke 3D configurator, 360° drag stage & build modal
│   │   └── Footer.tsx                 # Minimal site footer
│   ├── hooks/
│   │   └── useScrollChoreography.ts   # Lenis + responsive GSAP ScrollTrigger trajectories
│   ├── scene/
│   │   └── scrollState.ts             # Mutable zero-rerender transform bridge for useFrame
│   ├── store/
│   │   └── useConfiguratorStore.ts    # Zustand store, dynamic pricing & URL state sync
│   ├── App.tsx
│   └── index.css
```

---

## Getting Started

```bash
# 1. Clone the repository
git clone [https://github.com/Shashank-TS/skye-one-3d.git](https://github.com/Shashank-TS/skye-one-3d.git)
cd skye-one-3d

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Build for production
npm run build
```

---

## Shareable Build URLs

Configurations serialize cleanly into URL query parameters (`?ec=...&ef=...&led=...#studio`). Clicking **Share** inside Skye Studio copies a direct link that automatically hydrates the exact colorway, surface finishes, and LED beacon when opened in any browser.

---

## Author

**Shashank T S**  
[GitHub](https://github.com/Shashank-TS)  · [Live Demo](https://skye-one-3d.vercel.app/)

---

## License

MIT License — feel free to explore the architecture for learning and inspiration.
