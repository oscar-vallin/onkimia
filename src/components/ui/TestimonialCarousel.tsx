'use client';

import { useState, useEffect, useCallback } from 'react';
import { SanityImage as Image } from '@/components/ui/SanityImage';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { urlFor } from '@/sanity/image';
import { getLocalized } from '@/lib/localization';
import type { Testimonial } from '@/sanity/types';
import type { Locale } from '@/i18n/routing';

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  locale: Locale;
}

export function TestimonialCarousel({ testimonials, locale }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  }, [testimonials.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 1) return;
    const interval = setInterval(goToNext, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length, goToNext]);

  const stop = () => setIsAutoPlaying(false);

  if (testimonials.length === 0) return null;

  const t = testimonials[currentIndex];
  const photoSrc = t.photo
    ? urlFor(t.photo).width(160).height(160).format('webp').url()
    : null;

  return (
    <div className="relative">
      {/* Arrow — left */}
      {testimonials.length > 1 && (
        <button
          onClick={() => { stop(); goToPrevious(); }}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 md:-translate-x-14 z-10 w-10 h-10 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors"
          aria-label="Testimonio anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Quote + content */}
      <div className="text-center px-2">
        {/* Opening quote mark */}
        <div className="font-serif text-7xl text-white/20 leading-none mb-2 select-none" aria-hidden="true">
          &ldquo;
        </div>

        {/* Quote text */}
        <p className="font-serif text-xl md:text-2xl lg:text-3xl text-white/90 italic leading-relaxed mb-10 max-w-3xl mx-auto">
          {getLocalized(t.testimonial, locale)}
        </p>

        {/* Avatar */}
        <div className="flex flex-col items-center gap-3">
          {photoSrc && (
            <div className="relative w-14 h-14 rounded-full overflow-hidden ring-2 ring-white/20">
              <Image
                src={photoSrc}
                alt={t.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            </div>
          )}
          <div>
            <p className="font-sans font-medium text-white text-sm">
              {t.name}
            </p>
            {t.role && (
              <p className="font-sans text-xs text-white/50 mt-0.5">
                {getLocalized(t.role, locale)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Arrow — right */}
      {testimonials.length > 1 && (
        <button
          onClick={() => { stop(); goToNext(); }}
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 md:translate-x-14 z-10 w-10 h-10 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 text-white/70 hover:text-white flex items-center justify-center transition-colors"
          aria-label="Siguiente testimonio"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Dots */}
      {testimonials.length > 1 && (
        <div className="flex justify-center gap-2 mt-10">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => { stop(); setCurrentIndex(index); }}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentIndex
                  ? 'bg-white w-7'
                  : 'bg-white/25 hover:bg-white/40 w-2'
              }`}
              aria-label={`Ir al testimonio ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
