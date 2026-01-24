'use client';

import React from 'react';
import Image from 'next/image';

/**
 * HeroSection - The main headline overlay on top of the Giant animation
 * Uses the full "FRIENDS WITH GIANTS" logo SVG that overlays across the top
 */
export function HeroSection() {
  return (
    <section className="relative h-screen w-screen flex items-start justify-center pointer-events-none" style={{ paddingTop: '32px', marginLeft: '-281px' }}>
      {/* Full Logo - Centered, 15% smaller (212.5% of original), dark grey/green color, top-aligned with FWG logo */}
      <div className="relative z-20 pointer-events-auto" style={{ filter: 'brightness(0) saturate(100%) invert(16%) sepia(7%) saturate(479%) hue-rotate(106deg) brightness(96%) contrast(92%)' }}>
        <Image
          src="/logo svgs/FriendswGiantslogo.svg"
          alt="Friends with Giants"
          width={1360}
          height={330}
          className="h-auto"
          priority
        />
      </div>
    </section>
  );
}
