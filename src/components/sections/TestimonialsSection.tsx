import Image from 'next/image';
import { urlFor } from '@/sanity/image';
import type { SanityImageWithLQIP, Testimonial } from '@/sanity/types';
import { TestimonialCarousel } from '@/components/ui/TestimonialCarousel';
import type { Locale } from '@/i18n/routing';

interface TestimonialsSectionProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  testimonials: Testimonial[];
  locale: Locale;
  reikyImage?: SanityImageWithLQIP;
}

export function TestimonialsSection({
  eyebrow,
  title,
  testimonials,
  locale,
  reikyImage,
}: TestimonialsSectionProps) {
  if (!testimonials.length && !reikyImage) return null;

  return (
    <section className="bg-primary py-20 md:py-28 overflow-hidden">
      <div className="container-onkimia max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-14 md:mb-16">
          {eyebrow && (
            <p className="font-sans text-[10px] md:text-xs font-medium tracking-[0.22em] uppercase text-white/45 mb-4">
              {eyebrow}
            </p>
          )}
          <h2 className="font-serif text-4xl md:text-5xl lg:text-[3.25rem] text-white leading-tight tracking-[-0.02em]">
            {title}
          </h2>
        </div>

        {/* Carousel */}
        {testimonials.length > 0 && (
          <TestimonialCarousel testimonials={testimonials} locale={locale} />
        )}

      </div>

      {/* Wide image below carousel */}
      {reikyImage && (
        <div className="container-onkimia mt-16">
          <div className="relative aspect-[22/9] rounded-2xl overflow-hidden">
            <Image
              src={urlFor(reikyImage).width(1400).height(788).format('webp').quality(82).url()}
              alt="Terapia de bienestar Onkimia"
              fill
              sizes="(max-width: 1280px) 100vw, 1280px"
              loading="lazy"
              placeholder={reikyImage?.asset?.metadata?.lqip ? 'blur' : 'empty'}
              blurDataURL={reikyImage?.asset?.metadata?.lqip ?? undefined}
              className="object-cover object-[center_10%]"
            />
          </div>
        </div>
      )}
    </section>
  );
}
