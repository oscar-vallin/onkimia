import type { ReactNode } from 'react';

// Theme → background mapping.
// Use 'white' and 'gray' to alternate light sections (they sit at different
// luminance levels so the eye reads them as distinct bands).
// 'dark' = bg-primary (#27272c), 'deeper' = bg-deep (#0d1117).
const BG: Record<SectionTheme, string> = {
  white:  'bg-white',
  gray:   'bg-gray-50',
  dark:   'bg-primary',
  deeper: 'bg-deep',
};

export type SectionTheme = 'white' | 'gray' | 'dark' | 'deeper';

interface SectionProps {
  theme?: SectionTheme;
  /** Canonical vertical rhythm: py-20 md:py-28 on every section. */
  children: ReactNode;
  /** Adds overflow-hidden to the <section> shell. */
  overflow?: boolean;
  /** Extra classes on the <section> element (e.g. -mt-16 for hero overlap). */
  className?: string;
}

/**
 * Shell for every home/page section.
 * Provides: bg color, canonical py, and the content container
 * (container-onkimia max-w-6xl mx-auto).
 *
 * For sections whose content must bleed past the container (e.g. a full-width
 * marquee), do NOT use this component — keep the shell and container manual
 * so the bleed can be placed between two container divs.
 */
export function Section({ theme = 'white', children, overflow = false, className }: SectionProps) {
  const sectionClass = [
    BG[theme],
    'py-20 md:py-28',
    overflow ? 'overflow-hidden' : '',
    className ?? '',
  ].filter(Boolean).join(' ');

  return (
    <section className={sectionClass}>
      <div className="container-onkimia max-w-6xl mx-auto">
        {children}
      </div>
    </section>
  );
}
