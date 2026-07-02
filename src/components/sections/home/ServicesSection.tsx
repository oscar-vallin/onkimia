import { getTranslations } from 'next-intl/server';
import { StickyStages } from '@/components/sections/StickyStages';
import { ROUTES } from '@/config/routes';
import { FALLBACK_SERVICES } from '@/content/fallbacks';
import type { SectionProps } from '@/components/sections/registry';

export async function ServicesSection({ locale }: SectionProps) {
  const t = await getTranslations('home');

  return (
    <StickyStages
      eyebrow={t('services.eyebrow')}
      title={t('services.title')}
      lead={t('services.lead')}
      ctaLabel={t('services.cta')}
      ctaHref={ROUTES.contact}
      items={FALLBACK_SERVICES[locale as 'es' | 'en'] ?? FALLBACK_SERVICES.es}
    />
  );
}
