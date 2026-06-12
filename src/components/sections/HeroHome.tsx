import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { ArrowRight, Activity, Heart, Shield } from 'lucide-react';
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
    <section className="relative w-full min-h-screen overflow-hidden bg-ink text-white -mt-16 md:-mt-20">
      {/* Hero image — LCP, siempre visible */}
      <Image
        src={imageSrc}
        alt=""
        fill
        priority
        sizes="100vw"
        quality={80}
        placeholder={blurDataURL ? 'blur' : 'empty'}
        blurDataURL={blurDataURL}
        className="object-cover z-0"
      />

      {/* Overlay */}
      <div className="absolute inset-0 z-[2] bg-gradient-to-b from-ink/55 via-ink/65 to-ink/78" />

      {/* Contenido */}
      <div className="relative z-10 container-onkimia min-h-screen flex flex-col">
        {/* Bloque superior */}
        <div className="pt-36 md:pt-44 max-w-3xl">
          <p className="text-xs font-medium tracking-widest uppercase text-teal-soft mb-6">
            {eyebrow}
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] text-white text-balance">
            {parseEmphasis(title)}
          </h1>
          <p className="hidden md:block text-lg md:text-xl text-white/80 leading-relaxed max-w-xl mt-6">
            {description}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-8 md:mt-10">
            <Link
              href={primaryCta.href}
              className="inline-flex items-center justify-center gap-2 bg-teal hover:bg-teal-soft text-white px-7 py-3.5 rounded-full transition-colors w-full sm:w-auto"
            >
              {primaryCta.label}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
            <Link
              href={secondaryCta.href}
              className="inline-flex items-center justify-center gap-2 border border-white/30 hover:border-white text-white px-7 py-3.5 rounded-full transition-colors w-full sm:w-auto"
            >
              {secondaryCta.label}
            </Link>
          </div>
        </div>

        {/* Feature pills — desktop only, anclado al fondo */}
        <div className="mt-auto mb-12 hidden md:grid grid-cols-3 gap-8 max-w-5xl">
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
      </div>
    </section>
  );
}
