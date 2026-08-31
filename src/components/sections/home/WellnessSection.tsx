import { getTranslations } from 'next-intl/server';
import { Wellness } from '@/components/sections/Wellness';
import { HOME_WELLNESS_ITEMS } from '@/content/home-content';
import type { SectionProps } from '@/components/sections/registry';

export async function WellnessSection({ locale }: SectionProps) {
  const t = await getTranslations('home');

  return (
    <Wellness
      eyebrow={t('wellness.eyebrow')}
      title={t('wellness.title')}
      intro={t('wellness.intro')}
      items={HOME_WELLNESS_ITEMS[locale as 'es' | 'en'] ?? HOME_WELLNESS_ITEMS.es}
    />
  );
}
