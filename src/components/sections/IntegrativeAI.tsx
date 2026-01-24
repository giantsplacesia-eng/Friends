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
  const paragraph1Ref = useRef<HTMLParagraphElement>(null);
  const paragraph2Ref = useRef<HTMLParagraphElement>(null);

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

    createFade(paragraph1Ref.current);
    createFade(paragraph2Ref.current);

  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-32 px-8"
      style={{
        background: 'linear-gradient(180deg, #0075A3 0%, #005580 100%)',
        zIndex: 30,
      }}
    >
      <div className="max-w-[1400px] mx-auto space-y-16">
        <div className="text-white font-['Non_Bureau'] font-medium" style={{ fontSize: '39px', lineHeight: '1.4' }}>
          <p ref={paragraph1Ref} className="mb-16 opacity-10">
            Many see the new AI landscape as a threat.
          </p>
          <p className="mb-16 opacity-20">
            We see it as an alliance.
          </p>
          <p className="mb-16 opacity-20">
            We translate the colossal power of the world's most advanced models into elegant growth systems for the brands of tomorrow.
          </p>
        </div>

        <div className="text-white font-['Non_Bureau'] font-medium" style={{ fontSize: '39px', lineHeight: '1.4' }}>
          <p ref={paragraph2Ref} className="mb-16 opacity-10">
            The Giants are rewriting the rules of the market.
          </p>
          <p className="opacity-20">
            You can fear the change, or you can befriend the creators.
          </p>
        </div>
      </div>
    </section>
  );
}
