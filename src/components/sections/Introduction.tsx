'use client';

import React from 'react';

export function Introduction() {
    return (
        <section id="services" className="relative z-10 bg-giant-white min-h-screen p-24 text-giant-charcoal">
            <div className="max-w-4xl mx-auto space-y-12">
                <header>
                    <h2 className="text-6xl font-bold italic uppercase tracking-tighter mb-4">
                        We Build<br />Giants
                    </h2>
                    <div className="h-1 w-32 bg-giant-red"></div>
                </header>

                <div className="text-2xl leading-relaxed space-y-8 font-light">
                    <p>
                        This is the point where the Giant lets go. After the initial handshake,
                        we step back and let the results speak for themselves.
                    </p>
                    <p>
                        Scroll further to explore our services, or click the navigation on the left
                        to jump between sections. The Giant scrubs through frames 1-87 and then
                        releases control here.
                    </p>
                </div>

                <div className="grid grid-cols-2 gap-8 mt-24">
                    <div className="h-64 bg-giant-sage/20 rounded-lg flex items-center justify-center border border-giant-sage">
                        <span className="italic">Service Block 01</span>
                    </div>
                    <div className="h-64 bg-giant-sage/20 rounded-lg flex items-center justify-center border border-giant-sage">
                        <span className="italic">Service Block 02</span>
                    </div>
                </div>

                <div id="work" className="h-[50vh]"></div>
                <div id="connect" className="h-[50vh]"></div>
            </div>
        </section>
    );
}
