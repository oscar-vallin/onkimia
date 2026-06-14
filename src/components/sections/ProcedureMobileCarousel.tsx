'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import type { Procedure } from '@/sanity/types';
import Image from 'next/image';
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
  const blur = image?.asset?.metadata?.lqip ?? undefined;

  return (
    // scroll-snap-align on the card itself; width = 85vw so the next card peeks
    <div
      className="relative rounded-3xl overflow-hidden bg-[#1a2420] flex-shrink-0"
      style={{ width: '85vw', height: '580px', scrollSnapAlign: 'center' }}
    >
      {/* Layer 1 — blurred bg */}
      {cardSrc && (
        <Image
          src={cardSrc}
          alt=""
          fill
          sizes="85vw"
          loading="lazy"
          placeholder={blur ? 'blur' : 'empty'}
          blurDataURL={blur}
          className="object-cover scale-110 blur-xl opacity-60"
          aria-hidden="true"
        />
      )}
      {/* Layer 2 — full image */}
      {cardSrc && (
        <Image
          src={cardSrc}
          alt={name}
          fill
          sizes="85vw"
          loading="lazy"
          placeholder={blur ? 'blur' : 'empty'}
          blurDataURL={blur}
          className="object-contain"
        />
      )}
      {/* Scrim */}
      <div
        className="absolute inset-0"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.50) 0%, rgba(0,0,0,0.0) 30%, rgba(0,0,0,0.0) 60%, rgba(0,0,0,0.60) 100%)' }}
        aria-hidden="true"
      />
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10">
        {hasDuration ? (
          <div className="grid grid-cols-2 divide-x divide-white/25">
            <div className="px-5 pt-5 pb-4">
              <div className="font-serif text-4xl text-white leading-none">{durationNum}</div>
              {unitStr && <div className="text-[10px] text-white/55 mt-1 uppercase tracking-wider">{unitStr}</div>}
            </div>
            <div className="px-5 pt-5 pb-4">
              <div className="text-sm font-medium text-white leading-snug">{name}</div>
              <div className="text-[11px] text-white/55 mt-1">
                {submark === 'Endos' ? categoryEndos : categoryCuidare}
              </div>
            </div>
          </div>
        ) : (
          <div className="px-5 pt-5 pb-4">
            <div className="text-sm font-medium text-white leading-snug">{name}</div>
            <div className="text-[11px] text-white/55 mt-1">
              {submark === 'Endos' ? categoryEndos : categoryCuidare}
            </div>
          </div>
        )}
        <div className="h-px bg-white/25" />
      </div>
      {/* Footer */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <div className="h-px bg-white/25" />
        <div className="px-5 py-4">
          <span className="inline-flex items-center text-[9px] tracking-wider uppercase font-semibold text-white bg-teal/70 backdrop-blur-sm rounded-full px-3 py-1 mb-2">
            {submark === 'Endos' ? badgeEndos : badgeCuidare}
          </span>
          <p className="text-xs text-white/85 leading-relaxed line-clamp-2">{shortDescription}</p>
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
