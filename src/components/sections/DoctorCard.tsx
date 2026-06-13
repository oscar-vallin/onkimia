'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { urlFor } from '@/sanity/image';
import { getLocalized, type Locale } from '@/sanity/lib/localization';
import type { Doctor } from '@/sanity/types';
import dynamic from 'next/dynamic';

const SpecialistModal = dynamic(
  () => import('./SpecialistModal').then((mod) => mod.SpecialistModal),
  { ssr: false, loading: () => null }
);

interface DoctorCardProps {
  doctor: Doctor;
  locale: Locale;
  viewProfileLabel: string;
}

export function DoctorCard({ doctor, locale, viewProfileLabel }: DoctorCardProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const hasPhoto = !!doctor.photo?.asset;
  const hasLqip = !!doctor.photo?.asset?.metadata?.lqip;
  const photoSrc = hasPhoto
    ? urlFor(doctor.photo).width(600).height(800).format('webp').quality(85).url()
    : undefined;

  return (
    <>
      <article
        className="group relative cursor-pointer rounded-2xl transition-all duration-500 ease-out hover:-translate-y-1.5 hover:shadow-[0_24px_60px_rgba(0,0,0,0.45)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        onClick={() => setModalOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setModalOpen(true);
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`Ver perfil de ${doctor.fullName}`}
      >
        {/* Photo container — portrait 3:4 ratio */}
        <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-ink-2">

          {/* Photo */}
          {photoSrc && (
            <Image
              src={photoSrc}
              alt={doctor.fullName}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              loading="lazy"
              placeholder={hasLqip ? 'blur' : 'empty'}
              blurDataURL={hasLqip ? doctor.photo.asset?.metadata?.lqip : undefined}
              className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
            />
          )}

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent transition-opacity duration-500" />

          {/* "Ver perfil" CTA — appears on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="inline-flex items-center gap-2 bg-teal/90 backdrop-blur-sm text-white text-sm font-medium px-5 py-2.5 rounded-full">
              {viewProfileLabel}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </span>
          </div>

          {/* Name + specialty — anchored to bottom, always visible */}
          <div className="absolute bottom-0 left-0 right-0 p-5">
            <h3 className="font-serif text-xl text-white leading-tight mb-1">
              {doctor.fullName}
            </h3>
            <p className="text-sm text-teal-soft">
              {getLocalized(doctor.specialty, locale)}
            </p>
          </div>

        </div>
      </article>

      <SpecialistModal
        doctor={doctor}
        locale={locale}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
