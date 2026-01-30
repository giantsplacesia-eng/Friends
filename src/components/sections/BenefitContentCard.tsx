'use client';

import React, { useRef, forwardRef, useImperativeHandle } from 'react';
import Link from 'next/link';

export interface BenefitData {
  shape: 'circle' | 'square' | 'triangle' | 'hexagon';
  title: string;
  description: string;
  buttonText: string;
}

interface BenefitContentCardProps {
  benefit: BenefitData;
  className?: string;
}

export interface BenefitCardHandle {
  titleCharsClass: string;
  descriptionClass: string;
  buttonClass: string;
}

/**
 * BenefitContentCard - Content overlay for each geometric shape
 * Features letter-by-letter title animation, description fade, and CTA button
 */
export const BenefitContentCard = forwardRef<BenefitCardHandle, BenefitContentCardProps>(
  ({ benefit, className = '' }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Generate unique class names for GSAP targeting
    const shapeClass = `benefit-${benefit.shape}`;
    const titleCharsClass = `${shapeClass}-char`;
    const descriptionClass = `${shapeClass}-description`;
    const buttonClass = `${shapeClass}-button`;

    /**
     * Split text into individual characters for letter-by-letter animation
     * Preserves spaces as non-breaking spaces for proper layout
     */
    const splitTextToChars = (text: string) => {
      return text.split('').map((char, i) => (
        <span
          key={i}
          className={`${titleCharsClass} inline-block opacity-0`}
          style={{ whiteSpace: char === ' ' ? 'pre' : 'normal' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ));
    };

    // Expose class names to parent for GSAP animations
    useImperativeHandle(ref, () => ({
      titleCharsClass: `.${titleCharsClass}`,
      descriptionClass: `.${descriptionClass}`,
      buttonClass: `.${buttonClass}`
    }));

    return (
      <div
        ref={containerRef}
        className={`${shapeClass} absolute left-20 bottom-20 max-w-md z-25 opacity-0 ${className}`}
      >
        {/* Title - Non Bureau 38pt Bold All Caps - Letter-by-letter reveal */}
        <h3
          className="font-['Non_Bureau'] font-bold uppercase text-white mb-4"
          style={{
            fontSize: '38px',
            lineHeight: '1.2',
            letterSpacing: '0.05em'
          }}
        >
          {splitTextToChars(benefit.title)}
        </h3>

        {/* Description - Non Bureau 18pt Regular */}
        <p
          className={`${descriptionClass} font-['Non_Bureau'] text-white opacity-0 mb-6`}
          style={{
            fontSize: '18px',
            lineHeight: '1.6'
          }}
        >
          {benefit.description}
        </p>

        {/* Button - Red BG with hover effect, links to business scale page */}
        <Link
          href="/business-scale"
          className={`${buttonClass} bg-giant-red text-white px-6 py-3 uppercase text-xs tracking-wider
                     hover:bg-giant-orange transition-colors duration-300 opacity-0 inline-block`}
        >
          {benefit.buttonText}
        </Link>
      </div>
    );
  }
);

BenefitContentCard.displayName = 'BenefitContentCard';

// Benefit data for all four shapes
export const benefits: BenefitData[] = [
  {
    shape: 'circle',
    title: 'BUSINESS GROWTH',
    description: 'We enable rapid growth by driving operational efficiency and rapidly scaling capital to growth drivers',
    buttonText: 'WE GOT YOU, ENQUIRE WITHIN'
  },
  {
    shape: 'square',
    title: 'BRAND EVOLUTION',
    description: 'Transform your brand identity with strategic positioning and creative excellence',
    buttonText: 'WE GOT YOU, ENQUIRE WITHIN'
  },
  {
    shape: 'triangle',
    title: 'AI IMPLEMENTATION',
    description: 'Integrate cutting-edge AI solutions to revolutionize your operations',
    buttonText: 'WE GOT YOU, ENQUIRE WITHIN'
  },
  {
    shape: 'hexagon',
    title: 'STRATEGIC ROADMAP',
    description: 'Chart your path forward with data-driven strategic planning',
    buttonText: 'WE GOT YOU, ENQUIRE WITHIN'
  }
];
