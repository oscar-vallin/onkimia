import type { Doctor } from '@/sanity/types';
import type { Locale } from '@/sanity/lib/localization';
import { parseEmphasis } from '@/lib/parseEmphasis';
import { DoctorCard } from './DoctorCard';

interface DoctorsGridProps {
  doctors: Doctor[];
  eyebrow: string;
  title: string;
  description: string;
  locale: Locale;
  viewProfileLabel: string;
}

export function DoctorsGrid({
  doctors,
  eyebrow,
  title,
  description,
  locale,
  viewProfileLabel,
}: DoctorsGridProps) {
  return (
    <section className="bg-ink py-20 md:py-28">
      <div className="container-onkimia">

        {/* Section header */}
        <div className="text-center mb-16 md:mb-20">
          <p className="text-xs font-medium tracking-widest uppercase text-teal-soft mb-4">
            {eyebrow}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            {parseEmphasis(title)}
          </h2>
          <p className="text-white/70 text-lg leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
        </div>

        {/* Doctor grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {doctors.map((doctor) => (
            <DoctorCard
              key={doctor._id}
              doctor={doctor}
              locale={locale}
              viewProfileLabel={viewProfileLabel}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
