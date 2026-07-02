import { getTranslations } from 'next-intl/server';
import { Wellness } from '@/components/sections/Wellness';
import { FALLBACK_WELLNESS } from '@/content/fallbacks';
import type { SectionProps } from '@/components/sections/registry';

export async function WellnessSection({ locale }: SectionProps) {
  const t = await getTranslations('home');

  return (
    <Wellness
      eyebrow={t('wellness.eyebrow')}
      title={t('wellness.title')}
      intro={t('wellness.intro')}
      items={FALLBACK_WELLNESS[locale as 'es' | 'en'] ?? FALLBACK_WELLNESS.es}
    />
  );
}
