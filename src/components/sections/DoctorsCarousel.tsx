'use client';

import { useCallback, useState, useSyncExternalStore } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import type { Doctor } from '@/sanity/types';
import type { Locale } from '@/lib/localization';
import { DoctorCard } from './DoctorCard';

interface DoctorsCarouselProps {
  doctors: Doctor[];
  locale: Locale;
}

const AUTOPLAY_DELAY_MS = 3500;

export function DoctorsCarousel({ doctors, locale }: DoctorsCarouselProps) {
  const [autoplay] = useState(() =>
    Autoplay({ delay: AUTOPLAY_DELAY_MS, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start', slidesToScroll: 1 },
    [autoplay]
  );

  const selectedIndex = useSyncExternalStore(
    useCallback(
      (onStoreChange) => {
        if (!emblaApi) return () => {};
        emblaApi.on('select', onStoreChange).on('reInit', onStoreChange);
        return () => {
          emblaApi.off('select', onStoreChange).off('reInit', onStoreChange);
        };
      },
      [emblaApi]
    ),
    () => emblaApi?.selectedScrollSnap() ?? 0,
    () => 0
  );

  const scrollSnaps = useSyncExternalStore(
    useCallback(
      (onStoreChange) => {
        if (!emblaApi) return () => {};
        emblaApi.on('reInit', onStoreChange);
        return () => emblaApi.off('reInit', onStoreChange);
      },
      [emblaApi]
    ),
    () => emblaApi?.scrollSnapList() ?? [],
    () => []
  );

  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  );

  const pauseAutoplay = useCallback(() => autoplay.stop(), [autoplay]);

  const scrollPrev = useCallback(() => {
    pauseAutoplay();
    emblaApi?.scrollPrev();
  }, [emblaApi, pauseAutoplay]);

  const scrollNext = useCallback(() => {
    pauseAutoplay();
    emblaApi?.scrollNext();
  }, [emblaApi, pauseAutoplay]);

  return (
    <div>
      <div
        className="overflow-hidden -mx-3 px-3"
        ref={emblaRef}
        onPointerDown={pauseAutoplay}
        onTouchStart={pauseAutoplay}
      >
        <div className="flex -ml-6 md:-ml-8">
          {doctors.map((doctor) => (
            <div
              key={doctor._id}
              className="flex-[0_0_100%] md:flex-[0_0_33.3333%] min-w-0 pl-6 md:pl-8"
            >
              <DoctorCard doctor={doctor} locale={locale} />
            </div>
          ))}
        </div>
      </div>

      {/* Controls: arrows flanking dots */}
      {scrollSnaps.length > 1 && (
        <div className="flex items-center justify-center gap-6 mt-8">

          <button
            type="button"
            onClick={scrollPrev}
            aria-label="Anterior"
            className="group flex items-center justify-center w-9 h-9 rounded-full border border-primary/20 text-primary/40 transition-all duration-200 hover:border-primary/60 hover:text-primary hover:bg-primary/5 cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 2L4 7l5 5" />
            </svg>
          </button>

          <div className="flex items-center gap-2" role="tablist" aria-label="Doctores">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                type="button"
                role="tab"
                aria-selected={index === selectedIndex}
                aria-label={`Ir a la diapositiva ${index + 1}`}
                onClick={() => {
                  pauseAutoplay();
                  scrollTo(index);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  index === selectedIndex
                    ? 'w-5 bg-primary'
                    : 'w-1.5 bg-primary/20 hover:bg-primary/40'
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={scrollNext}
            aria-label="Siguiente"
            className="group flex items-center justify-center w-9 h-9 rounded-full border border-primary/20 text-primary/40 transition-all duration-200 hover:border-primary/60 hover:text-primary hover:bg-primary/5 cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 2l5 5-5 5" />
            </svg>
          </button>

        </div>
      )}
    </div>
  );
}
