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
  /** Optional portrait-oriented image served only on mobile (< md). When set,
   *  the component renders two <Image> layers and swaps them via CSS. */
  mobileImageSrc?: string;
  imageAlt?: string;
  blurDataURL?: string;
  /**
   * Tailwind class for mobile object-position.
   * Default anchors top-center so faces stay visible on portrait crops.
   * Example: 'object-[75%_center]' for a subject on the right.
   */
  mobileObjectPosition?: string;
  /**
   * Tailwind class for desktop (md+) object-position.
   * Default 'md:object-[50%_25%]' biases the focal point toward the upper
   * area of the frame, giving headroom so subjects' heads aren't clipped.
   * Override per page when the image composition needs a different anchor
   * (e.g. a landscape/architectural shot vs. a portrait team photo).
   */
  imagePosition?: string;

  eyebrow?: string;
  /** Supports *word* syntax → teal-soft italic emphasis */
  title: string;
  /** Override the emphasis color class. Default: 'text-teal-soft' */
  emphasisClassName?: string;
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

  /**
   * Adds a uniform low-opacity dark wash across the whole image, on top of
   * the existing directional/text-side gradients. Off by default — opt in
   * for specific source photos with bright/blown-out areas (e.g. overhead
   * lighting) that need dampening to match the site's darker hero mood.
   */
  extraDim?: boolean;

  /**
   * Extra Tailwind classes applied directly to the hero <img> element.
   * Use to add per-page offsets (e.g. "md:mt-20") when the subject's head
   * is clipped by the section's negative-margin overlap with the navbar.
   */
  imageClassName?: string;

  /**
   * When true, replaces the default desktop directional gradient with a
   * solid-left-band overlay: #1a1a1f solid for the leftmost ~28%, fading
   * to transparent by ~62%. Creates a seamless dark zone for text on photos
   * where the subject is centered and the default gradient doesn't darken
   * enough. Mobile keeps the standard bottom-up veil.
   */
  solidLeftBand?: boolean;
}

export function PageHero({
  imageSrc,
  mobileImageSrc,
  imageAlt = '',
  blurDataURL,
  mobileObjectPosition = 'object-[center_10%]',
  imagePosition = 'md:object-[50%_-20%]',
  eyebrow,
  title,
  emphasisClassName,
  description,
  primaryCta,
  secondaryCta,
  align = 'left',
  children,
  footerSlot,
  topSlot,
  extraDim = false,
  imageClassName,
  solidLeftBand = false,
}: PageHeroProps) {
  const isCenter = align === 'center';

  return (
    <section className="relative w-full min-h-[75vh] md:min-h-[70vh] overflow-hidden bg-ink text-white -mt-16 md:-mt-20 flex flex-col ">

      {/* Desktop image — hidden on mobile when a mobile variant is provided */}
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
          className={`object-cover ${mobileImageSrc ? 'hidden md:block' : mobileObjectPosition} ${imagePosition} z-0 origin-center ${imageClassName ?? ''}`}
          aria-hidden={imageAlt === ''}
        />
      )}

      {/* Mobile image — portrait crop, only shown below md */}
      {mobileImageSrc && (
        <Image
          src={mobileImageSrc}
          alt={imageAlt}
          fill
          priority
          fetchPriority="high"
          sizes="100vw"
          quality={82}
          className={`object-cover md:hidden ${mobileObjectPosition} z-0 origin-center`}
          aria-hidden={imageAlt === ''}
        />
      )}

      {/* Overlay — desktop: dark band on text side; mobile: dark veil at bottom */}
      {solidLeftBand ? (
        <>
          {/* Layer 1: solid ink on the left third → invisible seam with bg-ink */}
          <div
            className="absolute inset-0 z-[1] hidden md:block pointer-events-none"
            style={{ background: 'linear-gradient(to right, #1a1a1f 0%, #1a1a1f 28%, transparent 62%)' }}
            aria-hidden="true"
          />
          {/* Layer 2: soft scrim to feather the transition */}
          <div
            className="absolute inset-0 z-[1] hidden md:block pointer-events-none"
            style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.4) 42%, transparent 70%)' }}
            aria-hidden="true"
          />
          {/* Mobile: bottom-up veil (subject stays visible) */}
          <div
            className="absolute inset-0 z-[1] md:hidden pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.25) 35%, rgba(0,0,0,0.78) 62%, rgba(0,0,0,0.92) 100%)' }}
            aria-hidden="true"
          />
        </>
      ) : (
        <>
          <div
            className="absolute inset-0 z-[1] hidden md:block"
            style={{
              background: isCenter
                ? 'linear-gradient(to bottom, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.50) 50%, rgba(0,0,0,0.72) 100%)'
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
        </>
      )}

      {/* Top fade — keeps logo/nav legible over any image brightness */}
      <div
        className="absolute inset-x-0 top-0 h-32 md:h-40 z-[1] pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 100%)' }}
        aria-hidden="true"
      />

      {/* Text scrim — extra local darkening behind the headline for authority/contrast */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background: isCenter
            ? 'radial-gradient(ellipse 70% 60% at 50% 62%, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 75%)'
            : 'radial-gradient(ellipse 60% 65% at 18% 62%, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 72%)',
        }}
        aria-hidden="true"
      />

      {/* Ambient dim — uniform wash to dampen bright/blown-out source photos
          (e.g. overhead lighting), opt-in per page, on top of all other overlays */}
      {extraDim && (
        <div className="absolute inset-0 z-[1] bg-black/25 pointer-events-none" aria-hidden="true" />
      )}

      {/* Top bar — eyebrow + optional top-right slot */}
      {(eyebrow || topSlot) && (
        <div className={`relative z-10 container-onkimia mt-3 md:mt-0  pt-32 md:pt-44 flex ${topSlot ? 'items-center justify-between' : 'items-start'}`}>
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
        className={`relative z-10  container-onkimia flex flex-col flex-1 ${eyebrow || topSlot ? 'pt-8 md:pt-10' : 'pt-40 md:pt-52'} pb-10 md:pb-20 ${isCenter ? 'items-center text-center' : 'items-start'} max-w-3xl ${isCenter ? 'mx-auto' : ''}`}
      >
        {/* Mobile spacer — pushes content to lower third on small screens */}
        <div className="flex-1 md:hidden" aria-hidden="true" />

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] mb-5 whitespace-pre-line">
          {parseEmphasis(title, emphasisClassName)}
        </h1>

        {description && (
          <p className={`text-base md:text-lg pt-6 leading-relaxed text-white/75 ${isCenter ? 'max-w-2xl' : 'max-w-xl'} mb-8`}>
            {description}
          </p>
        )}

        {(primaryCta || secondaryCta) && (
          <div className={`flex flex-col sm:flex-row gap-3 mb-8 w-full sm:w-auto pt-8 ${isCenter ? 'sm:justify-center' : ''}`}>
            {primaryCta && !primaryCta.external && (
              <Link
                href={primaryCta.href}
                className="inline-flex items-center justify-center gap-2 bg-teal hover:bg-teal-soft text-white px-7 py-3.5 rounded-full font-medium transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal/30 w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal"
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
                className="inline-flex items-center justify-center gap-2 bg-teal hover:bg-teal-soft text-white px-7 py-3.5 rounded-full font-medium transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal/30 w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal"
              >
                {primaryCta.label}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            )}
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-3.5 font-medium text-white transition-all duration-300 ease-out hover:border-white/60 hover:bg-white/5 hover:-translate-y-0.5 w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
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

      {/* Header scroll sentinel — marks the real end of the hero so the
          fixed nav knows exactly when to switch from transparent/white-text
          to solid/dark-text, regardless of this hero's actual height. */}
      <div id="hero-end-sentinel" className="absolute bottom-0 left-0 w-px h-px pointer-events-none" aria-hidden="true" />

    </section>
  );
}
