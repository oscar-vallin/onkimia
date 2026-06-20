import Image from 'next/image';
import { urlFor } from '@/sanity/image';
import type { SanityImageWithLQIP, Testimonial } from '@/sanity/types';
import { TestimonialCarousel } from '@/components/ui/TestimonialCarousel';
import type { Locale } from '@/i18n/routing';

interface TestimonialsSectionProps {
  title: string;
  subtitle?: string;
  testimonials: Testimonial[];
  locale: Locale;
  reikyImage?: SanityImageWithLQIP;
}

export function TestimonialsSection({
  title,
  subtitle,
  testimonials,
  locale,
  reikyImage,
}: TestimonialsSectionProps) {
  if (!testimonials.length && !reikyImage) return null;

  return (
    <section className="bg-cream py-20 md:py-28 overflow-hidden">
      <div className="container-onkimia">
        <div className="text-center mb-12">
          <h2 className="font-serif text-4xl md:text-5xl text-ink">{title}</h2>
          {subtitle && (
            <p className="text-gray-warm text-lg mt-4 max-w-2xl mx-auto">{subtitle}</p>
          )}
        </div>
      </div>

      {testimonials.length > 0 && (
        <TestimonialCarousel testimonials={testimonials} locale={locale} />
      )}

      {reikyImage && (
        <div className="container-onkimia mt-12">
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
