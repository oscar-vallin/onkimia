import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { ArrowRight, Activity, Heart, Shield, ChevronDown } from 'lucide-react';
import { urlFor } from '@/sanity/image';
import { parseEmphasis } from '@/lib/parseEmphasis';
import type { SanityImageWithLQIP } from '@/sanity/types';

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
  heroImage?: SanityImageWithLQIP;
}

const ICON_MAP: Record<FeatureIcon, React.ComponentType<{ className?: string }>> = {
  pulse: Activity,
  heart: Heart,
  shield: Shield,
};

export function HeroHome({
  eyebrow,
  title,
  description,
  primaryCta,
  secondaryCta,
  features,
  heroImage,
}: HeroHomeProps) {
  const imageSrc = heroImage
    ? urlFor(heroImage).width(1920).height(1080).format('webp').quality(80).url()
    : '/images/hero-poster.jpg';
  const blurDataURL = heroImage?.asset?.metadata?.lqip ?? undefined;

  return (
    <section className="relative w-full min-h-[100svh] overflow-visible bg-ink text-white -mt-16 md:-mt-20">
      {/* Ken Burns — applied directly on <Image> so Next.js emits fetchpriority="high" */}
      <Image
        src={imageSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        quality={80}
        placeholder={blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        className="object-cover object-[70%_center] md:object-center z-0 hero-ken-burns origin-center"
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
      <div className="relative z-10 container-onkimia min-h-[100svh] flex flex-col">

        {/* Bloque superior — headline + desc + CTAs (desktop) */}
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
          {/* CTAs — visible on sm+ only; mobile gets its own anchored block below */}
          <div className="hidden sm:flex flex-row gap-4 mt-10">
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
        </div>

        {/* CTAs mobile — anchored to bottom of viewport */}
        <div className="mt-auto mb-8 flex flex-col gap-3 sm:hidden">
          <Link
            href={primaryCta.href}
            className="inline-flex items-center justify-center gap-2 bg-teal hover:bg-teal-soft text-white px-7 py-3.5 rounded-full transition-all duration-200 ease-in-out hover:scale-[1.02] w-full"
          >
            {primaryCta.label}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
          <Link
            href={secondaryCta.href}
            className="inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white text-white px-7 py-3.5 rounded-full transition-all duration-200 ease-in-out hover:scale-[1.02] w-full"
          >
            {secondaryCta.label}
          </Link>
          {/* Scroll cue — mobile */}
          <div className="flex justify-center pt-2" aria-hidden="true">
            <ChevronDown className="w-5 h-5 text-white/40 animate-bounce" />
          </div>
        </div>

        {/* Feature pills + scroll cue — desktop only, anchored to bottom */}
        <div className="mb-10 hidden md:flex flex-col gap-6 md:mt-auto">
          <div className="grid grid-cols-3 gap-8 max-w-5xl">
            {features.map((f, i) => {
              const Icon = ICON_MAP[f.icon];
              return (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 text-teal-soft flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-white mb-1">{f.title}</h3>
                    <p className="text-sm text-white/70 leading-relaxed">{f.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
          {/* Scroll cue */}
          <div className="flex justify-center" aria-hidden="true">
            <ChevronDown className="w-5 h-5 text-white/40 animate-bounce" />
          </div>
        </div>

      </div>
    </section>
  );
}
