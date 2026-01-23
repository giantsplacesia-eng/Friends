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
  { id: 'home', label: 'Home' }, // explicit Home to reset giant
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'work', label: 'Work' },
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
      className="h-screen w-full bg-giant-sage p-8 flex flex-col gap-6 overflow-y-auto no-scrollbar z-50 border-r border-black/10"
    >
      <div className="mb-12 cursor-pointer w-full" onClick={() => onSectionChange('home')}>
        {/* Logo - matches button width */}
        <div className="relative w-full h-auto">
          <Image
            src="/logo svgs/FWGlogo.svg"
            alt="Friends with Giants"
            width={200}
            height={200}
            className="w-full h-auto"
            priority
          />
        </div>
      </div>

      <nav className="flex flex-col gap-4 w-full pb-20">
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

      <div className="mt-auto text-giant-charcoal text-xs opacity-60">
        © 2026 FWG
      </div>
    </aside>
  );
}
