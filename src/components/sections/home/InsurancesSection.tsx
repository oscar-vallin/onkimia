import { sanityFetch } from '@/sanity/lib/fetch';
import { INSURANCES_QUERY } from '@/sanity/queries';
import type { Insurance } from '@/sanity/types';
import { ConveniosEditorial } from '@/components/sections/ConveniosEditorial';
import { getTranslations } from 'next-intl/server';

export async function InsurancesSection() {
  const [insurances, t] = await Promise.all([
    sanityFetch<Insurance[]>({ query: INSURANCES_QUERY, tags: ['insurance'] }),
    getTranslations('home'),
  ]);

  if (!insurances.length) return null;

  return (
    <ConveniosEditorial
      insurances={insurances}
      eyebrow={t('insurances.eyebrow')}
      title={t('insurances.title')}
      statLabel={t('insurances.statLabel')}
    />
  );
}
