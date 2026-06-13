import { sanityFetch } from '@/sanity/lib/fetch';
import { DOCTORS_QUERY } from '@/sanity/queries';
import type { Doctor } from '@/sanity/types';
import { DoctorsGrid } from '@/components/sections/DoctorsGrid';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';

interface DoctorsSectionProps {
  locale: Locale;
}

export async function DoctorsSection({ locale }: DoctorsSectionProps) {
  const [doctors, t] = await Promise.all([
    sanityFetch<Doctor[]>({ query: DOCTORS_QUERY, tags: ['doctor'] }),
    getTranslations('home'),
  ]);

  if (!doctors.length) return null;

  return (
    <DoctorsGrid
      doctors={doctors}
      eyebrow={t('doctors.eyebrow')}
      title={t('doctors.title')}
      description={t('doctors.description')}
      viewProfileLabel={t('doctors.viewDetail')}
      locale={locale}
    />
  );
}
