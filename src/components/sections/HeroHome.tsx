import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { parseEmphasis } from '@/lib/parseEmphasis';

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
      <Image
        src="/hero/hero-main.jpg"
        alt="Médico oncólogo acompañando a un paciente en Onkimia"
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        quality={85}
        placeholder="empty"
        className="object-cover [object-position:65%_center] md:object-center z-0 hero-ken-burns origin-center"
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
      {/* Mobile overlay: linear gradient — heavy dark on left where text lives,
          lighter on right to let the doctor/patient scene breathe */}
      <div
        className="absolute inset-0 z-[2] md:hidden"
        style={{
          background: `linear-gradient(
            to right,
            rgba(26,26,31,0.92) 0%,
            rgba(26,26,31,0.70) 45%,
            rgba(26,26,31,0.40) 100%
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

      {/* Contenido */}
      <div className="relative z-10 container-onkimia min-h-[100svh] flex flex-col pb-10">

        {/* Top block — eyebrow + title + description */}
        <div className="pt-36 md:pt-44 max-w-3xl">
          <p className="text-xs font-medium tracking-widest uppercase text-white/90 mb-8 md:mb-10">
            {eyebrow}
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] text-white text-balance">
            {parseEmphasis(title)}
          </h1>
          <p className="hidden md:block text-lg md:text-xl text-white/80 leading-relaxed max-w-xl mt-6">
            {description}
          </p>
        </div>

        {/* Spacer — pushes bottom block to viewport bottom */}
        <div className="flex-1" />

        {/* Bottom block — trust strip + CTAs, shared across breakpoints */}
        <div className="flex flex-col gap-6">

          {/* Trust strip — desktop: inline labels separated by dots; mobile: hidden */}
          <div className="hidden md:flex items-center gap-0 text-white/60">
            {features.map((f, i) => (
              <span key={i} className="flex items-center">
                <span className="text-xs tracking-[0.18em] uppercase font-medium text-white/70">
                  {f.title}
                </span>
                {i < features.length - 1 && (
                  <span className="mx-5 w-px h-3 bg-white/25 inline-block" aria-hidden="true" />
                )}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
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

          {/* Scroll cue */}
          <div className="flex justify-center md:justify-start" aria-hidden="true">
            <ChevronDown className="w-5 h-5 text-white/40 animate-bounce" />
          </div>

        </div>

      </div>
    </section>
  );
}
