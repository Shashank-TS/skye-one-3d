import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { sceneMotionState } from '../scene/scrollState';
import { useConfiguratorStore } from '../store/useConfiguratorStore';

gsap.registerPlugin(ScrollTrigger);

type BreakpointMode = 'mobile' | 'tablet' | 'desktop';

export function useScrollChoreography() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let studioSnapped = false;

    const lenis = new Lenis({
      duration: prefersReducedMotion ? 0 : 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !prefersReducedMotion,
      touchMultiplier: 1.5,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    const onAnchorClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest('a[href^="#"]') as
        | HTMLAnchorElement
        | null;
      if (!link) return;
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        if (hash === '#studio') {
          studioSnapped = true;
        }
        lenis.scrollTo(target as HTMLElement, { offset: 0 });
      }
    };
    document.addEventListener('click', onAnchorClick);

    const mm = gsap.matchMedia();

    const setupTriggers = (mode: BreakpointMode) => {
      const isDesktopLike = mode !== 'mobile';

      const heroPose = {
        posX: 0,
        posY: 0,
        posZ: 0,
        rotX: 0.08,
        rotY: -0.45,
        rotZ: 0,
        scale: 1,
        explode: 0,
        shadowScale: 1,
      };

      const craftPose = isDesktopLike
        ? {
            posX: mode === 'desktop' ? 0.98 : 0.72,
            posY: -0.02,
            posZ: 0,
            rotX: 0.04,
            rotY: -1.12,
            rotZ: 0.03,
            scale: mode === 'desktop' ? 0.78 : 0.7,
            explode: 0,
            shadowScale: 0,
          }
        : {
            posX: 0,
            posY: 0.44,
            posZ: 0,
            rotX: 0.05,
            rotY: -1.08,
            rotZ: 0,
            scale: 0.74,
            explode: 0,
            shadowScale: 0,
          };

      const anatomyCenterPose = isDesktopLike
        ? {
            posX: 0,
            posY: 0.02,
            posZ: 0,
            rotX: 0.16,
            rotY: 0.48,
            rotZ: -0.04,
            scale: 0.76,
            shadowScale: 0,
          }
        : {
            posX: 0,
            posY: 0.12,
            posZ: 0,
            rotX: 0.16,
            rotY: 0.45,
            rotZ: 0,
            scale: 0.68,
            shadowScale: 0,
          };

      const anatomyEndPose = {
        ...anatomyCenterPose,
        explode: 0,
        rotY: 0.35,
        rotX: 0.08,
        rotZ: 0,
      };

      const acousticPose = isDesktopLike
        ? {
            posX: mode === 'desktop' ? -0.95 : -0.68,
            posY: -0.02,
            posZ: 0,
            rotX: 0.06,
            rotY: 0.88,
            rotZ: -0.02,
            scale: mode === 'desktop' ? 0.78 : 0.7,
            explode: 0,
            shadowScale: 0,
          }
        : {
            posX: 0,
            posY: 0.42,
            posZ: 0,
            rotX: 0.06,
            rotY: 0.78,
            rotZ: 0,
            scale: 0.7,
            explode: 0,
            shadowScale: 0,
          };

      // Right-stage studio positioning beside the left customizer sidebar
      const studioPose =
        mode === 'desktop'
          ? {
              posX: 0.74,
              posY: -0.02,
              posZ: 0,
              rotX: 0.06,
              rotY: -0.35,
              rotZ: 0,
              scale: 0.88,
              explode: 0,
              shadowScale: 0.85,
            }
          : mode === 'tablet'
          ? {
              posX: 0.56,
              posY: -0.02,
              posZ: 0,
              rotX: 0.06,
              rotY: -0.35,
              rotZ: 0,
              scale: 0.72,
              explode: 0,
              shadowScale: 0.75,
            }
          : {
              posX: 0,
              posY: 0.44, // Upper mobile viewport cleanly above customizer panel
              posZ: 0,
              rotX: 0.06,
              rotY: -0.35,
              rotZ: 0,
              scale: 0.66,
              explode: 0,
              shadowScale: 0,
            };

      // 1. Hero -> Craft
      gsap.fromTo(sceneMotionState, heroPose, {
        ...craftPose,
        ease: 'none',
        immediateRender: false,
        scrollTrigger: {
          trigger: '#craft',
          start: 'top bottom',
          end: 'top 20%',
          scrub: 0.65,
        },
      });

      // 2. Craft -> Anatomy
      const anatomyTl = gsap.timeline({
        scrollTrigger: {
          trigger: '#anatomy',
          start: 'top bottom',
          end: 'bottom bottom',
          scrub: 0.65,
        },
      });

      anatomyTl
        .fromTo(
          sceneMotionState,
          craftPose,
          {
            ...anatomyCenterPose,
            explode: 0,
            duration: 0.3,
            ease: 'power2.inOut',
            immediateRender: false,
          },
          0
        )
        .to(
          sceneMotionState,
          {
            explode: isDesktopLike ? 0.95 : 0.76,
            rotY: 0.78,
            duration: 0.32,
            ease: 'power2.out',
          },
          0.3
        )
        .to(
          sceneMotionState,
          {
            rotY: 0.92,
            duration: 0.14,
            ease: 'none',
          },
          0.62
        )
        .to(
          sceneMotionState,
          {
            ...anatomyEndPose,
            duration: 0.24,
            ease: 'power2.inOut',
          },
          0.76
        );

      const callouts = gsap.utils.toArray<HTMLElement>('.anatomy-callout');
      if (callouts.length > 0) {
        gsap.set(callouts, { opacity: 0, y: 14 });
        const calloutTl = gsap.timeline({
          scrollTrigger: {
            trigger: '#anatomy',
            start: 'top 15%',
            end: 'bottom 85%',
            scrub: 0.4,
          },
        });
        calloutTl
          .to(callouts, { opacity: 1, y: 0, stagger: 0.06, duration: 0.28, ease: 'power2.out' })
          .to(callouts, { opacity: 1, duration: 0.44 })
          .to(callouts, { opacity: 0, y: -10, stagger: 0.04, duration: 0.28, ease: 'power2.in' });
      }

      // 3. Anatomy -> Acoustic Modes
      gsap.fromTo(sceneMotionState, anatomyEndPose, {
        ...acousticPose,
        ease: 'none',
        immediateRender: false,
        scrollTrigger: {
          trigger: '#specs',
          start: 'top bottom',
          end: 'top 20%',
          scrub: 0.65,
        },
      });

      // 4. Specs -> Customizer Studio (finishes positioning right as #studio locks flush to top)
      gsap.fromTo(sceneMotionState, acousticPose, {
        ...studioPose,
        ease: 'none',
        immediateRender: false,
        scrollTrigger: {
          trigger: '#studio',
          start: 'top bottom',
          end: 'top top',
          scrub: 0.65,
        },
      });

      // 5. Studio interactive state + one-shot magnetic stop to prevent overshooting into Footer
      ScrollTrigger.create({
        trigger: '#studio',
        start: 'top 55%',
        end: 'bottom top',
        onEnter: () => useConfiguratorStore.getState().setStudioActive(true),
        onEnterBack: () => useConfiguratorStore.getState().setStudioActive(true),
        onLeave: () => useConfiguratorStore.getState().setStudioActive(false),
        onLeaveBack: () => useConfiguratorStore.getState().setStudioActive(false),
      });

      if (isDesktopLike && !prefersReducedMotion) {
        ScrollTrigger.create({
          trigger: '#studio',
          start: 'top 22%',
          end: 'top top',
          onEnter: () => {
            if (studioSnapped) return;
            studioSnapped = true;
            const el = document.getElementById('studio');
            if (el) {
              // Locks wheel inertia briefly so Studio settles flush at top: 0 without cutting off controls
              lenis.scrollTo(el, { offset: 0, duration: 0.45, lock: true });
            }
          },
          onLeaveBack: () => {
            // Re-arm magnetic stop once user scrolls back up into Specs
            studioSnapped = false;
          },
        });
      }
    };

    mm.add('(min-width: 1024px)', () => setupTriggers('desktop'));
    mm.add('(min-width: 768px) and (max-width: 1023px)', () => setupTriggers('tablet'));
    mm.add('(max-width: 767px)', () => setupTriggers('mobile'));

    ScrollTrigger.refresh();

    return () => {
      document.removeEventListener('click', onAnchorClick);
      mm.revert();
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);
}