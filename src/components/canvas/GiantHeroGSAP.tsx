'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap-register';
import { HeroSection } from '@/components/sections/HeroSection';

/**
 * GiantHeroGSAP - Apple-style scroll-scrubbed animation
 * Uses GSAP ScrollTrigger with scrub and pin.
 * Restored to stable state without debug markers or complex scroller logic.
 */
export function GiantHeroGSAP() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadingStatus, setLoadingStatus] = useState("Loading...");
  const [errorConfig, setErrorConfig] = useState<string | null>(null);

  // Animation proxy - GSAP animates this object
  const animationProxy = useRef({ frame: 0 });

  // Render function - draws specific image to canvas with "Cover" scaling
  const drawFrame = (img: HTMLImageElement) => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context || !img || !img.complete) return;

    // Clear and draw
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Scale to COVER (fill) canvas
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.max(hRatio, vRatio);

    // Anchor to RIGHT side (keep right side constant, crop from left)
    const centerX = canvas.width - (img.width * ratio);

    // Center vertically
    const centerY = (canvas.height - img.height * ratio) / 2;

    context.drawImage(
      img,
      0, 0, img.width, img.height,
      centerX, centerY, img.width * ratio, img.height * ratio
    );
  };

  // Render current animation frame based on proxy
  const render = () => {
    if (images.length === 0) return;
    const frameIndex = Math.round(animationProxy.current.frame);
    const img = images[frameIndex];
    if (img) drawFrame(img);
  };

  // Load all 88 frames
  useEffect(() => {
    const frameCount = 88;
    const loadedImages: HTMLImageElement[] = [];
    let loadCount = 0;

    // console.log('🎬 Starting image load...');

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      const frameIndex = 100 + i; // 100 to 187
      img.src = `/giant-frames/Sequence 01_${frameIndex}.webp`;

      img.onload = () => {
        loadCount++;

        // Render first frame immediately to prevent blank screen
        if (frameIndex === 100) {
          drawFrame(img);
        }

        if (loadCount === frameCount) {
          console.log('✅ All Giant frames loaded');
          setImages(loadedImages);
          setLoadingStatus("Done");
        }
      };

      img.onerror = () => {
        console.error('❌ Failed to load Giant frame:', img.src);
        setErrorConfig(img.src);
      };

      loadedImages.push(img);
    }
  }, []);

  // Canvas resize handler
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && containerRef.current) {
        // Match canvas dimensions to the container (Right Stage)
        canvasRef.current.width = containerRef.current.offsetWidth;
        canvasRef.current.height = window.innerHeight;
        render();
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [images]);

  // GSAP ScrollTrigger Animation
  useGSAP(() => {
    if (loadingStatus !== "Done" || images.length === 0 || !containerRef.current) return;

    // Render initial state
    render();

    // Setup GSAP animation
    const tl = gsap.to(animationProxy.current, {
      frame: images.length - 1,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: () => render(),
      }
    });

    return () => {
      tl.scrollTrigger?.kill();
    };

  }, { scope: containerRef, dependencies: [loadingStatus, images] });

  if (errorConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error loading Giant animation.</p>
      </div>
    );
  }

  return (
    <>
      <div ref={containerRef} className="relative w-full h-[300vh]">
        <canvas
          ref={canvasRef}
          className="absolute top-0 left-0 w-full h-screen object-cover pointer-events-none"
          style={{ zIndex: 0 }}
        />

        {/* Hero Text Overlay - stays fixed while canvas scrolls */}
        <div className="fixed top-0 left-0 w-full h-screen pointer-events-none flex items-center justify-center" style={{ zIndex: 20 }}>
          <HeroSection />
        </div>
      </div>

      {loadingStatus !== "Done" && (
        <div className="fixed inset-0 flex items-center justify-center bg-giant-white z-50">
          <p className="text-giant-charcoal font-mono animate-pulse">{loadingStatus}</p>
        </div>
      )}
    </>
  );
}
