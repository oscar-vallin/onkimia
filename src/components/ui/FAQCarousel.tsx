'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { urlFor } from '@/sanity/image';
import { getLocalized } from '@/sanity/lib/localization';
import type { FAQ } from '@/sanity/types';
import type { Locale } from '@/i18n/routing';

interface FAQCarouselProps {
  faqs: FAQ[];
  locale: Locale;
}

export function FAQCarousel({ faqs, locale }: FAQCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 2;
  const totalPages = Math.ceil(faqs.length / itemsPerPage);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages);
  };

  const currentFAQs = faqs.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  );

  if (faqs.length === 0) return null;

  return (
    <div className="relative">
      {/* FAQ Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {currentFAQs.map((faq) => (
          <article
            key={faq._id}
            className="bg-[#3d5a80] rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
          >
            {faq.doctor && (
              <div className="relative w-full h-64">
                <Image
                  src={urlFor(faq.doctor.photo).width(600).height(400).url()}
                  alt={faq.doctor.fullName}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#3d5a80] to-transparent p-6">
                  <p className="font-medium text-white text-lg">
                    {faq.doctor.fullName}
                  </p>
                  <p className="text-sm text-white/80">
                    {getLocalized(faq.doctor.specialty, locale)}
                  </p>
                </div>
              </div>
            )}
            <div className="p-6 text-white">
              <h3 className="text-lg font-medium mb-3">
                {getLocalized(faq.question, locale)}
              </h3>
              <p className="text-white/90 leading-relaxed text-sm">
                {getLocalized(faq.answer, locale)}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Navigation Arrows */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={goToPrevious}
            className="bg-neutral-900 hover:bg-neutral-800 text-white p-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Previous FAQs"
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <span className="text-sm text-neutral-600">
            {currentIndex + 1} / {totalPages}
          </span>
          
          <button
            onClick={goToNext}
            className="bg-accent-500 hover:bg-accent-600 text-white p-3 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Next FAQs"
            disabled={currentIndex === totalPages - 1}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

// Made with Bob
