'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import type { Procedure } from '@/sanity/types';
import { SanityImage as Image } from '@/components/ui/SanityImage';
import { urlFor } from '@/sanity/image';

interface Props {
  procedures: Procedure[];
  badgeEndos: string;
  badgeCuidare: string;
  categoryEndos: string;
  categoryCuidare: string;
}

// ─── Card (same visual spec as ProcedureCard in ProcedureCarousel) ───────────
function MobileCard({
  name,
  duration,
  shortDescription,
  submark,
  image,
  badgeEndos,
  badgeCuidare,
  categoryEndos,
  categoryCuidare,
}: Procedure & { badgeEndos: string; badgeCuidare: string; categoryEndos: string; categoryCuidare: string }) {
  const hasDuration = !!duration;
  const [durationNum, ...durationUnit] = hasDuration ? duration!.split(' ') : [];
  const unitStr = durationUnit?.join(' ') ?? '';

  const cardSrc = image
    ? urlFor(image).width(800).format('webp').quality(82).url()!
    : undefined;

  return (
    <div
      className="relative rounded-3xl overflow-hidden flex-shrink-0"
      style={{ width: '75vw', height: '420px', scrollSnapAlign: 'center' }}
    >
      {/* Full-bleed background image */}
      {cardSrc && (
        <Image
          src={cardSrc}
          alt={name}
          fill
          sizes="85vw"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}

      {/* Gradient for legibility */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.60) 0%, transparent 35%, transparent 45%, rgba(0,0,0,0.80) 70%, rgba(0,0,0,0.92) 100%)' }}
        aria-hidden="true"
      />

      {/* Overlaid content */}
      <div className="relative z-20 h-full flex flex-col justify-between p-5">
        {/* Top: name + category (+ optional duration) */}
        <div>
          {hasDuration && (
            <div className="font-serif text-4xl text-white leading-none mb-1">{durationNum}</div>
          )}
          {hasDuration && unitStr && (
            <div className="text-[10px] text-white/80 uppercase tracking-wider mb-2">{unitStr}</div>
          )}
          <div className="text-[16px] font-medium text-white leading-snug">{name}</div>
          <div className="text-[14px] text-white/80 mt-1">
            {submark === 'Endos' ? categoryEndos : categoryCuidare}
          </div>
        </div>

        {/* Bottom: badge + description */}
        <div className="pb-3">
          <span className="inline-flex items-center text-[9px] tracking-wider uppercase font-semibold text-white bg-teal/70 backdrop-blur-sm rounded-full px-3 py-1 mb-2">
            {submark === 'Endos' ? badgeEndos : badgeCuidare}
          </span>
          <p className="text-[12.5px] text-white/95 leading-relaxed line-clamp-3">{shortDescription}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export function ProcedureMobileCarousel({
  procedures,
  badgeEndos,
  badgeCuidare,
  categoryEndos,
  categoryCuidare,
}: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const prefersReduced =
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;

  // ── IntersectionObserver: detect which card is centered ──────────────────
  useEffect(() => {
    const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
    if (cards.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry with the highest intersectionRatio as the "active" one
        let best = -1;
        let bestRatio = -1;
        entries.forEach((entry) => {
          const idx = cards.indexOf(entry.target as HTMLDivElement);
          if (idx !== -1 && entry.intersectionRatio > bestRatio) {
            bestRatio = entry.intersectionRatio;
            best = idx;
          }
        });
        if (best !== -1) setActiveIndex(best);
      },
      {
        root: trackRef.current,
        // threshold array: fire at every 10% step for accurate tracking
        threshold: Array.from({ length: 11 }, (_, i) => i / 10),
      },
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [procedures.length]);

  // ── Dot tap: scroll to card ───────────────────────────────────────────────
  const scrollToCard = useCallback((idx: number) => {
    const card = cardRefs.current[idx];
    if (!card) return;
    card.scrollIntoView({
      behavior: prefersReduced ? 'instant' : 'smooth',
      block: 'nearest',
      inline: 'center',
    });
  }, [prefersReduced]);

  if (procedures.length === 0) return null;

  return (
    <div>
      {/* ── Scroll track ─────────────────────────────────────────────────── */}
      <div
        ref={trackRef}
        className="procedure-mobile-track flex gap-4 overflow-x-auto py-4"
        style={{
          scrollSnapType: 'x mandatory',
          // Side padding so first/last cards can center
          paddingLeft: 'calc((100vw - 85vw) / 2)',
          paddingRight: 'calc((100vw - 85vw) / 2)',
          WebkitOverflowScrolling: 'touch',
        }}
        role="region"
        aria-label="Carrusel de procedimientos"
      >
        {procedures.map((p, i) => (
          <div
            key={p._id}
            ref={(el) => { cardRefs.current[i] = el; }}
            role="group"
            aria-roledescription="tarjeta"
            aria-label={`${i + 1} de ${procedures.length}: ${p.name}`}
          >
            <MobileCard
              {...p}
              badgeEndos={badgeEndos}
              badgeCuidare={badgeCuidare}
              categoryEndos={categoryEndos}
              categoryCuidare={categoryCuidare}
            />
          </div>
        ))}
      </div>

      {/* ── Pagination dots ──────────────────────────────────────────────── */}
      {procedures.length > 1 && (
        <div
          className="flex items-center justify-center gap-2 mt-5"
          role="tablist"
          aria-label="Navegación del carrusel"
        >
          {procedures.map((p, i) => (
            <button
              key={p._id}
              type="button"
              role="tab"
              aria-label={`Ir a ${p.name}`}
              aria-selected={i === activeIndex}
              onClick={() => scrollToCard(i)}
              className={`rounded-full transition-all duration-300 ${
                i === activeIndex
                  ? 'w-6 h-2 bg-teal-soft'
                  : 'w-2 h-2 bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
