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

    // Scale to contain (fit) canvas - no cropping
    const hRatio = canvas.width / img.width;
    const vRatio = canvas.height / img.height;
    const ratio = Math.min(hRatio, vRatio);
    const centerX = (canvas.width - img.width * ratio) / 2;
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

    console.log('🎬 Starting image load...');

    for (let i = 0; i < frameCount; i++) {
      const img = new Image();
      const frameIndex = 100 + i; // 100 to 187
      img.src = `/giant-frames/Sequence 01_${frameIndex}.webp`;

      img.onload = () => {
        loadCount++;
        console.log(`📸 Loaded ${loadCount}/${frameCount}`);

        // Render first frame as soon as it loads
        if (!firstFrameRendered && canvasRef.current) {
          firstFrameRendered = true;
          canvasRef.current.width = window.innerWidth;
          canvasRef.current.height = window.innerHeight;
          console.log('🎨 Rendering first frame');
        }

        if (loadCount === frameCount) {
          console.log('✅ All frames loaded!');
          setImages(loadedImages);
          setLoadingStatus("Done");
        }
      };

      img.onerror = () => {
        console.error('❌ Failed to load:', img.src);
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
    console.log('🔍 useGSAP hook fired!');

    if (loadingStatus !== "Done") {
      console.log('⏳ Waiting for images to finish loading...');
      return;
    }

    if (images.length === 0) {
      console.log('⏳ Waiting for images array to populate...');
      return;
    }

    if (!containerRef.current) {
      console.log('⏳ Waiting for container ref...');
      return;
    }

    console.log('🚀 Setting up GSAP ScrollTrigger with', images.length, 'frames');

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
        onUpdate: (self) => {
          console.log('📊 Progress:', (self.progress * 100).toFixed(1) + '%', 'Frame:', Math.round(animationProxy.current.frame));
          render();
        },
        onRefresh: () => {
          console.log('🔄 ScrollTrigger refreshed');
        },
        onEnter: () => console.log('🎯 Entered trigger area'),
        onLeave: () => console.log('👋 Left trigger area')
      }
    });

    console.log('✅ ScrollTrigger created:', tl.scrollTrigger);

    // Force refresh after a small delay to ensure DOM is ready
    setTimeout(() => {
      console.log('🔄 Forcing ScrollTrigger refresh...');
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

        {loadingStatus === "Done" && (
          <div className="absolute bottom-4 right-4 bg-black/50 text-white p-2 rounded text-xs" style={{ zIndex: 30 }}>
            Frame: {Math.round(animationProxy.current.frame) + 1}/{images.length}
          </div>
        )}
      </div>

      {loadingStatus !== "Done" && (
        <div className="fixed inset-0 flex items-center justify-center bg-giant-white z-50">
          <p className="text-giant-charcoal font-mono animate-pulse">{loadingStatus}</p>
        </div>
      )}
    </>
  );
}
