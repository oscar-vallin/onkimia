'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { urlFor } from '@/sanity/image';
import { getLocalized } from '@/sanity/lib/localization';
import type { Testimonial } from '@/sanity/types';
import type { Locale } from '@/i18n/routing';

interface TestimonialCarouselProps {
  testimonials: Testimonial[];
  locale: Locale;
}

export function TestimonialCarousel({ testimonials, locale }: TestimonialCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying || testimonials.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  if (testimonials.length === 0) return null;

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Testimonial Card */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-5 gap-6 p-8 md:p-12">
          {/* Photo */}
          <div className="md:col-span-2 flex justify-center items-start">
            <div className="relative w-48 h-48 md:w-full md:h-64 rounded-xl overflow-hidden">
              <Image
                src={urlFor(currentTestimonial.photo).width(400).height(400).url()}
                alt={currentTestimonial.name}
                fill
                sizes="(max-width: 768px) 192px, 256px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="md:col-span-3 flex flex-col justify-center">
            <div className="mb-6">
              <svg
                className="w-10 h-10 text-teal mb-4"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
              </svg>
              <p className="text-lg text-gray-warm leading-relaxed mb-6">
                {getLocalized(currentTestimonial.testimonial, locale)}
              </p>
            </div>
            
            <div>
              <p className="font-medium text-ink text-lg">
                {currentTestimonial.name}
              </p>
              {currentTestimonial.role && (
                <p className="text-sm text-gray-warm">
                  {getLocalized(currentTestimonial.role, locale)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      {testimonials.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 bg-white hover:bg-cream text-ink p-3 rounded-full shadow-lg transition-colors"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 bg-white hover:bg-cream text-ink p-3 rounded-full shadow-lg transition-colors"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {testimonials.length > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-all ${
                index === currentIndex
                  ? 'bg-teal w-8'
                  : 'bg-line hover:bg-gray-soft'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// Made with Bob
