'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap-register';

/**
 * HowCanWeHelpTitle - Title section before geometric animation
 * Text fades from low to full opacity as user scrolls (same pattern as IntegrativeAI)
 */
export function HowCanWeHelpTitle() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);

  useGSAP(() => {
    if (!textRef.current) return;

    gsap.fromTo(textRef.current,
      { opacity: 0.1 },
      {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 85%',
          end: 'top 30%',
          scrub: 1,
        }
      }
    );
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen py-32 px-8 flex items-center justify-center bg-giant-charcoal"
    >
      <p
        ref={textRef}
        className="text-white font-['Non_Bureau'] font-medium opacity-10"
        style={{ fontSize: '39px', lineHeight: '1.4' }}
      >
        What do you need help with?
      </p>
    </section>
  );
}
