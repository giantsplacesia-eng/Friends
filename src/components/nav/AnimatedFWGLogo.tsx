'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap-register';

export function AnimatedFWGLogo() {
  const lineRef = useRef<SVGRectElement>(null);

  useEffect(() => {
    if (!lineRef.current) return;

    // Animate the line to curve into a smile on scroll
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 500; // Scroll distance for full smile
      const progress = Math.min(scrollY / maxScroll, 1);

      if (lineRef.current) {
        // Transform the rect into a smile shape using d3 path
        // Since rect can't curve, we'll use transform to create the illusion
        const curveAmount = progress * 8; // Max 8px curve at center
        const skewAmount = progress * -2; // Slight skew for smile effect

        gsap.to(lineRef.current, {
          attr: {
            y: 462.89 + curveAmount, // Move down slightly
            rx: progress * 15, // Add rounded corners
          },
          scaleY: 1 - (progress * 0.3), // Compress vertically
          skewY: skewAmount,
          duration: 0.3,
          ease: 'power2.out'
        });
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <svg
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      version="1.1"
      viewBox="883 462 154 156"
      className="w-full h-auto"
    >
      <defs>
        <style>
          {`.st0 { fill: #2c302f; }`}
        </style>
      </defs>
      <polygon className="st0" points="883.4 462.66 913.88 462.66 913.88 492.32 900.63 492.32 900.63 524.86 912.55 524.86 912.55 554.52 900.63 554.52 900.63 617.6 883.4 617.6 883.4 462.66"/>
      <polygon className="st0" points="917.85 498.91 935.37 498.91 938.25 590.19 938.7 590.19 942.69 498.91 968.41 498.91 971.96 590.19 972.41 590.19 975.74 498.91 992.59 498.91 986.38 618.34 959.77 618.34 955.11 524.84 954.67 524.84 950.68 618.34 924.07 618.34 917.86 498.91 917.85 498.91"/>
      {/* The line above W - animated to smile on scroll */}
      <rect
        ref={lineRef}
        className="st0"
        x="918.16"
        y="462.89"
        width="74.19"
        height="29.78"
        style={{ transformOrigin: 'center center' }}
      />
      <path className="st0" d="M997.04,603.68v-120.64c0-12.9,8.51-20.33,19.84-20.33s19.84,7.43,19.84,20.33v40.21h-17.01v-27.97c0-1.97-.87-3.28-2.62-3.28s-2.62,1.31-2.62,3.28v89.61c0,2.19,1.09,3.72,3.05,3.72s3.05-1.53,3.05-3.72v-22.73h-.12v-29.29h17.13v83.92h-14.83l-1.31-10.49h-.44c-1.09,7.87-6.1,11.58-11.99,11.58-6.76,0-11.99-5.24-11.99-14.21h0Z"/>
    </svg>
  );
}
