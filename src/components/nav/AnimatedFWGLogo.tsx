'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from '@/lib/gsap-register';

export function AnimatedFWGLogo() {
  const lineRef = useRef<SVGRectElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!lineRef.current || !svgRef.current) return;

    // Find the parent aside element (left navigation)
    const aside = svgRef.current.closest('aside');
    if (!aside) return;

    console.log('AnimatedFWGLogo: Found aside element, setting up scroll listener');

    // Animate the line to curve upward into a smile on left nav scroll
    const handleScroll = () => {
      const scrollY = aside.scrollTop;
      const maxScroll = 300; // Scroll distance for full smile
      const progress = Math.min(scrollY / maxScroll, 1);

      console.log('Scroll detected:', scrollY, 'Progress:', progress);

      if (lineRef.current) {
        // Create smile effect by curving the line upward
        const curveUp = progress * -8; // Negative value to move UP (smile) - increased from -6
        const roundCorners = progress * 15; // Rounded corners for smooth smile - increased from 12

        // Direct attribute manipulation for immediate feedback
        lineRef.current.setAttribute('y', String(462.89 + curveUp));
        lineRef.current.setAttribute('rx', String(roundCorners));
        lineRef.current.setAttribute('ry', String(roundCorners * 0.8));

        // Also apply transform for additional curve effect
        const scaleY = 1 + (progress * 0.3);
        lineRef.current.style.transform = `scaleY(${scaleY})`;
        lineRef.current.style.transformOrigin = 'center center';
      }
    };

    // Call once on mount to set initial state
    handleScroll();

    aside.addEventListener('scroll', handleScroll, { passive: true });
    return () => aside.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <svg
      ref={svgRef}
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
