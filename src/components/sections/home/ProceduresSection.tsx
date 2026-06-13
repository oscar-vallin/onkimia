import { sanityFetch } from '@/sanity/lib/fetch';
import { allProceduresQuery } from '@/sanity/queries';
import type { Procedure, SanityImageWithLQIP } from '@/sanity/types';
import { ProcedureCarousel } from '@/components/sections/ProcedureCarousel';
import { getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';

interface ProceduresSectionProps {
  locale: Locale;
  backgroundImage?: SanityImageWithLQIP;
}

export async function ProceduresSection({ locale, backgroundImage }: ProceduresSectionProps) {
  const [procedures, t] = await Promise.all([
    sanityFetch<Procedure[]>({
      query: allProceduresQuery,
      params: { locale },
      tags: ['procedure'],
    }),
    getTranslations('home'),
  ]);

  if (!procedures.length) return null;

  return (
    <ProcedureCarousel
      eyebrow={t('homeProcedures.eyebrow')}
      title={t('homeProcedures.title')}
      lead={t('homeProcedures.lead')}
      backgroundImage={backgroundImage}
      procedures={procedures}
      badgeEndos={t('procedures.badge.endos')}
      badgeCuidare={t('procedures.badge.cuidare')}
      categoryEndos={t('procedures.category.endos')}
      categoryCuidare={t('procedures.category.cuidare')}
    />
  );
}
