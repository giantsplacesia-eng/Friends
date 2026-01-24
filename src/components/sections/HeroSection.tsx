'use client';

import React from 'react';
import Image from 'next/image';

/**
 * HeroSection - The main headline overlay on top of the Giant animation
 * Uses the full "FRIENDS WITH GIANTS" logo SVG that overlays across the top
 */
export function HeroSection() {
  return (
    <section className="relative h-screen w-full flex items-start justify-center pointer-events-none" style={{ paddingTop: '32px' }}>
      {/* Container now has explicit width so percentage sizing works correctly */}
      <div className="relative z-20 w-full max-w-[1400px] px-8" style={{ filter: 'brightness(0) saturate(100%) invert(16%) sepia(7%) saturate(479%) hue-rotate(106deg) brightness(96%) contrast(92%)' }}>
        <Image
          src="/logo svgs/FriendswGiantslogo.svg"
          alt="Friends with Giants"
          width={1360}
          height={330}
          className="h-auto w-full mx-auto" // Now uses full width of the container (1400px max)
          priority
        />
      </div>
    </section>
  );
}
