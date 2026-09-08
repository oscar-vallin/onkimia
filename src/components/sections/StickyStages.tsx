'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  Heart,
  Clipboard,
  Sun,
  Search,
  User,
  Activity,
  Microscope,
  Shield,
  Dna,
  ArrowRight,
} from 'lucide-react';
import { PillButton } from '@/components/ui/PillButton';
import { Section } from '@/components/ui/Section';
import { parseEmphasis } from '@/lib/parseEmphasis';

// Values must match the dropdown list in siteSettings.ts → servicesList[].icon
export type ServiceIconName =
  | 'heart' | 'clipboard' | 'sun' | 'search'
  | 'user' | 'activity' | 'microscope' | 'shield' | 'dna';

const ICON_MAP: Record<ServiceIconName, React.ReactNode> = {
  heart:      <Heart      className="w-5 h-5" aria-hidden="true" />,
  clipboard:  <Clipboard  className="w-5 h-5" aria-hidden="true" />,
  sun:        <Sun        className="w-5 h-5" aria-hidden="true" />,
  search:     <Search     className="w-5 h-5" aria-hidden="true" />,
  user:       <User       className="w-5 h-5" aria-hidden="true" />,
  activity:   <Activity   className="w-5 h-5" aria-hidden="true" />,
  microscope: <Microscope className="w-5 h-5" aria-hidden="true" />,
  shield:     <Shield     className="w-5 h-5" aria-hidden="true" />,
  dna:        <Dna        className="w-5 h-5" aria-hidden="true" />,
};

function iconNode(name: ServiceIconName | string): React.ReactNode {
  return ICON_MAP[name as ServiceIconName] ?? ICON_MAP.heart;
}

export interface ServiceItem {
  icon: ServiceIconName | string;
  title: string;
  description: string;
  /** Local /public path — portrait crop, shown in the main frame. */
  image: string;
  /** Local /public path — landscape crop of the same shot, shown in the accent frame. */
  imageAccent: string;
}

export interface StickyStagesProps {
  eyebrow: string;
  title: string;
  lead: string;
  ctaLabel: string;
  ctaHref: string;
  items: ServiceItem[];
}

const AUTOPLAY_MS = 4200;

export function StickyStages({
  eyebrow,
  title,
  lead,
  ctaLabel,
  ctaHref,
  items,
}: StickyStagesProps) {
  const [active, setActive] = useState(0);
  const pausedRef = useRef(false);

  const count = items.length;

  // Auto-advance through every photo when idle; pauses the instant the
  // pointer is anywhere in the list or the visual, resumes on leave.
  useEffect(() => {
    if (count <= 1) return;
    const id = setInterval(() => {
      if (!pausedRef.current) setActive((i) => (i + 1) % count);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [count]);

  const pause = () => { pausedRef.current = true; };
  const resume = () => { pausedRef.current = false; };

  return (
    <Section theme="gray">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 lg:gap-20 items-start">

        {/* LEFT — heading + interactive service index */}
        <div>
          <p className="font-sans text-[10px] md:text-xs font-medium tracking-[0.22em] uppercase mb-4 text-secondary">
            {eyebrow}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-[3.25rem] leading-tight tracking-[-0.02em] mb-5 text-primary text-balance">
            {parseEmphasis(title, 'not-italic italic text-teal')}
          </h2>
          {/* <p className="font-sans text-sm md:text-base leading-relaxed text-secondary mb-8">
            {lead}
          </p> */}

          <div
            className="flex flex-col border-t border-line"
            onMouseEnter={pause}
            onMouseLeave={resume}
          >
            {items.map((item, i) => {
              const isActive = active === i;
              return (
                <button
                  key={i}
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className={`group flex items-center gap-4 py-4 border-b border-line text-left transition-colors duration-300 ${
                    isActive ? 'bg-teal/5' : 'hover:bg-teal/5'
                  }`}
                >
                  <span
                    className={`shrink-0 w-11 h-11 rounded-full border flex items-center justify-center transition-colors duration-300 ${
                      isActive
                        ? 'border-teal text-teal bg-teal/10'
                        : 'border-line text-secondary bg-white group-hover:border-teal group-hover:text-teal group-hover:bg-teal/10'
                    }`}
                  >
                    {iconNode(item.icon)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`relative inline-block font-sans font-medium text-[15px] md:text-base leading-snug transition-colors duration-300 ${
                        isActive ? 'text-teal' : 'text-primary group-hover:text-teal'
                      }`}
                    >
                      {item.title}
                      <span
                        className={`absolute left-0 -bottom-0.5 w-full h-px bg-teal origin-left transition-transform duration-300 ease-out ${
                          isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                        }`}
                        aria-hidden="true"
                      />
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

        </div>

        {/* RIGHT — layered photo composition, synced to the active service */}
        <div
          className="relative pt-1.5 pr-8 pb-14 pl-1.5 lg:sticky lg:top-[110px]"
          onMouseEnter={pause}
          onMouseLeave={resume}
        >
          {/* Faint dotted arc — echoes the Onkimia logo's dot ring */}
          <svg
            className="absolute -top-9 -right-2.5 w-[220px] h-[220px] opacity-45 pointer-events-none"
            viewBox="0 0 200 200"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="100" cy="100" r="88" stroke="var(--color-teal)" strokeWidth="1.2" strokeDasharray="2 10" strokeLinecap="round" opacity="0.7" />
            <circle cx="100" cy="100" r="70" stroke="var(--color-teal-light)" strokeWidth="1" strokeDasharray="1 8" strokeLinecap="round" opacity="0.5" />
          </svg>

          <div className="relative z-[1] w-[72%] rounded-[28px] overflow-hidden aspect-[4/5] border border-line shadow-[0_30px_60px_-20px_rgba(20,20,25,0.35)] bg-white">
            {items.map((item, i) => (
              <Image
                key={i}
                src={item.image}
                alt={item.title}
                fill
                sizes="(max-width: 1024px) 60vw, 30vw"
                className={`object-cover transition-opacity duration-500 ${i === active ? 'opacity-100' : 'opacity-0'}`}
                priority={i === 0}
              />
            ))}
          </div>

          <div className="absolute z-[2] right-8 bottom-14 w-[52%] rounded-[18px] overflow-hidden aspect-[4/3] border-[6px] border-white shadow-[0_24px_46px_-16px_rgba(20,20,25,0.4)] -rotate-[2.2deg] bg-white">
            {items.map((item, i) => (
              <div
                key={i}
                className={`absolute inset-0 flex items-center p-4 transition-opacity duration-500 ${
                  i === active ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <p className="font-sans text-[11px] md:text-[18px] leading-relaxed text-secondary">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* Progress dots — one per service/photo (7 services → 7 dots) */}
          <div className="relative z-[1] flex items-center gap-2 mt-5 pl-1">
            {items.map((item, i) => (
              <button
                key={i}
                type="button"
                aria-label={item.title}
                onClick={() => setActive(i)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  i === active ? 'w-5 bg-teal' : 'w-1.5 bg-primary/15 hover:bg-primary/30'
                }`}
              />
            ))}
          </div>
        </div>

      </div>
    </Section>
  );
}
