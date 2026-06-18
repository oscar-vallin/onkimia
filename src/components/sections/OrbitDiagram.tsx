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

// Mobile override for active node: lower y so there is visible arc+apex gap above it
const MOBILE_ACTIVE: Slot = { x: 450, y: 140, r: 54, opacity: 1, showLine: true };

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
  // SSR-safe: initialise false (server renders desktop viewBox), hydrate on client
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const prefersReduced = usePrefersReducedMotion();
  const n = items.length;

  // Responsive viewBox:
  // Mobile — narrow horizontal crop (x:240–660) centred on arc apex; side nodes at
  //   x:120 and x:780 fall outside and are clipped. Tall window (y:-60–500) gives
  //   breathing room above the apex dot and space below the text.
  // Desktop — full 900×440 arc, unchanged.
  const viewBox = isMobile ? '240 -60 420 560' : '0 0 900 440';

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Touch swipe refs
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  // Nudge refs
  const svgWrapRef = useRef<HTMLDivElement>(null);
  const nudgeDone = useRef(false);

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

  // Capa 3 — nudge inicial: sutil deslizamiento en X la primera vez en viewport (solo móvil)
  useEffect(() => {
    if (prefersReduced || !isMobile || nudgeDone.current) return;
    const el = svgWrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || nudgeDone.current) return;
        nudgeDone.current = true;
        observer.disconnect();
        el.style.transition = 'transform 210ms ease';
        el.style.transform = 'translateX(14px)';
        setTimeout(() => {
          el.style.transition = 'transform 420ms ease';
          el.style.transform = 'translateX(0)';
          setTimeout(() => {
            el.style.transition = '';
            el.style.transform = '';
          }, 420);
        }, 210);
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isMobile, prefersReduced]);

  // Auto-loop — pauses on hover or reduced-motion; resets on manual navigation via current dep
  useEffect(() => {
    if (prefersReduced || isHovered) return;
    const id = setInterval(() => {
      setCurrent(c => (c + 1) % n);
    }, 7000);
    return () => clearInterval(id);
  }, [prefersReduced, isHovered, n, current]);

  function getSlot(i: number): Slot | undefined {
    let rel = i - current;
    if (rel > n / 2) rel -= n;
    if (rel < -n / 2) rel += n;
    // On mobile the active slot uses a lower y position so arc apex is clearly
    // visible above the node ring
    if (isMobile && rel === 0) return MOBILE_ACTIVE;
    return SLOTS[String(rel)];
  }

  const maxChars = isMobile ? 28 : 40;
  const descLines = wrapText(items[current].description, maxChars);

  const textStyle = {
    opacity: textVisible ? 1 : 0,
    transition: prefersReduced ? 'none' : 'opacity 150ms ease',
  };

  const activeItem = items[current];

  return (
    <section
      className="bg-ink py-12 md:py-28 overflow-x-hidden"
      role="region"
      aria-label={eyebrow}
    >
      {/* Live region: announces active item to screen readers on change */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {activeItem.name}: {activeItem.description}
      </div>
      {/* Header: padded container for readability */}
      <div className="container-onkimia mb-14 md:mb-12">
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
        ref={svgWrapRef}
        className="w-full md:max-w-[1100px] md:mx-auto touch-pan-y"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <svg
          viewBox={viewBox}
          className="w-full h-auto overflow-hidden md:overflow-visible"
          aria-hidden="true"
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

          {/* Capa 1 — arc indicator dots (mobile only)
               Arc: centre (450,420) r=380. Point i: x=450+380·sin(θ), y=420−380·cos(θ)
               θ = −22°, −8°, +8°, +22° → (308,68) (397,44) (503,44) (592,68) */}
          {isMobile && (() => {
            const ARC_PTS = [
              { x: 308, y: 68 },
              { x: 397, y: 44 },
              { x: 503, y: 44 },
              { x: 592, y: 68 },
            ] as const;
            return ARC_PTS.map((pt, i) => {
              const active = i === current;
              return (
                <g
                  key={`arc-dot-${i}`}
                  role="button"
                  aria-label={items[i].name}
                  aria-current={active ? 'true' : undefined}
                  onClick={() => goTo(i)}
                  className="cursor-pointer"
                >
                  {/* Transparent hit-area */}
                  <circle cx={pt.x} cy={pt.y} r={20} fill="transparent" />
                  {/* Visible dot */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={active ? 10 : 6}
                    fill={active ? '#5DCAA5' : 'rgba(255,255,255,0.28)'}
                    style={{ transition: 'all 300ms ease' }}
                  />
                </g>
              );
            });
          })()}

          {/* Capa 2 — chevrons ‹ › flanqueando el nodo activo (mobile only)
               MOBILE_ACTIVE: x=450, y=140, r=54 → chevrons en y=148 */}
          {isMobile && (
            <>
              <g
                role="button"
                aria-label="Anterior"
                onClick={prev}
                className="cursor-pointer"
              >
                <circle cx={360} cy={148} r={28} fill="transparent" />
                <text
                  x={360} y={162}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.28)"
                  fontSize={40}
                  fontFamily="system-ui, sans-serif"
                >
                  ‹
                </text>
              </g>
              <g
                role="button"
                aria-label="Siguiente"
                onClick={next}
                className="cursor-pointer"
              >
                <circle cx={540} cy={148} r={28} fill="transparent" />
                <text
                  x={540} y={162}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.28)"
                  fontSize={40}
                  fontFamily="system-ui, sans-serif"
                >
                  ›
                </text>
              </g>
            </>
          )}

          {/* Active item text — name */}
          <text
            x="450"
            y={isMobile ? 300 : 200}
            textAnchor="middle"
            fill="#2a9d8c"
            fontFamily="var(--font-fraunces), var(--font-serif, Georgia), serif"
            fontStyle="italic"
            fontSize={isMobile ? 40 : 38}
            fontWeight="400"
            style={textStyle}
          >
            {items[current].name}
          </text>

          {/* Active item text — description lines */}
          {descLines.map((line, idx) => (
            <text
              key={idx}
              x="450"
              y={isMobile ? 345 + idx * 34 : 245 + idx * 32}
              textAnchor="middle"
              fill="rgba(255,255,255,0.72)"
              fontFamily="var(--font-dm-sans), var(--font-sans, system-ui), sans-serif"
              fontSize={isMobile ? 24 : 17}
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
                {/* Teal accent dot — centre of active node ring */}
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
            className="w-14 h-14 rounded-full border border-white/[0.08] flex items-center justify-center text-white hover:bg-teal hover:border-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
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
                className={`h-2 rounded-full transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-ink ${
                  i === current ? 'w-6 bg-teal-soft' : 'w-2 bg-white/20'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={next}
            aria-label="Siguiente"
            className="w-14 h-14 rounded-full border border-white/[0.08] flex items-center justify-center text-white hover:bg-teal hover:border-teal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            <ArrowRight className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </section>
  );
}
