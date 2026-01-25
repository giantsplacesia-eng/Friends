'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap-register';
import { HeroSection } from '@/components/sections/HeroSection';

export function GiantHeroGSAP() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadingStatus, setLoadingStatus] = useState("Loading...");
  
  const animationProxy = useRef({ frame: 0 });

  const render = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context || images.length === 0) return;

    const frameIndex = Math.round(animationProxy.current.frame);
    const img = images[frameIndex];
    if (!img || !img.complete) return;

    context.clearRect(0, 0, canvas.width, canvas.height);
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);
    const centerX = canvas.width - (img.width * ratio);
    const centerY = (canvas.height - img.height * ratio) / 2;

    context.drawImage(
      img, 0, 0, img.width, img.height,
      centerX, centerY, img.width * ratio, img.height * ratio
    );
  };

  // Frame Loading Logic (Keep your existing useEffect for loading images here)
  useEffect(() => {
    const frameCount = 88;
    const loadedImages: HTMLImageElement[] = [];
    let loadCount = 0;
    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      img.src = `/giant-frames/Sequence 01_${100 + i}.webp`;
      img.onload = () => {
        loadCount++;
        if (loadCount === frameCount) {
          setImages(loadedImages);
          setLoadingStatus("Done");

          // CRITICAL "Handshake": Wait for DOM to settle after pinning
          // 500ms delay allows pin-spacer to fully calculate before other ScrollTriggers measure
          setTimeout(() => {
            ScrollTrigger.refresh();
            console.log('🤝 Handshake complete - All ScrollTriggers refreshed after Hero pin');
          }, 500);
        }
      };
      loadedImages.push(img);
    }
  }, []);

  // Resize Logic
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        // Use clientWidth to respect the sidebar offset
        canvasRef.current.width = canvasRef.current.parentElement?.clientWidth || window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        render();
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, [images]);

  useGSAP(() => {
    if (loadingStatus !== "Done" || images.length === 0 || !containerRef.current) return;

    render();

    // The Fix: Pin the container.
    // GSAP will create a 'pin-spacer' that is 300vh high.
    // The canvas will stay fixed in the viewport during that time.
    const tl = gsap.to(animationProxy.current, {
      frame: images.length - 1,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: '+=200%', // Scrubs for 2 full viewport heights
        scrub: 0.5,
        pin: true,          // GSAP handles the fixed positioning
        pinSpacing: true,   // CRITICAL: MUST BE TRUE - pushes IntegrativeAI down by scroll distance
        markers: true,      // RESTORED MARKERS
        anticipatePin: 1,
        invalidateOnRefresh: true,
        refreshPriority: -1, // FIRST in the pinning chain - all other sections calculate after this
        onUpdate: () => render(),
        // Add this to ensure markers update if the page shifts
        onRefresh: () => console.log("🎯 GSAP Refreshed - Pin spacer recalculated"),
        onEnter: () => console.log("📍 Pin started"),
        onLeave: () => console.log("📍 Pin ended - IntegrativeAI should be visible now"),
      }
    });

    // REMOVED: ScrollTrigger.refresh() here - it's already called in the image loading useEffect
    // Calling it twice causes the pin to restart in a loop

    return () => {
      tl.scrollTrigger?.kill();
    };
  }, { scope: containerRef, dependencies: [loadingStatus, images] });

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden bg-giant-white"
      style={{ minHeight: '100vh' }}
    >
      {/*
        This is the view.
        It is h-screen so it fills the viewport while pinned.
      */}
      <div className="relative w-full h-screen overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-full pointer-events-none"
          style={{ zIndex: 0 }}
        />

        <div className="absolute inset-0 pointer-events-none flex items-center justify-center" style={{ zIndex: 20 }}>
          <HeroSection />
        </div>
      </div>
    </div>
  );
}
