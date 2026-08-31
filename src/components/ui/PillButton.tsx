import type { ReactNode } from 'react';
import { Link } from '@/i18n/navigation';

export type PillVariant = 'solid-light' | 'solid-dark' | 'outline-light' | 'outline-dark';

interface PillButtonProps {
  variant: PillVariant;
  /** When provided, renders an <a> (external) or next-intl Link (internal); otherwise renders <button>. */
  href?: string;
  /** Renders a plain <a target="_blank" rel="noopener noreferrer"> instead of the internal Link. */
  external?: boolean;
  children: ReactNode;
  /** Optional icon rendered after the label (pass <ArrowRight /> etc.). */
  icon?: ReactNode;
  className?: string;
  /**
   * Replaces the variant's bg/hover/focus-ring colors entirely — for sub-brand
   * accent CTAs (see PageHero's ACCENT map) where the color isn't one of the
   * four fixed VARIANT options.
   */
  accentClassName?: string;
}

// Canonical pill size shared by all variants.
// py-3.5 is used across the board — outline variants previously had py-3,
// unified here for consistency (2px taller, negligible visual change).
const BASE =
  'inline-flex items-center justify-center gap-2 ' +
  'font-sans font-medium text-sm px-7 py-3.5 rounded-full ' +
  'transition-colors duration-200 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2';

// Each variant encodes: bg, hover, text, focus ring color.
// ring-offset-color is intentionally omitted and falls back to the browser
// default (white) — acceptable on light bgs. Dark sections look fine with a
// slight offset glow on the focused ring.
const VARIANT: Record<PillVariant, string> = {
  'solid-light':   'bg-white       hover:bg-white/90       text-primary  focus-visible:ring-white    focus-visible:ring-offset-black/30',
  'solid-dark':    'bg-primary     hover:bg-primary/85     text-white    focus-visible:ring-primary',
  'outline-light': 'border border-white/30  hover:border-white/70  text-white    focus-visible:ring-white/50',
  'outline-dark':  'border border-primary/30 hover:border-primary  text-primary  focus-visible:ring-primary',
};

export function PillButton({ variant, href, external, children, icon, className = '', accentClassName }: PillButtonProps) {
  const cls = [BASE, accentClassName ?? VARIANT[variant], className].filter(Boolean).join(' ');
  const content = (
    <>
      {children}
      {icon}
    </>
  );

  if (href && external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
        {content}
      </a>
    );
  }

  if (href) {
    return <Link href={href} className={cls}>{content}</Link>;
  }

  return <button type="button" className={cls}>{content}</button>;
}
