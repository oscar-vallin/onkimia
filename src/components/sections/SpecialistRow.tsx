'use client';

import { useState } from 'react';
import { SanityImage as Image } from '@/components/ui/SanityImage';
import { ArrowRight } from 'lucide-react';
import { urlFor } from '@/sanity/image';
import { getLocalized, type Locale } from '@/sanity/lib/localization';
import { SpecialistModal } from './SpecialistModal';
import type { Doctor } from '@/sanity/types';

interface SpecialistRowProps {
  doctor: Doctor;
  locale: Locale;
  ctaLabel: string;
}

export function SpecialistRow({ doctor, locale, ctaLabel }: SpecialistRowProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full flex items-center gap-4 md:gap-6 py-5 md:py-6 px-2 md:px-4 text-left group hover:pl-4 md:hover:pl-6 hover:bg-white/[0.02] transition-all duration-300 ease-out cursor-pointer"
      >
        {/* Thumbnail */}
        <div className="relative w-14 h-14 md:w-[76px] md:h-[76px] rounded-2xl overflow-hidden bg-ink-2 flex-shrink-0">
          {doctor.photo?.asset && (
            <Image
              src={urlFor(doctor.photo).width(76).height(76).url()}
              alt={doctor.fullName}
              fill
              sizes="76px"
              className="object-cover group-hover:scale-105 transition-transform duration-[400ms]"
            />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <p className="font-serif text-xl md:text-2xl text-white truncate">
            {doctor.fullName}
          </p>
          <p className="text-sm md:text-base text-white/60 mt-1">
            {getLocalized(doctor.specialty, locale)}
          </p>
          <span className="hidden md:inline-flex items-center gap-1 text-xs text-teal-soft mt-2 opacity-75 group-hover:opacity-100 transition-opacity">
            {ctaLabel} →
          </span>
        </div>

        {/* Arrow circle */}
        <span className="w-10 h-10 md:w-[42px] md:h-[42px] rounded-full border border-white/[0.08] flex items-center justify-center flex-shrink-0 text-white/50 group-hover:bg-teal group-hover:border-teal group-hover:text-white group-hover:translate-x-1 transition-all duration-300">
          <ArrowRight className="w-4 h-4 md:w-[18px] md:h-[18px]" aria-hidden="true" />
        </span>
      </button>

      <SpecialistModal
        doctor={doctor}
        locale={locale}
        open={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
