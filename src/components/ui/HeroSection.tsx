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
  sm:   'min-h-[50svh]',
  md:   'min-h-[65svh]',
  lg:   'min-h-[85svh]',
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
    ? urlFor(image).width(2400).quality(80).format('webp').url()
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
          className="object-cover"
          placeholder={blurDataURL ? 'blur' : 'empty'}
          blurDataURL={blurDataURL}
        />
      )}

      {/* Overlay */}
      {isGradient ? (
        <>
          <div className="absolute inset-0 bg-ink/30" aria-hidden="true" />
          <div
            className="absolute inset-0 bg-gradient-to-t from-ink via-ink/55 to-ink/15 md:hidden"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 hidden md:block bg-gradient-to-r from-ink/90 via-ink/50 to-ink/10"
            aria-hidden="true"
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-ink/60" aria-hidden="true" />
      )}

      {/* Content */}
      <div className="container-onkimia relative z-10 flex w-full">
        <div
          className={`flex flex-col justify-end md:justify-center ${alignClass} w-full max-w-3xl pb-14 pt-32 md:py-32`}
        >
          {eyebrow && (
            <p className="text-xs font-medium tracking-widest uppercase text-white/90 mb-5 md:mb-6">
              {eyebrow}
            </p>
          )}

          <h1 className="font-serif font-normal text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] text-balance">
            {parseTitle(title)}
          </h1>

          {description && (
            <p className="font-sans text-lg md:text-xl leading-relaxed text-white/80 mt-6 max-w-xl">
              {description}
            </p>
          )}

          {(primaryCta || secondaryCta) && (
            <div
              className={`flex flex-col sm:flex-row gap-4 mt-9 md:mt-10 w-full sm:w-auto ${
                align === 'center' ? 'sm:justify-center' : ''
              }`}
            >
              {primaryCta && (
                <Link
                  href={primaryCta.href}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-teal px-8 py-4 font-sans font-medium text-white transition-all duration-200 ease-in-out hover:bg-teal-soft hover:scale-[1.02] w-full sm:w-auto"
                >
                  {primaryCta.label}
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Link>
              )}
              {secondaryCta && (
                <Link
                  href={secondaryCta.href}
                  className="inline-flex items-center justify-center rounded-full border border-white/30 px-8 py-4 font-sans font-medium text-white transition-all duration-200 ease-in-out hover:border-white/60 hover:bg-white/5 hover:scale-[1.02] w-full sm:w-auto"
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
