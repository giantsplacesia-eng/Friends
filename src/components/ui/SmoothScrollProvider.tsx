'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { ScrollTrigger } from '@/lib/gsap-register';

interface SmoothScrollProviderProps {
  children: React.ReactNode;
}

/**
 * SmoothScrollProvider - Lenis Smooth Scroll Integration
 *
 * Provides buttery-smooth scroll physics and integrates with GSAP ScrollTrigger
 * CRITICAL: Stops Lenis when cursor is over left navigation to enable independent scroll
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Initialize Lenis with prevent callback
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Custom easing
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      // CRITICAL: Prevent Lenis from capturing scroll on left nav
      prevent: (node) => {
        // Check if the scroll target or any parent is the left nav
        let element = node as HTMLElement;
        while (element) {
          if (element.tagName === 'ASIDE') {
            console.log('🚫 Lenis: Ignoring scroll on left nav');
            return true; // Prevent Lenis from handling this scroll
          }
          element = element.parentElement as HTMLElement;
        }
        return false; // Allow Lenis to handle this scroll
      }
    });

    lenisRef.current = lenis;

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    // CRITICAL: When ScrollTrigger refreshes (e.g., after images load),
    // tell Lenis to recalculate the scrollable height
    ScrollTrigger.addEventListener('refresh', () => {
      lenis.resize();
      console.log('🔄 Lenis resized after ScrollTrigger refresh');
    });

    // Tell ScrollTrigger about Lenis as the scroller
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length) {
          lenis.scrollTo(value, { immediate: true });
          return;
        }
        return lenis.scroll;
      },
      getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
      },
      pinType: document.documentElement.style.transform ? "transform" : "fixed"
    });

    // Animation loop
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Cleanup
    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
