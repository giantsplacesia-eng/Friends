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
const D = 104; // The spacing constant (30% bigger: 80 * 1.3 = 104)

export default function GeometricCycleSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sunRef = useRef<SVGPolygonElement>(null);
  const ringRefs = useRef<(SVGPolygonElement | null)[]>([]);

  // Generator for points (Circle, Square, Triangle, Hexagon)
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
        end: "+=800%",
        pin: true,
        scrub: 1,
        refreshPriority: -2, // Calculate AFTER GiantHeroGSAP (-1)
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
          // Lerp positions to center
          const curX = (960 + off.x * D) + (960 - (960 + off.x * D)) * p;
          const curY = (540 + off.y * D) + (540 - (540 + off.y * D)) * p;
          // Converge all to a single ring size (D*4)
          const curR = (D * 0.8) + (D * 4 - D * 0.8) * p;
          el.setAttribute("points", getPoints('circle', curR, curX, curY, p * 2));
          el.setAttribute("stroke-opacity", (0.3 - p * 0.2).toString()); // 12 lines fade slightly
          if (i === 0) el.setAttribute("stroke-opacity", "0.4"); // Keep 1 line strong
        });
        // Sun grows to presentation size
        if (sunRef.current) {
          const sunR = 40 + (D * 1.5 - 40) * p;
          sunRef.current.setAttribute("points", getPoints('circle', sunR, 960, 540));
        }
      }
    })
    // PAUSE at Circle presentation
    .to({}, { duration: 1 });

    // --- PHASE 2: CIRCLE TO SQUARE CYCLE ---
    // 1. Morph to small square + Mandala pulse
    tl.to({}, {
      duration: 2,
      onUpdate: function() {
        const p = this.progress();
        const bloom = Math.sin(p * Math.PI); // Pulse out and back

        ringRefs.current.forEach((el, i) => {
          if (!el) return;
          const angle = (i / SHAPE_COUNT) * Math.PI * 2;
          const dist = (bloom * 300); // Mandala spread
          const cx = 960 + Math.cos(angle) * dist;
          const cy = 540 + Math.sin(angle) * dist;

          // Interpolate Circle -> Square
          const start = getPoints('circle', D * 4, 960, 540);
          const end = getPoints('square', D * 2, cx, cy, p);
          el.setAttribute("points", gsap.utils.interpolate(start, end, p));
          el.setAttribute("stroke-opacity", (0.1 + bloom * 0.4).toString());
        });

        if (sunRef.current) {
          const sunStart = getPoints('circle', D * 1.5, 960, 540);
          const sunEnd = getPoints('square', D * 0.5, 960, 540); // Shrinks to small box
          sunRef.current.setAttribute("points", gsap.utils.interpolate(sunStart, sunEnd, p));
        }
      }
    })
    // 2. Expand back to Presentation Square
    .to({}, {
      duration: 1.5,
      onUpdate: function() {
        const p = this.progress();
        ringRefs.current.forEach((el, i) => {
          if (!el) return;
          // All converge to center as squares
          const start = getPoints('square', D * 2, 960, 540);
          const end = getPoints('square', D * 4, 960, 540);
          el.setAttribute("points", gsap.utils.interpolate(start, end, p));
          el.setAttribute("stroke-opacity", i === 0 ? "0.4" : (0.1 * (1-p)).toString());
        });
        if (sunRef.current) {
          const sunStart = getPoints('square', D * 0.5, 960, 540);
          const sunEnd = getPoints('square', D * 2, 960, 540); // Grows to Large Presentation Square
          sunRef.current.setAttribute("points", gsap.utils.interpolate(sunStart, sunEnd, p));
        }
      }
    })
    // PAUSE at Square presentation
    .to({}, { duration: 1 });

    // --- PHASE 3: SQUARE TO TRIANGLE CYCLE ---
    // 1. Morph to small triangle + Mandala pulse
    tl.to({}, {
      duration: 2,
      onUpdate: function() {
        const p = this.progress();
        const bloom = Math.sin(p * Math.PI); // Pulse out and back

        ringRefs.current.forEach((el, i) => {
          if (!el) return;
          const angle = (i / SHAPE_COUNT) * Math.PI * 2;
          const dist = (bloom * 300); // Mandala spread
          const cx = 960 + Math.cos(angle) * dist;
          const cy = 540 + Math.sin(angle) * dist;

          // Interpolate Square -> Triangle
          const start = getPoints('square', D * 4, 960, 540);
          const end = getPoints('triangle', D * 2, cx, cy, p);
          el.setAttribute("points", gsap.utils.interpolate(start, end, p));
          el.setAttribute("stroke-opacity", (0.1 + bloom * 0.4).toString());
        });

        if (sunRef.current) {
          const sunStart = getPoints('square', D * 2, 960, 540);
          const sunEnd = getPoints('triangle', D * 0.5, 960, 540); // Shrinks to small triangle
          sunRef.current.setAttribute("points", gsap.utils.interpolate(sunStart, sunEnd, p));
        }
      }
    })
    // 2. Expand back to Presentation Triangle
    .to({}, {
      duration: 1.5,
      onUpdate: function() {
        const p = this.progress();
        ringRefs.current.forEach((el, i) => {
          if (!el) return;
          // All converge to center as triangles
          const start = getPoints('triangle', D * 2, 960, 540);
          const end = getPoints('triangle', D * 4, 960, 540);
          el.setAttribute("points", gsap.utils.interpolate(start, end, p));
          el.setAttribute("stroke-opacity", i === 0 ? "0.4" : (0.1 * (1-p)).toString());
        });
        if (sunRef.current) {
          const sunStart = getPoints('triangle', D * 0.5, 960, 540);
          const sunEnd = getPoints('triangle', D * 2, 960, 540); // Grows to Large Presentation Triangle
          sunRef.current.setAttribute("points", gsap.utils.interpolate(sunStart, sunEnd, p));
        }
      }
    })
    // PAUSE at Triangle presentation
    .to({}, { duration: 1 });

    // --- PHASE 4: TRIANGLE TO HEXAGON CYCLE ---
    // 1. Morph to small hexagon + Mandala pulse
    tl.to({}, {
      duration: 2,
      onUpdate: function() {
        const p = this.progress();
        const bloom = Math.sin(p * Math.PI); // Pulse out and back

        ringRefs.current.forEach((el, i) => {
          if (!el) return;
          const angle = (i / SHAPE_COUNT) * Math.PI * 2;
          const dist = (bloom * 300); // Mandala spread
          const cx = 960 + Math.cos(angle) * dist;
          const cy = 540 + Math.sin(angle) * dist;

          // Interpolate Triangle -> Hexagon
          const start = getPoints('triangle', D * 4, 960, 540);
          const end = getPoints('hexagon', D * 2, cx, cy, p);
          el.setAttribute("points", gsap.utils.interpolate(start, end, p));
          el.setAttribute("stroke-opacity", (0.1 + bloom * 0.4).toString());
        });

        if (sunRef.current) {
          const sunStart = getPoints('triangle', D * 2, 960, 540);
          const sunEnd = getPoints('hexagon', D * 0.5, 960, 540); // Shrinks to small hexagon
          sunRef.current.setAttribute("points", gsap.utils.interpolate(sunStart, sunEnd, p));
        }
      }
    })
    // 2. Expand back to Presentation Hexagon
    .to({}, {
      duration: 1.5,
      onUpdate: function() {
        const p = this.progress();
        ringRefs.current.forEach((el, i) => {
          if (!el) return;
          // All converge to center as hexagons
          const start = getPoints('hexagon', D * 2, 960, 540);
          const end = getPoints('hexagon', D * 4, 960, 540);
          el.setAttribute("points", gsap.utils.interpolate(start, end, p));
          el.setAttribute("stroke-opacity", i === 0 ? "0.4" : (0.1 * (1-p)).toString());
        });
        if (sunRef.current) {
          const sunStart = getPoints('hexagon', D * 0.5, 960, 540);
          const sunEnd = getPoints('hexagon', D * 2, 960, 540); // Grows to Large Presentation Hexagon
          sunRef.current.setAttribute("points", gsap.utils.interpolate(sunStart, sunEnd, p));
        }
      }
    })
    // PAUSE at Hexagon presentation
    .to({}, { duration: 1 });

    // --- PHASE 5: HEXAGON BACK TO CIRCLE (LOOP) ---
    tl.to({}, {
      duration: 2,
      onUpdate: function() {
        const p = this.progress();

        ringRefs.current.forEach((el, i) => {
          if (!el) return;
          // Morph hexagon back to circle
          const start = getPoints('hexagon', D * 4, 960, 540);
          const end = getPoints('circle', D * 4, 960, 540);
          el.setAttribute("points", gsap.utils.interpolate(start, end, p));
          el.setAttribute("stroke-opacity", i === 0 ? "0.4" : "0.1");
        });

        if (sunRef.current) {
          const sunStart = getPoints('hexagon', D * 2, 960, 540);
          const sunEnd = getPoints('circle', D * 1.5, 960, 540); // Back to circle sun
          sunRef.current.setAttribute("points", gsap.utils.interpolate(sunStart, sunEnd, p));
        }
      }
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full overflow-hidden">
      {/* Texture & Noise */}
      <div className="absolute inset-0 z-50 pointer-events-none opacity-[0.06]"
           style={{ backgroundImage: `url('https://assets.codepen.io/7558/noise-002.png')` }} />

      <div className="relative h-screen flex items-center justify-center">
        <svg viewBox="0 0 1920 1080" className="w-full h-full">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <g filter="url(#glow)">
            {/* The 13 Outer Rings */}
            {[...Array(SHAPE_COUNT)].map((_, i) => (
              <polygon
                key={i}
                ref={(el) => (ringRefs.current[i] = el)}
                className="fill-none stroke-white pointer-events-none"
                strokeWidth="1"
              />
            ))}

            {/* The Central Sun */}
            <polygon
              ref={sunRef}
              className="fill-white stroke-none pointer-events-none shadow-2xl"
            />
          </g>
        </svg>

        {/* Central Shadow for the Sun to make it 'pop' */}
        <div className="absolute w-24 h-24 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

    </div>
  );
}
