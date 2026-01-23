'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { GiantHeroGSAP } from '@/components/canvas/GiantHeroGSAP';
import { Introduction } from '@/components/sections/Introduction';

interface NavItem {
    id: string;
    label: string;
}

const navItems: NavItem[] = [
    { id: 'home', label: 'Home' },
    { id: 'about', label: 'About' },
    { id: 'services', label: 'Services' },
    { id: 'work', label: 'Work' },
    { id: 'process', label: 'Process' },
    { id: 'insights', label: 'Insights' },
    { id: 'careers', label: 'Careers' },
    { id: 'connect', label: 'Connect' },
];

export function MobileAccordionLayout() {
    // "Home" is open by default
    const [openSection, setOpenSection] = useState<string | null>('home');

    const toggleSection = (id: string) => {
        setOpenSection(current => current === id ? null : id);
    };

    return (
        <div className="md:hidden min-h-screen bg-giant-sage flex flex-col">
            {/* Sticky Mobile Header / Logo - stays at top */}
            <div className="sticky top-0 z-50 bg-giant-sage px-6 pt-6 pb-2 flex justify-between items-center shadow-sm">
                <div className="relative w-[80px] h-auto">
                    <Image
                        src="/logo svgs/FWGlogo.svg"
                        alt="Friends with Giants"
                        width={120}
                        height={120}
                        className="w-full h-auto"
                        priority
                    />
                </div>
                <div className="text-xs font-bold uppercase tracking-widest text-giant-charcoal opacity-60">
                    Menu
                </div>
            </div>

            {/* Vertical Stack Navigation */}
            <div className="flex flex-col w-full px-6 pb-12 gap-4">
                {navItems.map((item) => {
                    const isOpen = openSection === item.id;

                    return (
                        <div key={item.id} className="w-full">
                            {/* Accordion Trigger (The Pill/Button) */}
                            <button
                                onClick={() => toggleSection(item.id)}
                                className={cn(
                                    "block w-full rounded-md text-center transition-all duration-300",
                                    "italic uppercase tracking-[0.08em] font-medium text-sm",
                                    "flex items-center justify-between px-6", // Align text left/right for mobile accordion feel
                                    isOpen
                                        ? "bg-giant-red text-giant-orange text-[24px] h-[80px] font-bold leading-none shadow-lg"
                                        : "bg-giant-charcoal text-giant-orange h-[50px] hover:bg-opacity-90 hover:shadow-md"
                                )}
                            >
                                <span>{item.label}</span>

                                {/* Plus/Minus Indicator */}
                                <span className="text-xl font-light opacity-80">
                                    {isOpen ? '—' : '+'}
                                </span>
                            </button>

                            {/* Accordion Content Panel */}
                            <div className={cn(
                                "overflow-hidden transition-all duration-500 ease-in-out bg-giant-white rounded-b-md mx-2", // Inset slightly to look like it comes from the pill
                                isOpen ? "max-h-[300vh] opacity-100 shadow-xl" : "max-h-0 opacity-0"
                            )}>
                                {/* CONTENT SLOTS */}

                                {/* HOME / GIANT SLOT */}
                                {item.id === 'home' && (
                                    <div className="relative w-full h-[60vh] bg-giant-white">
                                        <div className="absolute inset-0 overflow-hidden">
                                            <GiantHeroGSAP mobile={true} />
                                        </div>
                                        <div className="absolute bottom-0 w-full p-6 bg-white/90 backdrop-blur-sm z-10 border-t border-black/5">
                                            <h2 className="text-lg font-bold uppercase mb-1">The Site IS the Product.</h2>
                                            <p className="text-xs text-giant-charcoal/80">Welcome to the new standard.</p>
                                        </div>
                                    </div>
                                )}

                                {/* SERVICES SLOT */}
                                {item.id === 'services' && (
                                    <div className="p-6">
                                        <h3 className="text-3xl italic font-bold uppercase mb-4 text-giant-red">Services</h3>
                                        <ul className="space-y-3 text-sm font-medium">
                                            <li className="p-3 border border-black/10 rounded bg-giant-sage/20">AI Integration Strategy</li>
                                            <li className="p-3 border border-black/10 rounded bg-giant-sage/20">Brand Systems</li>
                                            <li className="p-3 border border-black/10 rounded bg-giant-sage/20">Web Experience</li>
                                        </ul>
                                    </div>
                                )}

                                {/* ABOUT SLOT */}
                                {item.id === 'about' && (
                                    <div className="p-6 bg-giant-charcoal text-giant-white">
                                        <h3 className="text-3xl italic font-bold uppercase mb-4">About</h3>
                                        <p className="leading-relaxed text-sm opacity-90">
                                            We are a collective of heavyweights building industrial-grade digital products.
                                        </p>
                                    </div>
                                )}

                                {/* GENERIC SLOT */}
                                {['work', 'process', 'insights', 'careers', 'connect'].includes(item.id) && (
                                    <div className="p-8 text-center text-giant-charcoal/50 italic text-sm">
                                        Content coming soon for {item.label}...
                                    </div>
                                )}

                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
