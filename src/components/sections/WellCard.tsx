'use client';

import { useState } from 'react';
import type { WellbeingItem, WellIconName } from './Wellness';

const ICON_MAP_LAZY: Record<WellIconName, string> = {
  'sparkles': 'sparkles', 'zap': 'zap', 'heart': 'heart',
  'shopping-bag': 'shopping-bag', 'bar-chart': 'bar-chart',
  'lightbulb': 'lightbulb', 'dna': 'dna', 'activity': 'activity',
};

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

  return (
    <article
      className={[
        'group relative rounded-2xl overflow-hidden p-7 md:p-8',
        'border border-white/[0.10]',
        'bg-white/[0.05]',
        // Desktop hover effects — pointer devices only
        '[@media(hover:hover)]:transition-all [@media(hover:hover)]:duration-300 [@media(hover:hover)]:ease-out',
        '[@media(hover:hover)]:hover:bg-white/[0.10]',
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
      {/* Icon circle */}
      <div className="w-11 h-11 rounded-full border border-white/20 flex items-center justify-center text-white mb-5 shrink-0">
        {iconNode(item.icon)}
      </div>

      {/* Title + mobile expand indicator */}
      <div className="flex items-start justify-between gap-2 mb-4">
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
      <div className="border-t border-white/[0.10] mb-4" aria-hidden="true" />

      {/*
        Description — dual behavior:
        · Desktop (hover:hover): CSS group-hover reveal — unchanged.
        · Mobile (hover:none): hidden by default, shown when `expanded` is true.
          Content always in DOM → screen readers can always access it.
        · prefers-reduced-motion: transitions suppressed by global rule in globals.css.
      */}
      <p
        className={[
          'font-sans text-sm text-white/60 leading-relaxed',
          // Desktop: CSS group-hover reveal (unchanged)
          '[@media(hover:hover)]:max-h-0 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:overflow-hidden',
          '[@media(hover:hover)]:transition-[max-height,opacity] [@media(hover:hover)]:duration-300 [@media(hover:hover)]:ease-out',
          '[@media(hover:hover)]:group-hover:max-h-40 [@media(hover:hover)]:group-hover:opacity-100',
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
