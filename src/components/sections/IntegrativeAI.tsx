'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap-register';

/**
 * IntegrativeAI - Scroll-triggered text fade section
 * Text darkens from light to full opacity as user scrolls
 */
export function IntegrativeAI() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!textRef.current || !sectionRef.current) return;

    gsap.fromTo(
      textRef.current,
      {
        opacity: 0.3,
      },
      {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          end: 'bottom 20%',
          scrub: true,
        },
      }
    );
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
      <div className="max-w-[1400px] mx-auto">
        <div
          ref={textRef}
          className="text-white font-['Non_Bureau'] font-medium"
          style={{ fontSize: '39px', lineHeight: '1.4' }}
        >
          <p className="mb-8">
            We're the only AI marketing agency that combines the technology depth of consultancies with the execution speed of agencies—powered by our proprietary Integrative AI® Methodology{' '}
            <span className="text-white/50">
              that connects campaigns, data, and technology into measurable results.
            </span>
          </p>
        </div>
      </div>
    </section>
  );
}
