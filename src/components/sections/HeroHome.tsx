import { Link } from '@/i18n/navigation';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { parseEmphasis } from '@/lib/parseEmphasis';

const HERO_SRCSET = '/hero/hero-main-750.webp 750w, /hero/hero-main-1280.webp 1280w, /hero/hero-main-1920.webp 1920w';
const HERO_SIZES = '100vw';

type FeatureIcon = 'pulse' | 'heart' | 'shield';

interface Feature {
  icon: FeatureIcon;
  title: string;
  description: string;
}

export interface HeroHomeProps {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  features: [Feature, Feature, Feature];
}

export function HeroHome({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  features,
}: HeroHomeProps) {
  return (
    <section className="relative w-full min-h-[100svh] overflow-visible bg-ink text-white -mt-16 md:-mt-20">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/hero/hero-main-1920.webp"
        srcSet={HERO_SRCSET}
        sizes={HERO_SIZES}
        alt="Médico oncólogo acompañando a un paciente en Onkimia"
        fetchPriority="high"
        decoding="async"
        className="absolute mt-10 inset-0 h-full w-full object-cover [object-position:center_20%] md:[object-position:62%_45%] z-0 hero-ken-burns origin-center"
      />

      {/* Primary overlay: radial gradient — lighter center, darker edges.
          On mobile the image is anchored right so we shift the radial center
          leftward (35% 40%) to keep the subject area lighter while still
          providing enough contrast for the left-aligned text. */}
      <div
        className="absolute inset-0 z-[2] hidden md:block"
        style={{
          background: `radial-gradient(
            ellipse 70% 60% at 50% 40%,
            rgba(26,26,31,0.45) 0%,
            rgba(26,26,31,0.72) 50%,
            rgba(26,26,31,0.88) 100%
          )`,
        }}
        aria-hidden="true"
      />
      {/* Mobile overlay: vertical gradient — light at top to reveal the hands,
          heavy dark at bottom where the text block lives */}
      <div
        className="absolute inset-0 z-[2] md:hidden"
        style={{
          background: `linear-gradient(
            to bottom,
            rgba(26,26,31,0.15) 0%,
            rgba(26,26,31,0.25) 35%,
            rgba(26,26,31,0.65) 60%,
            rgba(26,26,31,0.90) 80%,
            rgba(26,26,31,0.97) 100%
          )`,
        }}
        aria-hidden="true"
      />

      {/* Secondary overlay: bottom vignette — softens lower portion */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background: `linear-gradient(
            to bottom,
            transparent 0%,
            transparent 45%,
            rgba(26,26,31,0.65) 75%,
            rgba(26,26,31,0.90) 100%
          )`,
        }}
      />

      {/* Content — split layout:
          • Eyebrow is top-anchored (stable position in both locales)
          • flex-1 spacer pushes the rest to the bottom
          • Title + description + CTAs + trust strip share one left edge (max-w-2xl)
            so spacing between them is content-driven, not viewport-height-driven */}
      <div className="relative z-10 container-onkimia min-h-[100svh] flex flex-col pb-10 md:pb-14">

        {/* Eyebrow — top-anchored; padding matches the header height */}
        <div className="pt-44">
          <p className="text-[10px] md:text-xs font-medium tracking-widest uppercase text-white/70">
            {eyebrow}
          </p>
        </div>

        {/* Spacer — fixed gap between eyebrow and bottom block */}
        <div className="flex-1" />

        {/* Bottom block — all share max-w-2xl for a single left axis */}
        <div className="max-w-2xl">

          {/* Headline */}
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] text-white mb-5 md:mb-7 md:pt-10">
            {parseEmphasis(title)}
          </h1>

          {/* Description — slightly smaller than before to absorb locale length variance */}
          <p className="text-sm md:text-lg text-white/80 leading-relaxed max-w-lg mb-7 md:mb-9">
            {description}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-5 md:mb-6">
            <Link
              href={primaryCta.href}
              className="inline-flex items-center justify-center gap-2 bg-teal hover:bg-teal-soft text-white px-7 py-3.5 rounded-full transition-all duration-200 ease-in-out hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-teal"
            >
              {primaryCta.label}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href={secondaryCta.href}
              className="inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white text-white px-7 py-3.5 rounded-full transition-all duration-200 ease-in-out hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              {secondaryCta.label}
            </Link>
          </div>

          {/* Trust strip — left-aligned with all other elements */}
          <div className="hidden md:flex flex-wrap items-center gap-y-1">
            {features.map((f, i) => (
              <span key={i} className="flex items-center">
                <span className="text-[10px] md:text-xs tracking-[0.18em] uppercase font-medium text-white/60">
                  {f.title}
                </span>
                {i < features.length - 1 && (
                  <span className="mx-4 w-px h-3 bg-white/25 inline-block" aria-hidden="true" />
                )}
              </span>
            ))}
          </div>

        </div>
      </div>

      {/* Scroll cue — desktop only, pinned to horizontal center of hero */}
      <div className="hidden md:flex absolute bottom-8 left-1/2 -translate-x-1/2 z-10" aria-hidden="true">
        <ChevronDown className="w-5 h-5 text-white/40 animate-bounce" />
      </div>

      {/* Header scroll sentinel — marks the real end of the hero so the
          fixed nav knows exactly when to switch from transparent/white-text
          to solid/dark-text, regardless of this hero's actual height. */}
      <div id="hero-end-sentinel" className="absolute bottom-0 left-0 w-px h-px pointer-events-none" aria-hidden="true" />

    </section>
  );
}
