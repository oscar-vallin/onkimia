'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { WellbeingItem, WellIconName } from './Wellness';

// Local /public photos — one per wellbeing item, matched by icon (stable
// across es/en) rather than by title text.
const WELL_IMAGES: Record<WellIconName, string> = {
  'sparkles':     '/bienestar_integral/TECNICA_DE_RELJACION.png',
  'zap':          '/bienestar_integral/FISIOTERAPIA.png',
  'heart':        '/bienestar_integral/TERAPIA_PSICOLOGICA.png',
  'shopping-bag': '/bienestar_integral/BOUTIQUE_ONCOLOGICA.png',
  'bar-chart':    '/bienestar_integral/NUTRICION_CLINICA.png',
  'lightbulb':    '/bienestar_integral/PRUEBAS_GENOMICAS.png',
  'dna':          '/bienestar_integral/PRUEBAS_GENOMICAS.png',
  'activity':     '/bienestar_integral/FISIOTERAPIA.png',
};

function wellImage(name: WellIconName | string): string | undefined {
  return WELL_IMAGES[name as WellIconName];
}

// Re-import only what we need client-side for the icon render.
// The parent server component passes the icon name string.
import {
  Sparkles, Zap, Heart, ShoppingBag, BarChart2, Lightbulb, Dna, Activity,
} from 'lucide-react';
import type { ReactNode } from 'react';

const ICON_NODES: Record<WellIconName, ReactNode> = {
  'sparkles':     <Sparkles    className="w-5 h-5" aria-hidden="true" />,
  'zap':          <Zap         className="w-5 h-5" aria-hidden="true" />,
  'heart':        <Heart       className="w-5 h-5" aria-hidden="true" />,
  'shopping-bag': <ShoppingBag className="w-5 h-5" aria-hidden="true" />,
  'bar-chart':    <BarChart2   className="w-5 h-5" aria-hidden="true" />,
  'lightbulb':    <Lightbulb   className="w-5 h-5" aria-hidden="true" />,
  'dna':          <Dna         className="w-5 h-5" aria-hidden="true" />,
  'activity':     <Activity    className="w-5 h-5" aria-hidden="true" />,
};

function iconNode(name: WellIconName | string): ReactNode {
  return ICON_NODES[name as WellIconName] ?? ICON_NODES['sparkles'];
}

export function WellCard({ item }: { item: WellbeingItem }) {
  // Mobile-only toggle — desktop relies purely on CSS group-hover (unchanged).
  const [expanded, setExpanded] = useState(false);
  const imageSrc = wellImage(item.icon);

  return (
    <article
      className={[
        'group relative rounded-2xl overflow-hidden p-7 md:p-8',
        'min-h-[320px] md:min-h-[380px]',
        'border border-white/[0.10]',
        'bg-white/[0.05]',
        // Desktop hover effects — pointer devices only
        '[@media(hover:hover)]:transition-all [@media(hover:hover)]:duration-300 [@media(hover:hover)]:ease-out',
        '[@media(hover:hover)]:hover:-translate-y-1',
        // Mobile: make the whole card tappable
        '[@media(hover:none)]:cursor-pointer',
      ].join(' ')}
      // Toggle only fires on touch/no-hover devices — pointer devices ignore it
      // because they use CSS group-hover instead.
      onClick={() => setExpanded((v) => !v)}
      // Keyboard accessible
      role="button"
      tabIndex={0}
      aria-expanded={expanded}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setExpanded((v) => !v); } }}
    >
      {/* Background photo — sits behind all content, zooms in slightly on
          hover/expand for a bit of polish. A dark gradient on top keeps the
          icon/title/description legible regardless of the photo's own
          brightness. */}
      {imageSrc && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src={imageSrc}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={[
              'object-cover transition-transform duration-500 ease-out',
              '[@media(hover:hover)]:group-hover:scale-105',
              expanded ? 'scale-105' : '',
            ].join(' ')}
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/55 to-black/25" aria-hidden="true" />
        </div>
      )}

      {/* Icon circle */}
      <div className="relative z-10 w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white mb-5 shrink-0 bg-black/10">
        {iconNode(item.icon)}
      </div>

      {/* Title + mobile expand indicator */}
      <div className="relative z-10 flex items-start justify-between gap-2 mb-4">
        <h3 className="font-serif text-lg md:text-xl text-white leading-snug tracking-[-0.01em]">
          {item.title}
        </h3>
        {/* "+" / "−" visible only on touch/no-hover devices */}
        <span
          className="[@media(hover:hover)]:hidden shrink-0 mt-1 w-5 h-5 rounded-full border border-white/30 flex items-center justify-center text-white/60 text-xs leading-none select-none"
          aria-hidden="true"
        >
          {expanded ? '−' : '+'}
        </span>
      </div>

      {/* Divider */}
      <div className="relative z-10 border-t border-white/[0.15] mb-4" aria-hidden="true" />

      {/*
        Description — dual behavior:
        · Desktop (hover:hover): CSS group-hover reveal — unchanged.
        · Mobile (hover:none): hidden by default, shown when `expanded` is true.
          Content always in DOM → screen readers can always access it.
        · prefers-reduced-motion: transitions suppressed by global rule in globals.css.
      */}
      <p
        className={[
          'relative z-10 font-sans text-sm text-white/70 leading-relaxed',
          // Desktop: CSS group-hover reveal (unchanged) — larger type than the
          // mobile expand state, which keeps text-sm.
          '[@media(hover:hover)]:text-base',
          '[@media(hover:hover)]:max-h-0 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:overflow-hidden',
          '[@media(hover:hover)]:transition-[max-height,opacity] [@media(hover:hover)]:duration-300 [@media(hover:hover)]:ease-out',
          '[@media(hover:hover)]:group-hover:max-h-48 [@media(hover:hover)]:group-hover:opacity-100',
          // Mobile: JS-driven expand
          '[@media(hover:none)]:transition-[max-height,opacity] [@media(hover:none)]:duration-300 [@media(hover:none)]:ease-out [@media(hover:none)]:overflow-hidden',
          expanded
            ? '[@media(hover:none)]:max-h-40 [@media(hover:none)]:opacity-100'
            : '[@media(hover:none)]:max-h-0 [@media(hover:none)]:opacity-0',
        ].join(' ')}
      >
        {item.description}
      </p>
    </article>
  );
}
