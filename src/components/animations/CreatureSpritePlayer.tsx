'use client';

import React, { useRef, useEffect, forwardRef, useImperativeHandle } from 'react';

export interface CreatureSpriteHandle {
  render: () => void;
  animationProxy: { frame: number };
}

interface CreatureSpritePlayerProps {
  creature: 'pufferfish' | 'chameleon' | 'aifish' | 'octopus';
  className?: string;
  onReady?: () => void;
}

/**
 * CreatureSpritePlayer - Canvas-based sprite animation player
 * Samples exactly 24 frames evenly distributed from the full sprite sequence
 * First frame = frame 1, Last frame = last frame, middle frames evenly spaced
 */
export const CreatureSpritePlayer = forwardRef<CreatureSpriteHandle, CreatureSpritePlayerProps>(
  ({ creature, className = '', onReady }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const imagesRef = useRef<HTMLImageElement[]>([]);
    const animationProxy = useRef({ frame: 0 });

    // Creature sprite configuration
    const creatureConfig = {
      pufferfish: {
        totalFrames: 38,
        basePath: '/How we can help characters/Puffer',
        getFileName: (index: number) => `${index.toString().padStart(2, '0')}.webp`
      },
      chameleon: {
        totalFrames: 64,
        basePath: '/How we can help characters/Cameleon',
        getFileName: (index: number) => `Comp ${(index + 299).toString()}.webp`
      },
      aifish: {
        totalFrames: 38,
        basePath: '/How we can help characters/AI brain',
        getFileName: (index: number) => `${index.toString().padStart(2, '0')}.webp`
      },
      octopus: {
        totalFrames: 64,
        basePath: '/How we can help characters/Octopuse',
        // Octopus uses timestamp-based naming - we'll need to list these
        getFileName: (index: number) => {
          // Mapping for octopus frames (timestamps go from 133400 to 133426)
          const timestamps = Array.from({ length: 64 }, (_, i) => 133400 + i);
          return `The_octopus_moves_1080p_20260130${timestamps[index]}.webp`;
        }
      }
    };

    const config = creatureConfig[creature];

    /**
     * Calculate 24 evenly distributed frame indices
     * First frame = 1, Last frame = totalFrames, middle frames evenly spaced
     */
    const getFrameIndices = (totalFrames: number): number[] => {
      const indices: number[] = [];
      const step = (totalFrames - 1) / (24 - 1);

      for (let i = 0; i < 24; i++) {
        const frameIndex = Math.round(1 + i * step);
        indices.push(frameIndex);
      }

      return indices;
    };

    // Preload 24 selected frames
    useEffect(() => {
      const frameIndices = getFrameIndices(config.totalFrames);
      const images: HTMLImageElement[] = [];
      let loadedCount = 0;

      frameIndices.forEach((frameIndex) => {
        const img = new Image();
        img.src = `${config.basePath}/${config.getFileName(frameIndex)}`;

        img.onload = () => {
          loadedCount++;
          if (loadedCount === 24) {
            imagesRef.current = images;
            onReady?.();
            console.log(`✅ ${creature} loaded 24 frames:`, frameIndices);
          }
        };

        img.onerror = () => {
          console.error(`❌ Failed to load ${creature} frame:`, img.src);
        };

        images.push(img);
      });

      return () => {
        // Cleanup
        images.forEach(img => {
          img.src = '';
        });
      };
    }, [creature]);

    // Render current frame to canvas
    const render = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const index = Math.min(Math.max(Math.floor(animationProxy.current.frame), 0), 23);
      const img = imagesRef.current[index];

      if (img?.complete) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Center and scale image to fit canvas
        const scale = Math.min(canvas.width / img.width, canvas.height / img.height);
        const x = (canvas.width / 2) - (img.width / 2) * scale;
        const y = (canvas.height / 2) - (img.height / 2) * scale;

        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      }
    };

    // Expose render function and proxy to parent via ref
    useImperativeHandle(ref, () => ({
      render,
      animationProxy: animationProxy.current
    }));

    return (
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        className={`absolute inset-0 m-auto opacity-0 pointer-events-none ${className}`}
        style={{ mixBlendMode: 'normal', maxWidth: '600px', maxHeight: '600px' }}
      />
    );
  }
);

CreatureSpritePlayer.displayName = 'CreatureSpritePlayer';
