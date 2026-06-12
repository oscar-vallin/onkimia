'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

interface OrbitItem {
  num: string;
  name: string;
  description: string;
}

interface OrbitDiagramProps {
  eyebrow: string;
  title: string;
  items: [OrbitItem, OrbitItem, OrbitItem, OrbitItem];
}

interface Slot {
  x: number;
  y: number;
  r: number;
  opacity: number;
  showLine: boolean;
}

const SLOTS: Record<string, Slot> = {
  '0':  { x: 450, y: 95,  r: 52, opacity: 1,    showLine: true  },
  '-1': { x: 120, y: 330, r: 26, opacity: 0.85,  showLine: false },
  '1':  { x: 780, y: 330, r: 26, opacity: 0.85,  showLine: false },
};

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const trial = (line + ' ' + w).trim();
    if (trial.length > maxChars) { lines.push(line.trim()); line = w; }
    else { line = trial; }
  }
  if (line) lines.push(line.trim());
  return lines.slice(0, 3);
}

function parseTitle(raw: string) {
  const parts = raw.split(/\*([^*]+)\*/);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <em key={i} className="italic text-teal-soft">{part}</em>
      : <span key={i}>{part}</span>
  );
}

export function OrbitDiagram({ eyebrow, title, items }: OrbitDiagramProps) {
  const [current, setCurrent] = useState(0);
  const [textVisible, setTextVisible] = useState(true);
  // SSR-safe: initialise false, hydrate on client
  const [isMobile, setIsMobile] = useState(false);
  const prefersReduced = usePrefersReducedMotion();
  const n = items.length;

  // Responsive viewBox — apex crop on mobile, full arc on desktop
  // Mobile: y:40–370 — captures full active node (top at y:43) and all 3 desc lines
  // Desktop: full 900×440 arc
  const viewBox = isMobile ? '0 40 900 330' : '0 0 900 440';

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Touch swipe refs
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  const resetAuto = useCallback(() => {
    // Resetting happens implicitly: changing `current` restarts the useEffect timer
  }, []);

  const goTo = useCallback((i: number) => {
    if (prefersReduced) {
      setCurrent(((i % n) + n) % n);
      return;
    }
    setTextVisible(false);
    setTimeout(() => {
      setCurrent(((i % n) + n) % n);
      setTextVisible(true);
    }, 150);
  }, [n, prefersReduced]);

  const next = useCallback(() => {
    if (prefersReduced) {
      setCurrent(c => (c + 1) % n);
      return;
    }
    setTextVisible(false);
    setTimeout(() => {
      setCurrent(c => (c + 1) % n);
      setTextVisible(true);
    }, 150);
  }, [n, prefersReduced]);

  const prev = useCallback(() => {
    if (prefersReduced) {
      setCurrent(c => ((c - 1) + n) % n);
      return;
    }
    setTextVisible(false);
    setTimeout(() => {
      setCurrent(c => ((c - 1) + n) % n);
      setTextVisible(true);
    }, 150);
  }, [n, prefersReduced]);

  // Touch swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    if (Math.abs(deltaX) < 50) return;
    if (Math.abs(deltaY) > Math.abs(deltaX) * 0.8) return;

    if (deltaX < 0) {
      next();
    } else {
      prev();
    }
    resetAuto();
  };

  // Auto-loop — resets when current changes
  useEffect(() => {
    if (prefersReduced) return;
    const id = setInterval(() => {
      setCurrent(c => (c + 1) % n);
    }, 4000);
    return () => clearInterval(id);
  }, [prefersReduced, n, current]);

  function getSlot(i: number): Slot | undefined {
    let rel = i - current;
    if (rel > n / 2) rel -= n;
    if (rel < -n / 2) rel += n;
    return SLOTS[String(rel)];
  }

  const descLines = wrapText(items[current].description, 40);

  const textStyle = {
    opacity: textVisible ? 1 : 0,
    transition: prefersReduced ? 'none' : 'opacity 150ms ease',
  };

  return (
    <section className="bg-ink py-12 md:py-28 overflow-x-hidden">
      {/* Header: padded container for readability */}
      <div className="container-onkimia mb-8 md:mb-12">
        <div className="text-center">
          <p className="text-xs font-medium tracking-widest uppercase text-white/90 mb-4">
            {eyebrow}
          </p>
          <h2 className="font-serif font-normal text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
            {parseTitle(title)}
          </h2>
        </div>
      </div>

      {/* SVG: full-width on mobile (bleeds to edges), max-width on desktop */}
      <div
        className="w-full md:max-w-[1100px] md:mx-auto touch-pan-y"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <svg
          viewBox={viewBox}
          className="w-full h-auto overflow-visible"
          role="img"
          aria-label={title}
        >
          <defs>
            <radialGradient id="orbGlow" cx="50%" cy="100%" r="70%">
              <stop offset="0%" stopColor="#2a9d8c" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#2a9d8c" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Ambient glow */}
          <ellipse cx="450" cy="430" rx="400" ry="380" fill="url(#orbGlow)" />

          {/* Arc */}
          <path
            d="M 70 420 A 380 380 0 0 1 830 420"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1.5"
          />

          {/* Center anchor dot — below mobile viewport, visible on desktop */}
          <circle cx="450" cy="420" r="5" fill="#2a9d8c" />

          {/* Connector line — only active slot (showLine: true) */}
          {items.map((_, i) => {
            const slot = getSlot(i);
            if (!slot?.showLine) return null;
            return (
              <line
                key={`line-${i}`}
                x1={450} y1={420}
                x2={slot.x} y2={slot.y + slot.r}
                stroke="rgba(42,157,140,0.4)"
                strokeWidth="1"
                className="transition-all duration-700 ease-out"
              />
            );
          })}

          {/* Active item text (name + description) — inside arc, visible in both viewBoxes */}
          <text
            x="450"
            y="200"
            textAnchor="middle"
            fill="#2a9d8c"
            fontFamily="var(--font-fraunces), var(--font-serif, Georgia), serif"
            fontStyle="italic"
            fontSize="38"
            fontWeight="400"
            style={textStyle}
          >
            {items[current].name}
          </text>
          {descLines.map((line, idx) => (
            <text
              key={idx}
              x="450"
              y={245 + idx * 32}
              textAnchor="middle"
              fill="rgba(255,255,255,0.72)"
              fontFamily="var(--font-dm-sans), var(--font-sans, system-ui), sans-serif"
              fontSize="17"
              style={textStyle}
            >
              {line}
            </text>
          ))}

          {/* Nodes */}
          {items.map((item, i) => {
            const slot = getSlot(i);
            if (!slot) {
              return <g key={i} opacity={0} aria-hidden="true" />;
            }
            const isActive = i === current;
            return (
              <g
                key={i}
                onClick={() => goTo(i)}
                role="button"
                aria-label={item.name}
                className="cursor-pointer"
                style={{
                  opacity: slot.opacity,
                  transition: 'opacity 700ms ease-out',
                }}
              >
                <circle
                  cx={slot.x}
                  cy={slot.y}
                  r={slot.r}
                  fill={isActive ? 'transparent' : '#232329'}
                  stroke={isActive ? '#5DCAA5' : 'rgba(42,157,140,0.5)'}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  style={{ transition: 'all 700ms cubic-bezier(0.4,0,0.2,1)' }}
                />
                {/* Teal accent dot — visual anchor for active node */}
                {isActive && (
                  <circle
                    cx={slot.x}
                    cy={slot.y}
                    r={4}
                    fill="#5DCAA5"
                    style={{ transition: 'all 700ms cubic-bezier(0.4,0,0.2,1)' }}
                  />
                )}
                <text
                  x={slot.x}
                  y={slot.y + slot.r * 0.35}
                  textAnchor="middle"
                  fill="white"
                  fontFamily="var(--font-fraunces), var(--font-serif, Georgia), serif"
                  fontSize={slot.r * 0.65}
                  style={{ transition: 'all 700ms cubic-bezier(0.4,0,0.2,1)' }}
                >
                  {item.num}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Controls: desktop only — mobile is swipe-only */}
        <div className="hidden md:flex items-center justify-center gap-6 md:gap-8 mt-2">
          <button
            type="button"
            onClick={prev}
            aria-label="Anterior"
            className="w-14 h-14 rounded-full border border-white/[0.08] flex items-center justify-center text-white hover:bg-teal hover:border-teal transition-colors"
          >
            <ArrowRight className="w-5 h-5 rotate-180" aria-hidden="true" />
          </button>

          <div className="flex gap-2.5">
            {items.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={item.name}
                aria-current={i === current ? 'true' : undefined}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === current ? 'w-6 bg-teal-soft' : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Siguiente"
            className="w-14 h-14 rounded-full border border-white/[0.08] flex items-center justify-center text-white hover:bg-teal hover:border-teal transition-colors"
          >
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
