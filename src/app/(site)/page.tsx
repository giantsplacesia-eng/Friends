'use client';

import React, { useState } from 'react';
import { LeftController } from '@/components/nav/LeftController';
import { RightStage } from '@/components/layout/RightStage';
import { ReferenceOverlay } from '@/components/debug/ReferenceOverlay';

import { MobileAccordionLayout } from '@/components/layout/MobileAccordionLayout';

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');

  return (
    <div className="relative bg-giant-white">
      <ReferenceOverlay />

      {/* --- DESKTOP LAYOUT (Hidden on Mobile) --- */}
      <div className="hidden md:block">
        {/* Left Navigation - Fixed Position */}
        <div className="fixed top-0 left-0 h-screen w-[281px] z-50">
          <LeftController
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </div>

        {/* Right Stage - Scrollable Content */}
        <div className="ml-[281px]">
          <RightStage activeSection={activeSection} />
        </div>
      </div>

      {/* --- MOBILE LAYOUT (Visible on Mobile) --- */}
      <MobileAccordionLayout />

    </div>
  );
}
