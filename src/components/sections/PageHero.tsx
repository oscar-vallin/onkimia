import { SanityImage } from '@/components/ui/SanityImage';
import { PillButton } from '@/components/ui/PillButton';
import { ArrowRight } from 'lucide-react';
import { parseEmphasis } from '@/lib/parseEmphasis';

export type PageHeroAccent = 'primary' | 'endos' | 'cuidare' | 'doctors';

const ACCENT: Record<PageHeroAccent, { primaryBtn: string }> = {
  primary: {
    primaryBtn: 'bg-primary hover:bg-primary/85 hover:shadow-primary/20 focus-visible:ring-offset-primary',
  },
  endos: {
    primaryBtn: 'bg-endos-teal-700 hover:bg-endos-teal-900 hover:shadow-endos-teal-700/20 focus-visible:ring-offset-endos-teal-700',
  },
  cuidare: {
    primaryBtn: 'bg-cuidare-blue-700 hover:bg-cuidare-blue-900 hover:shadow-cuidare-blue-700/20 focus-visible:ring-offset-cuidare-blue-700',
  },
  doctors: {
    primaryBtn: 'bg-doctors-blue hover:bg-doctors-blue/85 hover:shadow-doctors-blue/20 focus-visible:ring-offset-doctors-blue',
  },
};

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

  /** Sub-brand accent for the primary CTA button. Default: 'primary' (monochromatic). */
  accent?: PageHeroAccent;

  /** Plain text label (default) or custom content (e.g. a sub-brand logo) rendered top-left. */
  eyebrow?: React.ReactNode;
  /** Supports *word* syntax → italic emphasis (Fraunces italic, default). Override via emphasisClassName. */
  title: string;
  /** Override the emphasis class. Default: 'italic' (Fraunces italic). Sub-brands can pass e.g. 'italic text-white/85' or 'text-doctors-blue'. */
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

  /** Override the mobile min-height. Default is 'min-h-[75vh]'. Example: 'min-h-[90vh]' */
  mobileMinHeight?: string;

  /**
   * Adds a bottom-up gradient that fades the hero image to the given CSS color
   * (default white). Use when the section immediately below has a solid background
   * and you want a seamless bleed instead of a hard cut.
   * Example: bottomFade="#f9fafb" for bg-gray-50.
   */
}

export function PageHero({
  imageSrc,
  mobileImageSrc,
  imageAlt = '',
  mobileObjectPosition = 'object-[center_10%]',
  imagePosition = 'md:object-[50%_-20%]',
  accent = 'primary',
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
  mobileMinHeight = 'min-h-[75vh]',
}: PageHeroProps) {
  const isCenter = align === 'center';

  return (
    <section className={`relative w-full ${mobileMinHeight} md:min-h-[70vh] overflow-hidden bg-primary text-white -mt-16 md:-mt-20 flex flex-col`}>

      {/* Hero images are the LCP element (pre-optimized files in /public/heros
          or fully-resolved Sanity CDN URLs), preloaded from each page.tsx with
          media queries mirroring the markup below. */}

      {/* Art direction (desktop + mobile crops): <picture> with <source media>
          fetches ONLY the matched variant. Two <img> tags hidden via CSS would
          both download eagerly on every viewport — display:none does not
          prevent the fetch — doubling the high-priority bytes competing with
          the real LCP image. */}
      {imageSrc && mobileImageSrc ? (
        <picture className="absolute inset-0 z-0">
          <source media="(min-width: 768px)" srcSet={imageSrc} />
          <img
            src={mobileImageSrc}
            alt={imageAlt}
            fetchPriority="high"
            className={`w-full h-full object-cover ${mobileObjectPosition} ${imagePosition} origin-center ${imageClassName ?? ''}`}
            aria-hidden={imageAlt === ''}
          />
        </picture>
      ) : imageSrc ? (
        /* Single image for all viewports */
        <SanityImage
          src={imageSrc}
          alt={imageAlt}
          fill
          loading="eager"
          fetchPriority="high"
          sizes="100vw"
          quality={82}
          className={`object-cover ${mobileObjectPosition} ${imagePosition} z-0 origin-center ${imageClassName ?? ''}`}
          aria-hidden={imageAlt === ''}
        />
      ) : null}

      {/* Overlay — desktop: dark band on text side; mobile: dark veil at bottom */}
      {solidLeftBand ? (
        <>
          {/* Layer 1: solid primary on the left third → seamless blend with section bg-primary */}
          <div
            className="absolute inset-0 z-[1] hidden md:block pointer-events-none"
            style={{ background: 'linear-gradient(to right, var(--color-primary) 0%, var(--color-primary) 28%, transparent 62%)' }}
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
            <div className="text-[10px] tracking-[0.28em] uppercase text-white/60 font-medium">
              {eyebrow}
            </div>
          )}
          {topSlot && (
            <div className="ml-auto">{topSlot}</div>
          )}
        </div>
      )}

      {/* Main content */}
      <div
        className={`relative z-10 t-10 container-onkimia flex flex-col flex-1 ${eyebrow || topSlot ? 'pt-8 md:pt-10' : 'pt-40 md:pt-52'} pb-10 md:pb-20 ${isCenter ? 'items-center text-center' : 'items-start'} max-w-3xl ${isCenter ? 'mx-auto' : ''}`}
      >
        {/* Mobile spacer — pushes content to lower third on small screens */}
        <div className="flex-1 md:hidden" aria-hidden="true" />

        <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05]  whitespace-pre-line">
          {parseEmphasis(title, emphasisClassName)}
        </h1>

        {description && (
          <p className={`text-base md:text-lg pt-6 leading-relaxed text-white/75 ${isCenter ? 'max-w-2xl' : 'max-w-xl'} mb-8`}>
            {description}
          </p>
        )}

        {(primaryCta || secondaryCta) && (
          <div className={`flex flex-col sm:flex-row gap-3 mb-8 w-full sm:w-auto pt-8 ${isCenter ? 'sm:justify-center' : ''}`}>
            {primaryCta && (
              <PillButton
                variant="solid-dark"
                href={primaryCta.href}
                external={primaryCta.external}
                icon={<ArrowRight className="w-4 h-4" aria-hidden="true" />}
                accentClassName={`text-white ${ACCENT[accent].primaryBtn}`}
                className="w-full sm:w-auto transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-white focus-visible:ring-offset-2"
              >
                {primaryCta.label}
              </PillButton>
            )}
            {secondaryCta && (
              <PillButton
                variant="outline-light"
                href={secondaryCta.href}
                className="w-full sm:w-auto transition-all duration-300 ease-out hover:border-white/60 hover:bg-white/5 hover:-translate-y-0.5 focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
              >
                {secondaryCta.label}
              </PillButton>
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
      {/* Bottom fade — blends hero into the next section's background color */}


      <div id="hero-end-sentinel" className="absolute bottom-0 left-0 w-px h-px pointer-events-none" aria-hidden="true" />

    </section>
  );
}
