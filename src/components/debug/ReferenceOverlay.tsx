'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export function ReferenceOverlay() {
    const [isVisible, setIsVisible] = useState(false);
    const [opacity, setOpacity] = useState(0.5);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Toggle with 'Shift + D' (Debug)
            if (e.shiftKey && e.key === 'D') {
                setIsVisible(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] pointer-events-none">
            <div className="relative w-full h-full">
                <Image
                    src="/Artboard 1.png"
                    alt="Design Reference"
                    fill
                    className="object-cover object-top"
                    style={{ opacity }}
                />
            </div>
            <div className="absolute bottom-4 right-4 bg-black/80 text-white p-2 text-xs rounded pointer-events-auto">
                <p>Reference Overlay (Shift+D to toggle)</p>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                />
            </div>
        </div>
    );
}
