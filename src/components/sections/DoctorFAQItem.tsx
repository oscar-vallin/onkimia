'use client';

import { useState } from 'react';
import Image from 'next/image';
import { urlFor } from '@/sanity/image';
import type { FAQItem } from '@/sanity/types';

interface DoctorFAQItemProps {
  item: FAQItem;
  defaultOpen?: boolean;
}

export function DoctorFAQItem({ item, defaultOpen = false }: DoctorFAQItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  const hasPhoto = !!item.doctor.photo?.asset;
  const photoSrc = hasPhoto
    ? urlFor(item.doctor.photo).width(80).height(80).format('webp').quality(80).url()
    : undefined;

  return (
    <div
      className={`rounded-2xl border bg-white transition-all duration-200 mb-3 overflow-hidden ${
        open ? 'border-primary/30 shadow-sm' : 'border-black/[0.07]'
      }`}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between gap-6 px-7 py-5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset ${
          open ? 'border-l-4 border-l-primary' : 'border-l-4 border-l-transparent'
        }`}
        aria-expanded={open}
      >
        <span className="font-sans text-base md:text-lg text-primary leading-snug font-normal">
          {item.question}
        </span>
        <span
          className={`flex-shrink-0 w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-200 ${
            open
              ? 'border-primary bg-primary text-white rotate-45'
              : 'border-black/[0.07] bg-white text-primary group-hover:border-primary group-hover:text-primary'
          }`}
          aria-hidden="true"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M7 1v12M1 7h12"/>
          </svg>
        </span>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-7 pb-7 border-l-4 border-l-primary">
          <p className="text-secondary text-base leading-relaxed mb-6">{item.answer}</p>

          <div className="flex items-center gap-3 pt-4 border-t border-black/[0.07]">
            {photoSrc ? (
              <Image
                src={photoSrc}
                alt={item.doctor.fullName}
                width={40}
                height={40}
                className="rounded-full object-cover object-top flex-shrink-0"
                placeholder={item.doctor.photo?.asset?.metadata?.lqip ? 'blur' : 'empty'}
                blurDataURL={item.doctor.photo?.asset?.metadata?.lqip ?? undefined}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <span className="text-primary text-xs font-medium">
                  {item.doctor.fullName.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <p className="text-primary text-sm font-medium">{item.doctor.fullName}</p>
              {item.doctor.specialty && (
                <p className="text-secondary text-xs">{item.doctor.specialty}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
