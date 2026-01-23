'use client';

import React from 'react';
import Image from 'next/image';

/**
 * HeroSection - The main headline overlay on top of the Giant animation
 * Uses the full "FRIENDS WITH GIANTS" logo SVG that overlays across the top
 */
export function HeroSection() {
  return (
    <section className="relative h-screen w-full flex items-start justify-start pt-16 px-16 md:px-24 pointer-events-none">
      {/* Full Logo - Overlays across top as per reference */}
      <div className="relative w-full max-w-4xl z-20 pointer-events-auto">
        <Image
          src="/logo svgs/FriendswGiantslogo.svg"
          alt="Friends with Giants"
          width={1920}
          height={408}
          className="w-full h-auto"
          priority
          style={{
            filter: 'brightness(0) saturate(100%) invert(53%) sepia(74%) saturate(1668%) hue-rotate(5deg) brightness(97%) contrast(92%)'
          }}
        />

        {/* Subtitle - Industrial aesthetic */}
        <div className="mt-8 md:mt-12 pointer-events-auto">
          <p className="text-lg md:text-xl text-giant-charcoal/70 font-light max-w-md leading-relaxed">
            Industrial-grade creators building the future of agency work.
          </p>
        </div>
      </div>
    </section>
  );
}
