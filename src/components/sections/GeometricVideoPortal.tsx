"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CreatureSpritePlayer, CreatureSpriteHandle } from "@/components/animations/CreatureSpritePlayer";
import { BenefitContentCard, BenefitCardHandle, benefits } from "@/components/sections/BenefitContentCard";

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

  // Creature sprite refs
  const pufferfishRef = useRef<CreatureSpriteHandle>(null);
  const chameleonRef = useRef<CreatureSpriteHandle>(null);
  const aifishRef = useRef<CreatureSpriteHandle>(null);
  const octopusRef = useRef<CreatureSpriteHandle>(null);

  // Benefit card refs
  const circleCardRef = useRef<BenefitCardHandle>(null);
  const squareCardRef = useRef<BenefitCardHandle>(null);
  const triangleCardRef = useRef<BenefitCardHandle>(null);
  const hexagonCardRef = useRef<BenefitCardHandle>(null);

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
        end: "+=1200%", // Extended for all phases including portal + creature animations
        pin: true,
        pinSpacing: true,
        scrub: 1,
        refreshPriority: -2, // Calculate AFTER GiantHeroGSAP (-1)
        markers: false,
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
    });

    // --- CIRCLE PRESENTATION: Pufferfish + Business Growth ---
    tl.addLabel("circlePresentation");

    // Fade in pufferfish
    tl.to('.creature-pufferfish', {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.inOut'
    }, "circlePresentation");

    // Scrub pufferfish animation (2.5s for 38 frames)
    if (pufferfishRef.current) {
      tl.to(pufferfishRef.current.animationProxy, {
        frame: 37,
        ease: 'none',
        duration: 2.5,
        onUpdate: () => pufferfishRef.current?.render()
      }, "circlePresentation+=0.2");
    }

    // Fade in benefit card container
    tl.to('.benefit-circle', {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.inOut'
    }, "circlePresentation+=0.5");

    // Letter-by-letter title reveal (using direct class selectors)
    tl.to('.benefit-circle-char', {
      opacity: 1,
      y: 0,
      stagger: 0.03,
      duration: 0.4,
      ease: 'power2.out'
    }, "circlePresentation+=0.8");

    // Fade in description
    tl.to('.benefit-circle-description', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, "circlePresentation+=1.5");

    // Fade in button
    tl.to('.benefit-circle-button', {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: 'back.out(1.7)'
    }, "circlePresentation+=2");

    // Hold for interaction
    tl.to({}, { duration: 0.5 });

    // Fade out everything
    tl.to('.benefit-circle, .creature-pufferfish', {
      opacity: 0,
      duration: 0.5
    });

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
    });

    // --- SQUARE PRESENTATION: Chameleon + Brand Evolution ---
    tl.addLabel("squarePresentation");

    // Fade in chameleon
    tl.to('.creature-chameleon', {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.inOut'
    }, "squarePresentation");

    // Scrub chameleon animation (2.5s for 38 frames)
    if (chameleonRef.current) {
      tl.to(chameleonRef.current.animationProxy, {
        frame: 37,
        ease: 'none',
        duration: 2.5,
        onUpdate: () => chameleonRef.current?.render()
      }, "squarePresentation+=0.2");
    }

    // Fade in benefit card container
    tl.to('.benefit-square', {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.inOut'
    }, "squarePresentation+=0.5");

    // Letter-by-letter title reveal (using direct class selectors)
    tl.to('.benefit-square-char', {
      opacity: 1,
      y: 0,
      stagger: 0.03,
      duration: 0.4,
      ease: 'power2.out'
    }, "squarePresentation+=0.8");

    // Fade in description
    tl.to('.benefit-square-description', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, "squarePresentation+=1.5");

    // Fade in button
    tl.to('.benefit-square-button', {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: 'back.out(1.7)'
    }, "squarePresentation+=2");

    // Hold for interaction
    tl.to({}, { duration: 0.5 });

    // Fade out everything
    tl.to('.benefit-square, .creature-chameleon', {
      opacity: 0,
      duration: 0.5
    });

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
    });

    // --- TRIANGLE PRESENTATION: AI Fish + AI Implementation ---
    tl.addLabel("trianglePresentation");

    // Fade in AI fish
    tl.to('.creature-aifish', {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.inOut'
    }, "trianglePresentation");

    // Scrub AI fish animation (2.5s for 38 frames)
    if (aifishRef.current) {
      tl.to(aifishRef.current.animationProxy, {
        frame: 37,
        ease: 'none',
        duration: 2.5,
        onUpdate: () => aifishRef.current?.render()
      }, "trianglePresentation+=0.2");
    }

    // Fade in benefit card container
    tl.to('.benefit-triangle', {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.inOut'
    }, "trianglePresentation+=0.5");

    // Letter-by-letter title reveal (using direct class selectors)
    tl.to('.benefit-triangle-char', {
      opacity: 1,
      y: 0,
      stagger: 0.03,
      duration: 0.4,
      ease: 'power2.out'
    }, "trianglePresentation+=0.8");

    // Fade in description
    tl.to('.benefit-triangle-description', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, "trianglePresentation+=1.5");

    // Fade in button
    tl.to('.benefit-triangle-button', {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: 'back.out(1.7)'
    }, "trianglePresentation+=2");

    // Hold for interaction
    tl.to({}, { duration: 0.5 });

    // Fade out everything
    tl.to('.benefit-triangle, .creature-aifish', {
      opacity: 0,
      duration: 0.5
    });

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
    });

    // --- HEXAGON PRESENTATION: Octopus + Strategic Roadmap ---
    tl.addLabel("hexagonPresentation");

    // Fade in octopus
    tl.to('.creature-octopus', {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.inOut'
    }, "hexagonPresentation");

    // Scrub octopus animation (2.5s for 38 frames)
    if (octopusRef.current) {
      tl.to(octopusRef.current.animationProxy, {
        frame: 37,
        ease: 'none',
        duration: 2.5,
        onUpdate: () => octopusRef.current?.render()
      }, "hexagonPresentation+=0.2");
    }

    // Fade in benefit card container
    tl.to('.benefit-hexagon', {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.inOut'
    }, "hexagonPresentation+=0.5");

    // Letter-by-letter title reveal (using direct class selectors)
    tl.to('.benefit-hexagon-char', {
      opacity: 1,
      y: 0,
      stagger: 0.03,
      duration: 0.4,
      ease: 'power2.out'
    }, "hexagonPresentation+=0.8");

    // Fade in description
    tl.to('.benefit-hexagon-description', {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'power2.out'
    }, "hexagonPresentation+=1.5");

    // Fade in button
    tl.to('.benefit-hexagon-button', {
      opacity: 1,
      scale: 1,
      duration: 0.4,
      ease: 'back.out(1.7)'
    }, "hexagonPresentation+=2");

    // Hold for interaction
    tl.to({}, { duration: 0.5 });

    // Fade out everything
    tl.to('.benefit-hexagon, .creature-octopus', {
      opacity: 0,
      duration: 0.5
    });

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

    // Start video playback at beginning of portal transition
    tl.call(() => {
      if (videoRef.current) {
        videoRef.current.currentTime = 0; // Reset to start
        videoRef.current.play().catch(e => console.log('Video play failed:', e));
      }
    }, [], "portalStart");

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
      opacity: 1.0,
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
      className="relative w-full h-screen bg-giant-charcoal"
    >

      {/* LAYER 1: Background Video (Hidden initially, revealed through portal) */}
      <video
        ref={videoRef}
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full opacity-0"
        style={{ objectFit: 'contain', objectPosition: 'center' }}
      >
        <source src="/videos/Homepage_video.mp4" type="video/mp4" />
      </video>

      {/* LAYER 2: SVG Geometry (Portal effect) */}
      <div className="absolute inset-0 z-5 flex items-center justify-center">
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
                className="fill-none stroke-giant-orange"
                strokeWidth="1"
              />
            ))}
            {/* Central Sun (Portal center) */}
            <polygon
              ref={sunRef}
              className="fill-giant-red stroke-none"
              fillOpacity="1"
            />
          </g>
        </svg>

        {/* Central Shadow for Sun depth */}
        <div className="absolute w-24 h-24 bg-giant-red/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* LAYER 2.5: Creature Sprites (Scroll-scrubbed animations) */}
      <CreatureSpritePlayer
        ref={pufferfishRef}
        creature="pufferfish"
        className="creature-pufferfish"
      />
      <CreatureSpritePlayer
        ref={chameleonRef}
        creature="chameleon"
        className="creature-chameleon"
      />
      <CreatureSpritePlayer
        ref={aifishRef}
        creature="aifish"
        className="creature-aifish"
      />
      <CreatureSpritePlayer
        ref={octopusRef}
        creature="octopus"
        className="creature-octopus"
      />

      {/* LAYER 2.75: Benefit Content Cards (Text overlays) */}
      <BenefitContentCard
        ref={circleCardRef}
        benefit={benefits[0]}
      />
      <BenefitContentCard
        ref={squareCardRef}
        benefit={benefits[1]}
      />
      <BenefitContentCard
        ref={triangleCardRef}
        benefit={benefits[2]}
      />
      <BenefitContentCard
        ref={hexagonCardRef}
        benefit={benefits[3]}
      />

      {/* LAYER 3: Yellow Sliding Panel (Slides in from right after portal) */}
      <div
        ref={overlayRef}
        className="absolute top-0 right-0 h-full w-full md:w-[45%] lg:w-[38%]
                   bg-giant-orange backdrop-blur-2xl border-l border-white/10
                   z-20 flex flex-col p-10 md:p-16 lg:p-20 text-giant-charcoal shadow-2xl"
      >
        {/* Section Header */}
        <div ref={overlayContentRef}>
          <div className="flex items-center gap-3 mb-8">
            <div className="w-2 h-2 bg-giant-charcoal" />
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
          <div className="flex flex-col border-t border-giant-charcoal/20">
            {clients.map((client, i) => (
              <div
                key={i}
                className="client-row group flex justify-between items-center py-5 border-b border-giant-charcoal/10 hover:bg-giant-charcoal/5 transition-colors cursor-pointer"
              >
                <span className="text-sm font-light tracking-[0.2em] uppercase opacity-60 group-hover:opacity-100 transition-all duration-500 group-hover:translate-x-2">
                  {client}
                </span>
                <div className="w-1 h-1 bg-giant-charcoal/30 group-hover:bg-giant-charcoal group-hover:scale-150 transition-all duration-500" />
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-auto pt-10 text-[9px] tracking-[0.3em] uppercase opacity-40">
          Global Strategy // 2024
        </div>
      </div>
    </section>
  );
}
