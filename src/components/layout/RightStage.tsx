'use client';

import React from 'react';
import { GiantHeroGSAP } from '@/components/canvas/GiantHeroGSAP';
import { Introduction } from '@/components/sections/Introduction';

interface RightStageProps {
    activeSection: string;
}

export function RightStage({ activeSection }: RightStageProps) {
    return (
        <main
            id="right-stage-scroll"
            className="w-full relative bg-giant-white"
        >
            {activeSection === 'home' && (
                <>
                    {/* Giant Hero - Apple-style GSAP ScrollTrigger */}
                    <GiantHeroGSAP />

                    {/* Introduction section - appears after Giant animation completes */}
                    <div className="relative z-10 bg-giant-white">
                        <Introduction />
                    </div>
                </>
            )}

            {activeSection === 'about' && (
                <div className="min-h-screen p-24 bg-giant-charcoal text-giant-white animate-in slide-in-from-right duration-700">
                    <h1 className="text-8xl italic font-bold uppercase mb-8">About Us</h1>
                    <p className="text-2xl max-w-2xl font-light">
                        We are a collection of heavyweights. Industrial-grade creators building
                        the future of agency work.
                    </p>
                </div>
            )}

            {activeSection === 'services' && (
                <div className="min-h-screen p-24 bg-giant-white text-giant-charcoal animate-in slide-in-from-right duration-700">
                    <h1 className="text-8xl italic font-bold uppercase mb-8 text-giant-red">Services</h1>
                    <div className="grid grid-cols-2 gap-8">
                        <div className="p-12 border border-giant-charcoal rounded-lg hover:bg-giant-sage transition-colors">
                            <h3 className="text-2xl font-bold mb-4">AI Integration</h3>
                        </div>
                        <div className="p-12 border border-giant-charcoal rounded-lg hover:bg-giant-sage transition-colors">
                            <h3 className="text-2xl font-bold mb-4">Brand Systems</h3>
                        </div>
                    </div>
                </div>
            )}

            {/* Other sections... */}
        </main>
    );
}
