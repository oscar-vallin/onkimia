import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { parseEmphasis } from '@/lib/parseEmphasis';

interface Cta {
  label: string;
  href: string;
  external?: boolean;
}

export interface PageHeroProps {
  /** Resolved image URL — Sanity CDN string or local /public path */
  imageSrc?: string;
  imageAlt?: string;
  blurDataURL?: string;
  /**
   * Tailwind class for mobile object-position.
   * Default anchors top-center so faces stay visible on portrait crops.
   * Example: 'object-[75%_center]' for a subject on the right.
   */
  mobileObjectPosition?: string;

  eyebrow?: string;
  /** Supports *word* syntax → teal-soft italic emphasis */
  title: string;
  description?: string;

  primaryCta?: Cta;
  secondaryCta?: Cta;

  /** 'left' = text left-aligned (default). 'center' = centered layout. */
  align?: 'left' | 'center';

  /**
   * Slot rendered below the CTA buttons, inside the text column.
   * Use for page-specific content: quotes, booking buttons, badges.
   */
  children?: React.ReactNode;

  /**
   * Full-width slot pinned to the bottom of the section.
   * Use for content that spans the hero width (e.g. stats bar).
   */
  footerSlot?: React.ReactNode;

  /**
   * Slot rendered in the top-right corner of the hero.
   * Use for page-specific badges or secondary branding marks.
   */
  topSlot?: React.ReactNode;
}

export function PageHero({
  imageSrc,
  imageAlt = '',
  blurDataURL,
  mobileObjectPosition = 'object-[center_25%]',
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  align = 'left',
  children,
  footerSlot,
  topSlot,
}: PageHeroProps) {
  const isCenter = align === 'center';

  return (
    <section className="relative w-full min-h-[60vh] md:min-h-[70vh] overflow-hidden bg-ink text-white -mt-16 md:-mt-20 flex flex-col">

      {/* Background image */}
      {imageSrc && (
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={82}
          placeholder={blurDataURL ? 'blur' : 'empty'}
          blurDataURL={blurDataURL}
          className={`object-cover ${mobileObjectPosition} md:object-center z-0 hero-ken-burns origin-center`}
          aria-hidden={imageAlt === ''}
        />
      )}

      {/* Overlay — desktop: dark band on text side; mobile: dark veil at bottom */}
      <div
        className="absolute inset-0 z-[1] hidden md:block"
        style={{
          background: isCenter
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.40) 50%, rgba(0,0,0,0.65) 100%)'
            : 'linear-gradient(to right, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.65) 40%, rgba(0,0,0,0.10) 72%, transparent 100%)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 z-[1] md:hidden"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.25) 35%, rgba(0,0,0,0.78) 62%, rgba(0,0,0,0.92) 100%)',
        }}
        aria-hidden="true"
      />

      {/* Top bar — eyebrow + optional top-right slot */}
      {(eyebrow || topSlot) && (
        <div className={`relative z-10 container-onkimia pt-28 md:pt-36 flex items-start ${topSlot ? 'justify-between' : ''}`}>
          {eyebrow && (
            <p className="text-[10px] tracking-[0.28em] uppercase text-white/60 font-medium">
              {eyebrow}
            </p>
          )}
          {topSlot && (
            <div className="ml-auto">{topSlot}</div>
          )}
        </div>
      )}

      {/* Main content */}
      <div
        className={`relative z-10 container-onkimia flex flex-col flex-1 ${eyebrow || topSlot ? 'pt-8 md:pt-10' : 'pt-28 md:pt-36'} pb-16 md:pb-20 ${isCenter ? 'items-center text-center' : 'items-start'} max-w-3xl ${isCenter ? 'mx-auto' : ''}`}
      >
        {/* Mobile spacer — pushes content to lower third on small screens */}
        <div className="flex-1 md:hidden" aria-hidden="true" />

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] text-balance mb-5">
          {parseEmphasis(title)}
        </h1>

        {description && (
          <p className={`text-base md:text-lg leading-relaxed text-white/75 ${isCenter ? 'max-w-2xl' : 'max-w-xl'} mb-8`}>
            {description}
          </p>
        )}

        {(primaryCta || secondaryCta) && (
          <div className={`flex flex-col sm:flex-row gap-3 mb-8 w-full sm:w-auto ${isCenter ? 'sm:justify-center' : ''}`}>
            {primaryCta && !primaryCta.external && (
              <Link
                href={primaryCta.href}
                className="inline-flex items-center justify-center gap-2 bg-teal hover:bg-teal-soft text-white px-7 py-3.5 rounded-full font-medium transition-all duration-200 hover:scale-[1.02] w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal"
              >
                {primaryCta.label}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            )}
            {primaryCta && primaryCta.external && (
              <a
                href={primaryCta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-teal hover:bg-teal-soft text-white px-7 py-3.5 rounded-full font-medium transition-all duration-200 hover:scale-[1.02] w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal"
              >
                {primaryCta.label}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            )}
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-3.5 font-medium text-white transition-all duration-200 hover:border-white/60 hover:bg-white/5 hover:scale-[1.02] w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                {secondaryCta.label}
              </Link>
            )}
          </div>
        )}

        {/* Page-specific content slot (quotes, booking buttons, etc.) */}
        {children}
      </div>

      {/* Full-width bottom slot (stats bar, etc.) */}
      {footerSlot && (
        <div className="relative z-10 w-full">{footerSlot}</div>
      )}

    </section>
  );
}
