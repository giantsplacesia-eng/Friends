'use client';

import React from 'react';
import { GiantHeroGSAP } from '@/components/canvas/GiantHeroGSAP';
import { IntegrativeAI } from '@/components/sections/IntegrativeAI';
import GeometricCycleSection from '@/components/sections/HowCanWeHelp_v3';
import { Introduction } from '@/components/sections/Introduction';

interface RightStageProps {
    activeSection: string;
}

export function RightStage({ activeSection }: RightStageProps) {
    return (
        <main className="w-full relative bg-giant-white min-h-screen">
            {/*
               CRITICAL: Do NOT put overflow-hidden or h-screen on this div
               Must allow GSAP to grow the container height with pin-spacer
            */}
            {activeSection === 'home' && (
                <div className="flex flex-col w-full relative">
                    {/* Giant Hero Animation */}
                    <GiantHeroGSAP />

                    {/* Blue gradient container for IntegrativeAI + HowCanWeHelp sections */}
                    <div
                        className="relative z-30 w-full"
                        style={{ background: 'linear-gradient(180deg, #0075A3 0%, #005580 100%)' }}
                    >
                        {/* NOISE/GRAIN LAYER - Applied to entire blue section */}
                        <div className="absolute inset-0 z-50 pointer-events-none opacity-[0.05] contrast-150 brightness-100"
                             style={{ backgroundImage: `url('https://assets.codepen.io/7558/noise-002.png')` }} />

                        <IntegrativeAI />
                        <GeometricCycleSection />
                    </div>

                    <div className="relative z-10 bg-giant-white min-h-screen w-full">
                        <Introduction />
                    </div>
                </div>
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
