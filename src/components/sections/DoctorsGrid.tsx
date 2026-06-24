import type { Doctor } from '@/sanity/types';
import type { Locale } from '@/sanity/lib/localization';
import { DoctorCard } from './DoctorCard';
import { Section } from '@/components/ui/Section';
import { SectionHeader } from '@/components/ui/SectionHeader';

interface DoctorsGridProps {
  doctors: Doctor[];
  eyebrow: string;
  title: string;
  description: string;
  locale: Locale;
}

export function DoctorsGrid({
  doctors,
  eyebrow,
  title,
  description,
  locale,
}: DoctorsGridProps) {
  return (
    <Section theme="gray">

      <SectionHeader eyebrow={eyebrow} title={title} intro={description} theme="light" align="center" />

      {/* Doctor grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {doctors.map((doctor) => (
          <DoctorCard
            key={doctor._id}
            doctor={doctor}
            locale={locale}
          />
        ))}
      </div>

    </Section>
  );
}
