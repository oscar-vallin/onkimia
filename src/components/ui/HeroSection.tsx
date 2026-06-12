import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { urlFor } from '@/sanity/image';
import type { SanityImageWithLQIP as SanityImage } from '@/sanity/types';
import { DecorativeBubbles } from './DecorativeBubbles';

interface HeroSectionProps {
  image?: SanityImage;
  title: string;
  subtitle?: string;
  description?: string;
  align?: 'center' | 'left';
  height?: 'sm' | 'md' | 'lg';
  overlay?: 'light' | 'medium' | 'dark';
  primaryCta?: {
    label: string;
    href: string;
  };
}

export function HeroSection({
  image,
  title,
  subtitle,
  description,
  height = 'lg',
  overlay = 'medium',
  primaryCta,
}: HeroSectionProps) {
  const heightClasses = {
    sm: 'min-h-[380px] md:min-h-[480px]',
    md: 'min-h-[420px] md:min-h-[520px]',
    lg: 'min-h-[440px] md:min-h-[550px]',
  };

  // Overlay responsive: vertical en mobile (texto centrado), lateral en desktop (texto a la izquierda)
  const overlayClasses = {
    light: 'bg-gradient-to-b from-ink/70 via-ink/40 to-ink/65 md:bg-gradient-to-r md:from-ink/60 md:via-ink/30 md:to-transparent',
    medium: 'bg-gradient-to-b from-ink/85 via-ink/70 to-ink/80 md:bg-gradient-to-r md:from-ink/80 md:via-ink/55 md:to-transparent',
    dark: 'bg-gradient-to-b from-ink/90 via-ink/70 to-ink/90 md:bg-gradient-to-r md:from-ink/90 md:via-ink/70 md:to-transparent',
  };

  return (
    <section className={`relative w-full ${heightClasses[height]} overflow-hidden`}>
      {/* Background Image */}
      {image ? (
        <Image
          src={urlFor(image).url()}
          alt={title}
          fill
          sizes="100vw"
          priority
          quality={75}
          placeholder={image.asset?.metadata?.lqip ? 'blur' : 'empty'}
          blurDataURL={image.asset?.metadata?.lqip}
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-ink to-ink-2" />
      )}

      {/* Overlay responsive */}
      <div  />

      {/* Burbujas decorativas */}
      <DecorativeBubbles variant="sides" opacity={0.6} />

      {/* Content — centrado en mobile, izquierda en desktop */}
      <div className="relative h-full container-onkimia flex flex-col justify-center items-center text-center md:items-start md:text-left text-white pt-20 md:pt-28 px-4">
        {/* Wrapper que restringe el ancho del texto en desktop */}
        <div className="w-full max-w-xl">
          <h1 className="text-2xl sm:text-3xl md:text-5xl font-normal mb-3 md:mb-4 font-sans text-balance text-white">
            {title}
          </h1>

          {subtitle && (
            <span className="block text-lg md:text-2xl font-serif italic font-normal mb-3 md:mb-4 text-white">
              {subtitle}
            </span>
          )}

          {description && (
            <p className="text-base md:text-lg text-white leading-relaxed mt-2 md:mt-3">
              {description}
            </p>
          )}

          {primaryCta && (
            <div className="mt-6 md:mt-8">
              <Link
                href={primaryCta.href}
                className="inline-flex w-full max-w-sm sm:w-auto sm:max-w-none items-center justify-center gap-2 bg-teal hover:bg-teal-soft text-white font-medium px-6 py-3 rounded-lg transition-colors"
              >
                {primaryCta.label}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

