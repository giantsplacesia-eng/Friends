"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const POINT_COUNT = 24;
const SHAPE_COUNT = 13;
const D = 104; // 30% bigger spacing

const clients = [
  "Nestlé", "Danone", "Kellogg's", "Diageo",
  "Johnson & Johnson", "Reckitt", "Coca-Cola",
  "FEMSA", "Mars", "Merck"
];

export default function GeometricVideoPortal() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<SVGPolygonElement>(null);
  const ringRefs = useRef<(SVGPolygonElement | null)[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const overlayContentRef = useRef<HTMLDivElement>(null);

  // Helper for points (Circle, Square, Triangle, Hexagon)
  const getPoints = (type: string, r: number, cx: number, cy: number, rot = 0) => {
    let pts = [];
    for (let i = 0; i < POINT_COUNT; i++) {
      let angle = (i / POINT_COUNT) * Math.PI * 2 + rot;
      if (type === "hexagon") {
        const sector = Math.floor(i / (POINT_COUNT / 6));
        angle = (sector / 6) * Math.PI * 2 + rot;
      } else if (type === "triangle") {
        const sector = Math.floor(i / (POINT_COUNT / 3));
        angle = (sector / 3) * Math.PI * 2 + rot;
      } else if (type === "square") {
        const sector = Math.floor(i / (POINT_COUNT / 4));
        angle = (sector / 4) * Math.PI * 2 + Math.PI / 4 + rot;
      }
      pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
    }
    return pts.join(" ");
  };

  useGSAP(() => {
    if (!containerRef.current) return;

    // Verified Initial Scattered Positions
    const offsets = [
      {x: -3, y: 0}, {x: 3, y: 0}, {x: 0, y: -3}, {x: 0, y: 3},
      {x: -2, y: -2}, {x: 2, y: -2}, {x: -2, y: 2}, {x: 2, y: 2},
      {x: -4, y: 0}, {x: 4, y: 0}, {x: 0, y: -4}, {x: 0, y: 4}, {x: 0, y: 0}
    ];

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=1100%", // Extended for all phases including portal
        pin: true,
        pinSpacing: true,
        scrub: 1,
        refreshPriority: -2, // Calculate AFTER GiantHeroGSAP (-1)
        markers: true,
      },
    });

    // --- PHASE 1: INTRO (Scattered Circles -> Converge to Presentation Circle) ---
    tl.to({}, {
      duration: 2,
      onUpdate: function() {
        const p = this.progress();
        ringRefs.current.forEach((el, i) => {
          if (!el) return;
          const off = offsets[i];
          const curX = (960 + off.x * D) + (960 - (960 + off.x * D)) * p;
          const curY = (540 + off.y * D) + (540 - (540 + off.y * D)) * p;
          const curR = (D * 0.8) + (D * 4 - D * 0.8) * p;
          el.setAttribute("points", getPoints('circle', curR, curX, curY, p * 2));
          el.setAttribute("stroke-opacity", (0.3 - p * 0.2).toString());
          if (i === 0) el.setAttribute("stroke-opacity", "0.4");
        });
        if (sunRef.current) {
          const sunR = 40 + (D * 1.5 - 40) * p;
          sunRef.current.setAttribute("points", getPoints('circle', sunR, 960, 540));
        }
      }
    })
    .to({}, { duration: 1 }); // PAUSE at Circle presentation

    // --- PHASE 2: CIRCLE TO SQUARE CYCLE ---
    tl.to({}, {
      duration: 2,
      onUpdate: function() {
        const p = this.progress();
        const bloom = Math.sin(p * Math.PI);
        ringRefs.current.forEach((el, i) => {
          if (!el) return;
          const angle = (i / SHAPE_COUNT) * Math.PI * 2;
          const dist = (bloom * 300);
          const cx = 960 + Math.cos(angle) * dist;
          const cy = 540 + Math.sin(angle) * dist;
          const start = getPoints('circle', D * 4, 960, 540);
          const end = getPoints('square', D * 2, cx, cy, p);
          el.setAttribute("points", gsap.utils.interpolate(start, end, p));
          el.setAttribute("stroke-opacity", (0.1 + bloom * 0.4).toString());
        });
        if (sunRef.current) {
          const sunStart = getPoints('circle', D * 1.5, 960, 540);
          const sunEnd = getPoints('square', D * 0.5, 960, 540);
          sunRef.current.setAttribute("points", gsap.utils.interpolate(sunStart, sunEnd, p));
        }
      }
    })
    .to({}, {
      duration: 1.5,
      onUpdate: function() {
        const p = this.progress();
        ringRefs.current.forEach((el, i) => {
          if (!el) return;
          const start = getPoints('square', D * 2, 960, 540);
          const end = getPoints('square', D * 4, 960, 540);
          el.setAttribute("points", gsap.utils.interpolate(start, end, p));
          el.setAttribute("stroke-opacity", i === 0 ? "0.4" : (0.1 * (1-p)).toString());
        });
        if (sunRef.current) {
          const sunStart = getPoints('square', D * 0.5, 960, 540);
          const sunEnd = getPoints('square', D * 2, 960, 540);
          sunRef.current.setAttribute("points", gsap.utils.interpolate(sunStart, sunEnd, p));
        }
      }
    })
    .to({}, { duration: 1 }); // PAUSE at Square presentation

    // --- PHASE 3: SQUARE TO TRIANGLE CYCLE ---
    tl.to({}, {
      duration: 2,
      onUpdate: function() {
        const p = this.progress();
        const bloom = Math.sin(p * Math.PI);
        ringRefs.current.forEach((el, i) => {
          if (!el) return;
          const angle = (i / SHAPE_COUNT) * Math.PI * 2;
          const dist = (bloom * 300);
          const cx = 960 + Math.cos(angle) * dist;
          const cy = 540 + Math.sin(angle) * dist;
          const start = getPoints('square', D * 4, 960, 540);
          const end = getPoints('triangle', D * 2, cx, cy, p);
          el.setAttribute("points", gsap.utils.interpolate(start, end, p));
          el.setAttribute("stroke-opacity", (0.1 + bloom * 0.4).toString());
        });
        if (sunRef.current) {
          const sunStart = getPoints('square', D * 2, 960, 540);
          const sunEnd = getPoints('triangle', D * 0.5, 960, 540);
          sunRef.current.setAttribute("points", gsap.utils.interpolate(sunStart, sunEnd, p));
        }
      }
    })
    .to({}, {
      duration: 1.5,
      onUpdate: function() {
        const p = this.progress();
        ringRefs.current.forEach((el, i) => {
          if (!el) return;
          const start = getPoints('triangle', D * 2, 960, 540);
          const end = getPoints('triangle', D * 4, 960, 540);
          el.setAttribute("points", gsap.utils.interpolate(start, end, p));
          el.setAttribute("stroke-opacity", i === 0 ? "0.4" : (0.1 * (1-p)).toString());
        });
        if (sunRef.current) {
          const sunStart = getPoints('triangle', D * 0.5, 960, 540);
          const sunEnd = getPoints('triangle', D * 2, 960, 540);
          sunRef.current.setAttribute("points", gsap.utils.interpolate(sunStart, sunEnd, p));
        }
      }
    })
    .to({}, { duration: 1 }); // PAUSE at Triangle presentation

    // --- PHASE 4: TRIANGLE TO HEXAGON CYCLE ---
    tl.to({}, {
      duration: 2,
      onUpdate: function() {
        const p = this.progress();
        const bloom = Math.sin(p * Math.PI);
        ringRefs.current.forEach((el, i) => {
          if (!el) return;
          const angle = (i / SHAPE_COUNT) * Math.PI * 2;
          const dist = (bloom * 300);
          const cx = 960 + Math.cos(angle) * dist;
          const cy = 540 + Math.sin(angle) * dist;
          const start = getPoints('triangle', D * 4, 960, 540);
          const end = getPoints('hexagon', D * 2, cx, cy, p);
          el.setAttribute("points", gsap.utils.interpolate(start, end, p));
          el.setAttribute("stroke-opacity", (0.1 + bloom * 0.4).toString());
        });
        if (sunRef.current) {
          const sunStart = getPoints('triangle', D * 2, 960, 540);
          const sunEnd = getPoints('hexagon', D * 0.5, 960, 540);
          sunRef.current.setAttribute("points", gsap.utils.interpolate(sunStart, sunEnd, p));
        }
      }
    })
    .to({}, {
      duration: 1.5,
      onUpdate: function() {
        const p = this.progress();
        ringRefs.current.forEach((el, i) => {
          if (!el) return;
          const start = getPoints('hexagon', D * 2, 960, 540);
          const end = getPoints('hexagon', D * 4, 960, 540);
          el.setAttribute("points", gsap.utils.interpolate(start, end, p));
          el.setAttribute("stroke-opacity", i === 0 ? "0.4" : (0.1 * (1-p)).toString());
        });
        if (sunRef.current) {
          const sunStart = getPoints('hexagon', D * 0.5, 960, 540);
          const sunEnd = getPoints('hexagon', D * 2, 960, 540);
          sunRef.current.setAttribute("points", gsap.utils.interpolate(sunStart, sunEnd, p));
        }
      }
    })
    .to({}, { duration: 1 }); // PAUSE at Hexagon presentation

    // --- PHASE 5: HEXAGON BACK TO CIRCLE (Setup for Portal) ---
    tl.to({}, {
      duration: 2,
      onUpdate: function() {
        const p = this.progress();
        ringRefs.current.forEach((el, i) => {
          if (!el) return;
          const start = getPoints('hexagon', D * 4, 960, 540);
          const end = getPoints('circle', D * 4, 960, 540);
          el.setAttribute("points", gsap.utils.interpolate(start, end, p));
          el.setAttribute("stroke-opacity", i === 0 ? "0.4" : "0.1");
        });
        if (sunRef.current) {
          const sunStart = getPoints('hexagon', D * 2, 960, 540);
          const sunEnd = getPoints('circle', D * 1.5, 960, 540);
          sunRef.current.setAttribute("points", gsap.utils.interpolate(sunStart, sunEnd, p));
          sunRef.current.setAttribute("fill-opacity", "1"); // Ensure full opacity at end
        }
      }
    })
    .to({}, { duration: 1 }); // PAUSE at final Circle

    // --- PHASE 6: THE PORTAL TRANSITION (Radial Fade - Circle stays same size) ---
    tl.addLabel("portalStart");

    // Radial fade: Circle fades first (fastest), then outer rings, then background reveals
    tl.to({}, {
      duration: 2,
      onUpdate: function() {
        const p = this.progress();
        if (sunRef.current) {
          // Keep circle at D*1.5 size (NO expansion) - PERFECT CIRCLE
          const perfectCircle = getPoints('circle', D * 1.5, 960, 540, 0);
          sunRef.current.setAttribute("points", perfectCircle);
          // Fade out FAST (circle disappears first - radial center)
          const circleFade = Math.pow(1 - p, 0.5); // Exponential fade (faster)
          sunRef.current.setAttribute("fill-opacity", circleFade.toString());
        }
        // Fade outer rings slower (radial outer edge)
        ringRefs.current.forEach(el => {
          if (el) {
            const ringFade = Math.pow(1 - p, 1.5); // Slower fade (lags behind center)
            el.setAttribute("stroke-opacity", (0.1 * ringFade).toString());
          }
        });
      }
    }, "portalStart");

    // Start video fade AFTER circle starts fading (background comes in last)
    tl.to(videoRef.current, {
      opacity: 0.6,
      duration: 2.5,
      ease: "power2.inOut"
    }, "portalStart+=0.5"); // Delay video fade by 0.5s

    // Subtle video scale for depth
    tl.to(videoRef.current, {
      scale: 1.15,
      duration: 3,
      ease: "none"
    }, "portalStart");

    // --- PHASE 7: DARK DRAWER SLIDES IN ---
    tl.fromTo(
      overlayRef.current,
      { xPercent: 100 },
      { xPercent: 0, duration: 1.5, ease: "power2.out" }
    );

    // Stagger client names in
    tl.fromTo(
      ".client-row",
      { opacity: 0, x: 40 },
      { opacity: 1, x: 0, stagger: 0.08, duration: 1, ease: "power2.out" },
      "-=0.6"
    );

    // Fade in overlay content
    tl.fromTo(
      overlayContentRef.current,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
      "-=0.8"
    );

  }, { scope: containerRef });

  return (
    <section
      ref={containerRef}
      className="relative w-full h-screen"
      style={{ background: 'linear-gradient(180deg, #005580 0%, #000000 100%)' }}
    >

      {/* LAYER 1: Background Video (Hidden initially, revealed through portal) */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-0"
      >
        <source src="/videos/Background-video.mp4.mp4" type="video/mp4" />
      </video>

      {/* LAYER 2: SVG Geometry (Portal effect) */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <svg viewBox="0 0 1920 1080" className="w-full h-full">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <g filter="url(#glow)">
            {/* Outer Rings */}
            {[...Array(SHAPE_COUNT)].map((_, i) => (
              <polygon
                key={i}
                ref={(el) => (ringRefs.current[i] = el)}
                className="fill-none stroke-white"
                strokeWidth="1"
              />
            ))}
            {/* Central Sun (Portal center) */}
            <polygon
              ref={sunRef}
              className="fill-white stroke-none"
              fillOpacity="1"
            />
          </g>
        </svg>

        {/* Central Shadow for Sun depth */}
        <div className="absolute w-24 h-24 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* LAYER 3: Dark Sliding Panel (Slides in from right after portal) */}
      <div
        ref={overlayRef}
        className="absolute top-0 right-0 h-full w-full md:w-[45%] lg:w-[38%]
                   bg-zinc-950/80 backdrop-blur-2xl border-l border-white/10
                   z-20 flex flex-col p-10 md:p-16 lg:p-20 text-white shadow-2xl"
      >
        {/* Section Header */}
        <div ref={overlayContentRef}>
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

        {/* Footer */}
        <div className="mt-auto pt-10 text-[9px] tracking-[0.3em] uppercase opacity-30">
          Global Strategy // 2024
        </div>
      </div>

      {/* Texture Overlay */}
      <div
        className="absolute inset-0 z-30 pointer-events-none opacity-[0.06]"
        style={{ backgroundImage: `url('https://assets.codepen.io/7558/noise-002.png')` }}
      />
    </section>
  );
}
