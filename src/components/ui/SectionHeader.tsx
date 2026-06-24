import type { ReactNode } from 'react';

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  intro?: string;
  /** 'light' = primary/secondary colors; 'dark' = white variants */
  theme?: 'light' | 'dark';
  /** 'center' wraps in a max-w-2xl centered block; 'left' outputs elements inline */
  align?: 'center' | 'left';
  /** Extra content rendered after the intro (e.g. a CTA button) */
  children?: ReactNode;
  /** Override the wrapper's bottom margin when needed */
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  intro,
  theme = 'light',
  align = 'center',
  children,
  className,
}: SectionHeaderProps) {
  const isDark = theme === 'dark';
  const isCenter = align === 'center';

  const wrapperClass = [
    isCenter ? 'text-center max-w-2xl mx-auto mb-14 md:mb-16' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClass || undefined}>
      {eyebrow && (
        <p className={`font-sans text-[10px] md:text-xs font-medium tracking-[0.22em] uppercase mb-4 ${isDark ? 'text-white/45' : 'text-secondary'}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`font-serif text-4xl md:text-5xl lg:text-[3.25rem] leading-tight tracking-[-0.02em] mb-5 ${isDark ? 'text-white' : 'text-primary'}`}>
        {title}
      </h2>
      {intro && (
        <p className={`font-sans text-sm md:text-base leading-relaxed ${children ? 'mb-8' : ''} ${isDark ? 'text-white/65' : 'text-secondary'}`}>
          {intro}
        </p>
      )}
      {children}
    </div>
  );
}
