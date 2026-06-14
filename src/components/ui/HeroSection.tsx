import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { urlFor } from '@/sanity/image';
import type { SanityImageWithLQIP } from '@/sanity/types';

interface Cta {
  label: string;
  href: string;
}

interface HeroSectionProps {
  title: string;
  description?: string;
  image?: SanityImageWithLQIP;
  imageAlt?: string;
  height?: 'sm' | 'md' | 'lg' | 'full';
  // 'light' and 'medium' kept for backward compat — both map to gradient treatment
  overlay?: 'dark' | 'gradient' | 'light' | 'medium';
  eyebrow?: string;
  primaryCta?: Cta;
  secondaryCta?: Cta;
  align?: 'left' | 'center';
  // legacy — ignored in new component, kept to avoid TS errors in callers
  subtitle?: string;
}

const HEIGHTS: Record<NonNullable<HeroSectionProps['height']>, string> = {
  sm:   'min-h-[55svh]',
  md:   'min-h-[70svh]',
  lg:   'min-h-[100svh] md:min-h-[85svh]',
  full: 'min-h-[100svh]',
};

function parseTitle(raw: string) {
  const parts = raw.split(/\*([^*]+)\*/);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <em key={i} className="italic text-teal-soft not-italic">
        {part}
      </em>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export function HeroSection({
  title,
  description,
  image,
  imageAlt = '',
  height = 'lg',
  overlay = 'dark',
  eyebrow,
  primaryCta,
  secondaryCta,
  align = 'left',
}: HeroSectionProps) {
  const isGradient = overlay === 'gradient' || overlay === 'light' || overlay === 'medium';
  const alignClass = align === 'center' ? 'items-center text-center' : 'items-start text-left';

  const imageSrc = image
    ? urlFor(image).width(1920).quality(80).format('webp').url()
    : null;
  const blurDataURL = image?.asset?.metadata?.lqip ?? undefined;

  return (
    <section className={`relative flex ${HEIGHTS[height]} bg-ink overflow-hidden`}>

      {/* Background image */}
      {imageSrc && (
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          quality={80}
          className="object-cover object-top md:object-center"
          placeholder={blurDataURL ? 'blur' : 'empty'}
          blurDataURL={blurDataURL}
        />
      )}

      {/* Overlay */}
      {isGradient ? (
        <>
          {/* Mobile: light veil at top so image shows, heavy dark only at bottom 40% where text is */}
          <div
            className="absolute inset-0 md:hidden"
            style={{ background: 'linear-gradient(to top, rgba(20,30,28,0.97) 0%, rgba(20,30,28,0.75) 38%, rgba(20,30,28,0.15) 65%, rgba(20,30,28,0.05) 100%)' }}
            aria-hidden="true"
          />
          {/* Desktop: dark band on the left where text lives */}
          <div
            className="absolute inset-0 hidden md:block"
            style={{ background: 'linear-gradient(to right, rgba(20,30,28,0.92) 0%, rgba(20,30,28,0.65) 42%, rgba(20,30,28,0.10) 72%, transparent 100%)' }}
            aria-hidden="true"
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-ink/60" aria-hidden="true" />
      )}

      {/* Content */}
      <div className="container-onkimia relative z-10 flex w-full">
        <div
          className={`flex flex-col ${alignClass} w-full max-w-2xl pt-28 pb-14 md:py-24`}
        >
          {/* Mobile: spacer pushes content to bottom third */}
          <div className="flex-1 md:hidden" />

          {/* Title block */}
          <div>
            {eyebrow && (
              <p className="text-xs font-medium tracking-widest uppercase text-white/70 mb-4 md:mb-5">
                {eyebrow}
              </p>
            )}
            <h1 className="font-serif font-normal text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] text-balance">
              {parseTitle(title)}
            </h1>
            {description && (
              <p className="font-sans text-base md:text-lg lg:text-xl leading-relaxed text-white/75 mt-5 max-w-xl">
                {description}
              </p>
            )}
          </div>

          {/* Desktop spacer — pushes CTA to bottom */}
          {(primaryCta || secondaryCta) && (
            <div className="hidden md:block flex-1 min-h-[80px]" />
          )}

          {(primaryCta || secondaryCta) && (
            <div
              className={`flex flex-col sm:flex-row gap-3 mt-8 md:mt-0 w-full sm:w-auto ${
                align === 'center' ? 'sm:justify-center' : ''
              }`}
            >
              {primaryCta && (
                <Link
                  href={primaryCta.href}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-teal px-7 py-3.5 font-sans font-medium text-white transition-all duration-200 hover:bg-teal-soft hover:scale-[1.02] w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal"
                >
                  {primaryCta.label}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              )}
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="inline-flex items-center justify-center rounded-full border border-white/30 px-7 py-3.5 font-sans font-medium text-white transition-all duration-200 hover:border-white/60 hover:bg-white/5 hover:scale-[1.02] w-full sm:w-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                >
                  {secondaryCta.label}
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
