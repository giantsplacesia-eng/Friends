'use client';

import React, { useState } from 'react';
import { LeftController } from '@/components/nav/LeftController';
import { RightStage } from '@/components/layout/RightStage';
import { ReferenceOverlay } from '@/components/debug/ReferenceOverlay';

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');

  return (
    <div className="relative bg-giant-white">
      <ReferenceOverlay />

      {/* Left Navigation - Fixed Position */}
      <div className="fixed top-0 left-0 h-screen w-[281px] z-50">
        <LeftController
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />
      </div>

      {/* Right Stage - Scrollable Content (with left margin to avoid nav) */}
      <div className="ml-[281px]">
        <RightStage activeSection={activeSection} />
      </div>
    </div>
  );
}
