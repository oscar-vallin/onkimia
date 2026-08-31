import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Canonical section header: eyebrow + title + optional intro.
 *
 * THIS IS THE STANDARD — don't re-implement this pattern inline in
 * pages/sections. Canonical base styles; deliberate divergences (titles at
 * lg:text-6xl, sub-brand eyebrows like text-doctors-blue, section palettes
 * like text-ink) are expressed via eyebrowClassName / titleClassName /
 * introClassName, merged with cn() (the override always wins).
 */
interface SectionHeaderProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  /** 'light' = primary/secondary colors; 'dark' = white variants */
  theme?: 'light' | 'dark';
  /** 'center' wraps in a max-w-2xl centered block; 'left' outputs elements inline */
  align?: 'center' | 'left';
  /** Heading level. h1 ONLY when this header opens the page without a hero. */
  as?: 'h1' | 'h2' | 'h3';
  /** Heading id — for sections using aria-labelledby. */
  id?: string;
  /** Extra content rendered after the intro (e.g. a CTA button) */
  children?: ReactNode;
  /** Override the wrapper's bottom margin when needed */
  className?: string;
  eyebrowClassName?: string;
  titleClassName?: string;
  introClassName?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  intro,
  theme = 'light',
  align = 'center',
  as: Heading = 'h2',
  id,
  children,
  className,
  eyebrowClassName,
  titleClassName,
  introClassName,
}: SectionHeaderProps) {
  const isDark = theme === 'dark';
  const isCenter = align === 'center';

  const wrapperClass = cn(
    isCenter && 'text-center max-w-2xl mx-auto mb-14 md:mb-16',
    className
  );

  return (
    <div className={wrapperClass || undefined}>
      {eyebrow && (
        <p
          className={cn(
            'font-sans text-[10px] md:text-xs font-medium tracking-[0.22em] uppercase mb-4',
            isDark ? 'text-white/45' : 'text-secondary',
            eyebrowClassName
          )}
        >
          {eyebrow}
        </p>
      )}
      <Heading
        id={id}
        className={cn(
          'font-serif text-4xl md:text-5xl lg:text-[3.25rem] leading-tight tracking-[-0.02em] mb-5',
          isDark ? 'text-white' : 'text-primary',
          titleClassName
        )}
      >
        {title}
      </Heading>
      {intro && (
        <p
          className={cn(
            'font-sans text-sm md:text-base leading-relaxed',
            children && 'mb-8',
            isDark ? 'text-white/65' : 'text-secondary',
            introClassName
          )}
        >
          {intro}
        </p>
      )}
      {children}
    </div>
  );
}
