import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { sanityFetch } from '@/sanity/lib/fetch';
import {
  CLINIC_BY_SLUG_QUERY,
  DOCTORS_BY_CLINIC_QUERY,
  SERVICES_BY_CLINIC_QUERY,
} from '@/sanity/queries';
import { getLocalized } from '@/sanity/lib/localization';
import { buildMetadata } from '@/lib/seo/metadata';
import type { Clinic, Doctor, Service } from '@/sanity/types';
import type { Locale } from '@/i18n/routing';
import { ClinicPageContent } from '@/components/clinic/ClinicPageContent';
import { MedicalClinicJsonLd } from '@/components/seo/MedicalClinicJsonLd';

const CLINIC_SLUG = 'colima';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'clinicPage.metadata' });
  return buildMetadata({
    title: t('colima.title'),
    description: t('colima.description'),
    locale,
    pathname: '/colima',
  });
}

export default async function ColimaPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const clinic = await sanityFetch<Clinic | null>({
    query: CLINIC_BY_SLUG_QUERY,
    params: { slug: CLINIC_SLUG },
    tags: ['clinic'],
  });

  if (!clinic) notFound();

  const [doctors, services] = await Promise.all([
    sanityFetch<Doctor[]>({
      query: DOCTORS_BY_CLINIC_QUERY,
      params: { clinicSlug: clinic.slug },
      tags: ['doctor'],
    }),
    sanityFetch<Service[]>({
      query: SERVICES_BY_CLINIC_QUERY,
      params: { clinicId: clinic._id },
      tags: ['service'],
    }),
  ]);

  const clinicName = getLocalized(clinic.name, locale);

  return (
    <>
      <ClinicPageContent
        clinic={clinic}
        doctors={doctors}
        services={services}
        locale={locale}
      />
      <MedicalClinicJsonLd
        clinic={clinic}
        clinicName={clinicName}
        url={locale === 'es' ? '/colima' : '/en/colima'}
      />
    </>
  );
}
