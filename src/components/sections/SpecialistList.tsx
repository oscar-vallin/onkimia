import { SpecialistRow } from './SpecialistRow';
import type { Doctor } from '@/sanity/types';
import type { Locale } from '@/sanity/lib/localization';

interface SpecialistListProps {
  doctors: Doctor[];
  eyebrow: string;
  title: string;
  description: string;
  locale: Locale;
  ctaLabel: string;
}

function parseTitle(raw: string) {
  const parts = raw.split(/\*([^*]+)\*/);
  return parts.map((part, i) =>
    i % 2 === 1
      ? <em key={i} className="italic text-teal-soft">{part}</em>
      : <span key={i}>{part}</span>
  );
}

export function SpecialistList({
  doctors,
  eyebrow,
  title,
  description,
  locale,
  ctaLabel,
}: SpecialistListProps) {
  return (
    <section id="especialistas" className="bg-ink py-20 md:py-28 scroll-mt-20">
      <div className="container-onkimia">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-teal-soft uppercase tracking-wider text-xs font-medium mb-3">
            {eyebrow}
          </p>
          <h2 className="font-serif font-normal text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
            {parseTitle(title)}
          </h2>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto mt-6">
            {description}
          </p>
        </div>

        {/* List */}
        <ul className="mt-12 max-w-5xl mx-auto">
          {doctors.slice(0, 8).map((doctor) => (
            <li key={doctor._id} className="border-t border-white/[0.08] last:border-b">
              <SpecialistRow doctor={doctor} locale={locale} ctaLabel={ctaLabel} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
