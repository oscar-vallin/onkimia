'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronDown } from 'lucide-react';
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
  const lqip = item.doctor.photo?.asset?.metadata?.lqip ?? undefined;

  return (
    <div className="border-b border-white/[0.08] last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-4 py-6 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
        aria-expanded={open}
      >
        <span className="font-serif text-lg md:text-xl text-white leading-snug group-hover:text-teal-soft transition-colors duration-200">
          {item.question}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-teal-soft flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${open ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="pb-8">
          <p className="text-white/75 text-base leading-relaxed mb-6">{item.answer}</p>

          {/* Doctor attribution */}
          <div className="flex items-center gap-3">
            {photoSrc ? (
              <Image
                src={photoSrc}
                alt={item.doctor.fullName}
                width={40}
                height={40}
                className="rounded-full object-cover object-top"
                placeholder={item.doctor.photo?.asset?.metadata?.lqip ? 'blur' : 'empty'}
                blurDataURL={item.doctor.photo?.asset?.metadata?.lqip ?? undefined}
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-teal/20 flex items-center justify-center flex-shrink-0">
                <span className="text-teal-soft text-xs font-medium">
                  {item.doctor.fullName.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <p className="text-white text-sm font-medium">{item.doctor.fullName}</p>
              {item.doctor.specialty && (
                <p className="text-teal-soft text-xs">{item.doctor.specialty}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
