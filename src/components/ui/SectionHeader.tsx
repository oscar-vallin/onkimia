import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

/**
 * Header canónico de sección: eyebrow + título + intro opcional.
 *
 * ES EL ESTÁNDAR — no re-escribas este patrón inline en páginas/secciones.
 * Estilos base canónicos; las divergencias deliberadas (títulos lg:text-6xl,
 * eyebrows de sub-marca como text-doctors-blue, paletas de sección como
 * text-ink) se expresan con eyebrowClassName / titleClassName /
 * introClassName, que se mergean con cn() (el override siempre gana).
 */
interface SectionHeaderProps {
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  /** 'light' = primary/secondary colors; 'dark' = white variants */
  theme?: 'light' | 'dark';
  /** 'center' wraps in a max-w-2xl centered block; 'left' outputs elements inline */
  align?: 'center' | 'left';
  /** Nivel de heading. h1 SOLO cuando este header abre la página sin hero. */
  as?: 'h1' | 'h2' | 'h3';
  /** id del heading — para secciones con aria-labelledby. */
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
