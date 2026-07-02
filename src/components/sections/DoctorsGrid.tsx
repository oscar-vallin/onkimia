import type { Doctor } from '@/sanity/types';
import type { Locale } from '@/lib/localization';
import { DoctorsCarousel } from './DoctorsCarousel';
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

      <DoctorsCarousel doctors={doctors} locale={locale} />

    </Section>
  );
}
