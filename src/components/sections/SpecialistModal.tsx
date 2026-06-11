'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { X } from 'lucide-react';
import { urlFor } from '@/sanity/image';
import { getLocalized, type Locale } from '@/sanity/lib/localization';
import type { Doctor } from '@/sanity/types';

interface SpecialistModalProps {
  doctor: Doctor;
  locale: Locale;
  open: boolean;
  onClose: () => void;
}

export function SpecialistModal({ doctor, locale, open, onClose }: SpecialistModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      // autoFocus on close button; full focus trap can be added later if required by a11y audit
      closeRef.current?.focus();
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  const specialty = getLocalized(doctor.specialty, locale);
  const hasLqip = !!doctor.photo?.asset?.metadata?.lqip;

  return createPortal(
    <div className="fixed inset-0 z-[1200] flex items-end md:items-center justify-center md:p-6">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={doctor.fullName}
        className={[
          'relative z-[1201] w-full bg-ink-2 border border-white/[0.08] overflow-hidden',
          'rounded-t-3xl md:rounded-3xl',
          'max-h-[85vh] md:max-h-none md:max-w-[620px] overflow-y-auto md:overflow-visible',
          'transition-all duration-500 ease-out',
          open
            ? 'translate-y-0 md:translate-y-0 md:scale-100 opacity-100'
            : 'translate-y-full md:translate-y-8 md:scale-[0.97] opacity-0',
          '@media (prefers-reduced-motion: reduce) { transition: none !important; transform: none !important; }',
        ].join(' ')}
      >
        {/* Close button */}
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/40 text-white hover:bg-teal transition-colors flex items-center justify-center"
        >
          <X className="w-5 h-5" aria-hidden="true" />
        </button>

        {/* Photo */}
        <div className="relative h-[150px] md:h-[220px] bg-ink-3">
          {doctor.photo?.asset && (
            <Image
              src={urlFor(doctor.photo).width(620).height(220).url()}
              alt={doctor.fullName}
              fill
              sizes="(max-width: 768px) 100vw, 620px"
              className="object-cover"
              placeholder={hasLqip ? 'blur' : 'empty'}
              blurDataURL={doctor.photo.asset?.metadata?.lqip}
            />
          )}
        </div>

        {/* Body */}
        <div className="p-6 md:p-9">
          <h3 className="font-serif text-2xl md:text-3xl text-white mb-2">
            {doctor.fullName}
          </h3>
          {specialty && (
            <p className="text-teal-soft text-sm uppercase tracking-wider">
              {specialty}
            </p>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
