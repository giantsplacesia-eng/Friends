'use client';

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import { gsap } from '@/lib/gsap-register';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface NavItem {
  id: string;
  label: string;
}

const navItems: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'work', label: 'Work' },
  { id: 'process', label: 'Process' },
  { id: 'insights', label: 'Insights' },
  { id: 'careers', label: 'Careers' },
  { id: 'connect', label: 'Connect' },
];

interface LeftControllerProps {
  activeSection: string;
  onSectionChange: (id: string) => void;
}

export function LeftController({ activeSection, onSectionChange }: LeftControllerProps) {
  const containerRef = useRef<HTMLElement>(null);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useGSAP(() => {
    buttonsRef.current.forEach((btn) => {
      if (!btn) return;

      // Independent floating physics
      gsap.to(btn, {
        y: "random(-8, 8)", // Reduced range for cleaner feel
        duration: "random(4, 7)",
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      // Hover effect
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, { scale: 1.05, duration: 0.3, ease: 'power2.out' });
      });

      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { scale: 1, duration: 0.3, ease: 'power2.out' });
      });
    });
  }, { scope: containerRef });

  return (
    <aside
      ref={containerRef}
      className="h-screen w-full bg-giant-sage flex flex-col overflow-y-auto z-50 border-r border-black/10"
      style={{
        scrollbarWidth: 'none', // Firefox
        msOverflowStyle: 'none', // IE/Edge
        WebkitOverflowScrolling: 'touch', // iOS smooth scroll
        transform: 'translateZ(0)', // GPU acceleration
      }}
    >
      <div className="pt-8 pb-4 px-8 cursor-pointer w-full" onClick={() => onSectionChange('home')}>
        {/* Logo - matches button padding */}
        <div className="relative w-full h-auto">
          <Image
            src="/logo svgs/FWGlogo.svg"
            alt="Friends with Giants"
            width={281}
            height={281}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>

      <nav className="flex flex-col gap-4 w-full pb-20 px-8">
        {navItems.map((item, index) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              ref={(el) => { buttonsRef.current[index] = el; }}
              className={cn(
                "block w-full py-3 px-6 rounded-md text-center transition-all duration-500",
                "italic uppercase tracking-[0.08em] font-medium text-sm",
                isActive
                  ? "bg-giant-red text-giant-orange text-[24px] h-[110px] flex items-center justify-center font-bold leading-none shadow-lg"
                  : "bg-giant-charcoal text-giant-orange h-[40px] flex items-center justify-center hover:bg-opacity-90 hover:shadow-md"
              )}
            >
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Extra content to ensure scrollability */}
      <div className="space-y-8 text-giant-charcoal text-xs opacity-60 pb-12 px-8">
        <div>
          <h4 className="font-bold uppercase mb-2">Contact</h4>
          <p>hello@friendswithgiants.com</p>
          <p className="mt-2">+1 (555) 123-4567</p>
          <p className="mt-2">Mon - Fri, 9am - 6pm PST</p>
        </div>
        <div>
          <h4 className="font-bold uppercase mb-2">Location</h4>
          <p>San Francisco, CA</p>
          <p className="mt-2">123 Market Street</p>
          <p className="mt-1">Suite 400</p>
          <p className="mt-1">San Francisco, CA 94105</p>
        </div>
        <div>
          <h4 className="font-bold uppercase mb-2">Follow</h4>
          <p>LinkedIn • Twitter • Instagram</p>
          <p className="mt-2">GitHub • Dribbble</p>
          <p className="mt-2">Behance • Medium</p>
        </div>
        <div>
          <h4 className="font-bold uppercase mb-2">Industries</h4>
          <p>Technology</p>
          <p className="mt-1">Healthcare</p>
          <p className="mt-1">Finance</p>
          <p className="mt-1">E-commerce</p>
          <p className="mt-1">Education</p>
          <p className="mt-1">Entertainment</p>
        </div>
        <div>
          <h4 className="font-bold uppercase mb-2">Services</h4>
          <p>AI Integration</p>
          <p className="mt-1">Brand Strategy</p>
          <p className="mt-1">Digital Marketing</p>
          <p className="mt-1">Content Creation</p>
          <p className="mt-1">Web Development</p>
          <p className="mt-1">Analytics</p>
        </div>
        <div>
          <h4 className="font-bold uppercase mb-2">Awards</h4>
          <p>Best AI Agency 2025</p>
          <p className="mt-1">Webby Award Winner</p>
          <p className="mt-1">FWA Site of the Day</p>
          <p className="mt-1">Awwwards Honorable</p>
        </div>
      </div>

      <div className="mt-auto text-giant-charcoal text-xs opacity-60 px-8 pb-8">
        © 2026 FWG
      </div>
    </aside>
  );
}
