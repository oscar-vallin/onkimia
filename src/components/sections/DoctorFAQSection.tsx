'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import type { FAQItem } from '@/sanity/types';
import { DoctorFAQItem } from './DoctorFAQItem';

interface DoctorFAQSectionProps {
  eyebrow: string;
  title: string;
  items: FAQItem[];
}

const PAGE_SIZE = 7;

export function DoctorFAQSection({ eyebrow, title, items }: DoctorFAQSectionProps) {
  const t = useTranslations('about.faq');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  if (!items.length) return null;

  const visible = items.slice(0, visibleCount);
  const remaining = items.length - visibleCount;
  const hasMore = remaining > 0;
  const nextBatch = Math.min(remaining, PAGE_SIZE);
  const titleLines = title.split('\n');

  return (
    <section className="bg-white py-20 md:py-28">
      <div className="container-onkimia">
        <div className="text-center mb-12 md:mb-16">
          <p className="text-xs tracking-[0.25em] uppercase text-secondary font-medium mb-5">
            {eyebrow}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary leading-tight">
            {titleLines.map((line, i) => (
              <span key={i}>
                {line}
                {i < titleLines.length - 1 && <br />}
              </span>
            ))}
          </h2>
        </div>

        <div className="max-w-3xl mx-auto">
          {visible.map((item, i) => (
            <DoctorFAQItem key={item._key} item={item} defaultOpen={i === 0} />
          ))}

          <div className="mt-6 text-center flex items-center justify-center gap-3">
            {hasMore && (
              <button
                type="button"
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-primary/20 text-primary text-sm font-medium transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
              >
                {t('seeMore', { count: nextBatch })}
                <svg
                  width="14" height="14" viewBox="0 0 14 14"
                  fill="none" stroke="currentColor" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M2 5l5 5 5-5" />
                </svg>
              </button>
            )}

            {visibleCount > PAGE_SIZE && (
              <button
                type="button"
                onClick={() => setVisibleCount(PAGE_SIZE)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-primary/20 text-primary text-sm font-medium transition-all duration-200 hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
              >
                {t('seeLess')}
                <svg
                  width="14" height="14" viewBox="0 0 14 14"
                  fill="none" stroke="currentColor" strokeWidth="1.8"
                  strokeLinecap="round" strokeLinejoin="round"
                  aria-hidden="true"
                  className="rotate-180"
                >
                  <path d="M2 5l5 5 5-5" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
