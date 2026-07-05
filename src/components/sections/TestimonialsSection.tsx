import type { SanityImageWithLQIP, Testimonial } from '@/sanity/types';
import { TestimonialCarousel } from '@/components/ui/TestimonialCarousel';
import { SectionHeader } from '@/components/ui/SectionHeader';
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

        <SectionHeader
          theme="dark"
          eyebrow={eyebrow}
          title={title}
          titleClassName="mb-0"
          className="max-w-none"
        />

        {/* Carousel */}
        {testimonials.length > 0 && (
          <TestimonialCarousel testimonials={testimonials} locale={locale} />
        )}

      </div>

    </section>
  );
}
