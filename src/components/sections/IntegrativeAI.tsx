'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap-register';

/**
 * IntegrativeAI - Scroll-triggered text fade section
 * Text fades from low to full opacity as user scrolls (inspired by Keenfolks)
 */
export function IntegrativeAI() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const p1Ref = useRef<HTMLParagraphElement>(null);
  const p2Ref = useRef<HTMLParagraphElement>(null);
  const p3Ref = useRef<HTMLParagraphElement>(null);
  const p4Ref = useRef<HTMLParagraphElement>(null);
  const p5Ref = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    if (!sectionRef.current) return;

    const createFade = (el: HTMLElement | null) => {
      if (!el) return;
      gsap.fromTo(el,
        { opacity: 0.1 },
        {
          opacity: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            end: 'top 30%',
            scrub: 1,
            refreshPriority: -1, // Calculate AFTER the Hero pin
          },
        }
      );
    };

    // Animate all paragraphs
    createFade(p1Ref.current);
    createFade(p2Ref.current);
    createFade(p3Ref.current);
    createFade(p4Ref.current);
    createFade(p5Ref.current);

  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-32 px-8 flex items-center justify-center"
    >
      <div className="max-w-[800px] flex flex-col space-y-16">
        <p ref={p1Ref} className="text-white font-['Non_Bureau'] font-medium opacity-10" style={{ fontSize: '39px', lineHeight: '1.4' }}>
          Many see the new AI landscape as a threat.
        </p>
        <p ref={p2Ref} className="text-white font-['Non_Bureau'] font-medium opacity-10" style={{ fontSize: '39px', lineHeight: '1.4' }}>
          We see it as an alliance.
        </p>
        <p ref={p3Ref} className="text-white font-['Non_Bureau'] font-medium opacity-10" style={{ fontSize: '39px', lineHeight: '1.4' }}>
          We translate the colossal power of the world's most advanced models into elegant growth systems for the brands of tomorrow.
        </p>
        <p ref={p4Ref} className="text-white font-['Non_Bureau'] font-medium opacity-10" style={{ fontSize: '39px', lineHeight: '1.4' }}>
          The Giants are rewriting the rules of the market.
        </p>
        <p ref={p5Ref} className="text-white font-['Non_Bureau'] font-medium opacity-10" style={{ fontSize: '39px', lineHeight: '1.4' }}>
          You can fear the change, or you can befriend the creators.
        </p>
      </div>
    </section>
  );
}
