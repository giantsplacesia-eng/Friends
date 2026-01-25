"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const clients = [
  "Nestlé", "Danone", "Kellogg's", "Diageo",
  "Johnson & Johnson", "Reckitt", "Coca-Cola",
  "FEMSA", "Mars", "Merck"
];

export default function DarkDrawerSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  useGSAP(() => {
    if (!containerRef.current || !panelRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=300%", // Extended scroll length to pin section longer
        pin: true,
        pinSpacing: true, // CRITICAL: Create spacer to push content below
        scrub: 1,
        anticipatePin: 1,
        refreshPriority: -3, // Calculate AFTER GiantHeroGSAP (-1) and GeometricCycleSection (-2)
        markers: true, // DEBUG: Show scroll markers
        onEnter: () => console.log("🎬 Video section ENTERED - should be pinning now"),
        onLeave: () => console.log("🎬 Video section LEFT - unpinning"),
        onUpdate: (self) => console.log("🎬 Video progress:", self.progress.toFixed(2)),
      },
    });

    // Phase 1: Video visible, page locked (pause before panel starts)
    tl.to({}, { duration: 0.8 }); // Hold video in view

    // Phase 2: Slide Panel in from the RIGHT (xPercent 100 to 0)
    tl.fromTo(
      panelRef.current,
      { xPercent: 100 },
      { xPercent: 0, ease: "power2.out", duration: 1.5 }
    );

    // Phase 3: Staggered reveal of the client names
    tl.fromTo(
      ".client-row",
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, stagger: 0.08, duration: 1, ease: "power2.out" },
      "-=0.6" // Start while panel is still sliding
    );

    // Subtle Video Scale (runs throughout entire timeline)
    tl.to(videoRef.current, { scale: 1.15, duration: 3, ease: "none" }, 0);

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative w-full h-screen bg-black">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      >
        <source src="/videos/pexels-maksim-makarov-11417056 (1080p).mp4" type="video/mp4" />
      </video>

      {/* DARK SLIDING PANEL */}
      <div
        ref={panelRef}
        className="absolute top-0 right-0 h-full w-full md:w-[45%] lg:w-[38%]
                   bg-zinc-950/80 backdrop-blur-2xl border-l border-white/10
                   z-10 flex flex-col p-10 md:p-16 lg:p-20 text-white shadow-2xl"
      >
        {/* Section Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-2 bg-white" />
            <span className="text-[10px] tracking-[0.4em] uppercase opacity-50 font-medium">
              Our Clients
            </span>
          </div>

          <h2 className="text-3xl md:text-4xl font-light leading-snug mb-8">
            Our AI-powered solutions address critical pain points that global brands face today.
          </h2>
        </div>

        {/* Dynamic Client List */}
        <div className="flex-1">
          <div className="flex flex-col border-t border-white/10">
            {clients.map((client, i) => (
              <div
                key={i}
                className="client-row group flex justify-between items-center py-5 border-b border-white/5 hover:bg-white/[0.03] transition-colors cursor-pointer"
              >
                <span className="text-sm font-light tracking-[0.2em] uppercase opacity-40 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-2">
                  {client}
                </span>
                <div className="w-1 h-1 bg-white/20 group-hover:bg-white group-hover:scale-150 transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Footer info inside panel */}
        <div className="mt-auto pt-10 text-[9px] tracking-[0.3em] uppercase opacity-30">
          Global Strategy // 2024
        </div>
      </div>

      {/* Overlay Texture (The Noise) */}
      <div
        className="absolute inset-0 z-20 pointer-events-none opacity-[0.05] mix-blend-screen"
        style={{ backgroundImage: `url('https://assets.codepen.io/7558/noise-002.png')` }}
      />
    </section>
  );
}
