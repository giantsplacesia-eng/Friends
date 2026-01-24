'use client';

import React, { useRef, useEffect, useState } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap, ScrollTrigger } from '@/lib/gsap-register';
import { HeroSection } from '@/components/sections/HeroSection';

/**
 * GiantHeroGSAP - Apple-style scroll-scrubbed animation
 * Uses GSAP ScrollTrigger with scrub and pin
 */
export function GiantHeroGSAP() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadingStatus, setLoadingStatus] = useState("Loading...");
  const [errorConfig, setErrorConfig] = useState<string | null>(null);

  // Animation proxy - GSAP animates this object
  const animationProxy = useRef({ frame: 0 });

  // Render function - draws current frame to canvas
  const render = () => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context || images.length === 0) return;

    const frameIndex = Math.round(animationProxy.current.frame);
    const img = images[frameIndex];

    if (!img || !img.complete) return;

    // Clear and draw
    context.clearRect(0, 0, canvas.width, canvas.height);

    // Scale to COVER (fill) canvas - optimized for desktop
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

  // Load all 88 frames
  useEffect(() => {
    const frameCount = 88;
    const loadedImages: HTMLImageElement[] = [];
    let loadCount = 0;
    let firstFrameRendered = false;

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      const frameIndex = 100 + i; // 100 to 187
      img.src = `/giant-frames/Sequence 01_${frameIndex}.webp`;

      img.onload = () => {
        loadCount++;

        // Render first frame as soon as it loads
        if (!firstFrameRendered && canvasRef.current) {
          firstFrameRendered = true;
          canvasRef.current.width = window.innerWidth;
          canvasRef.current.height = window.innerHeight;
        }

        if (loadCount === frameCount) {
          setImages(loadedImages);
          setLoadingStatus("Done");
        }
      };

      img.onerror = () => {
        setErrorConfig(img.src);
      };

      loadedImages.push(img);
    }
  }, []);

  // Canvas resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
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
    if (loadingStatus !== "Done") {
      return;
    }

    if (images.length === 0) {
      return;
    }

    if (!containerRef.current) {
      return;
    }

    // Render the first frame immediately
    render();

    const tl = gsap.to(animationProxy.current, {
      frame: images.length - 1,
      ease: 'none',
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.5,
        markers: true,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: () => {
          render();
        }
      }
    });

    // Force refresh after a small delay to ensure DOM is ready
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100);

    return () => {
      tl.scrollTrigger?.kill();
    };

  }, { scope: containerRef, dependencies: [loadingStatus, images] });

  if (errorConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500">Error loading: {errorConfig}</p>
      </div>
    );
  }

  return (
    <>
      <div ref={containerRef} className="relative w-full h-[300vh]">
        <canvas
          ref={canvasRef}
          className="fixed top-0 left-0 w-screen h-screen pointer-events-none"
          style={{ zIndex: 0 }}
        />

        <div className="fixed top-0 left-0 w-screen h-screen pointer-events-none flex items-center justify-center" style={{ zIndex: 20 }}>
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
