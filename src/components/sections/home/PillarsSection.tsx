import { getTranslations } from 'next-intl/server';
import { Pillars } from '@/components/sections/Pillars';
import { ROUTES } from '@/config/routes';
import type { SectionProps } from '@/components/sections/registry';

export async function PillarsSection({}: SectionProps) {
  const t = await getTranslations('home');

  return (
    <Pillars
      eyebrow={t('pillars.eyebrow')}
      title={t('pillars.title')}
      intro={t('pillars.intro')}
      cta={t('pillars.cta')}
      ctaHref={ROUTES.services}
      pillars={[
        { title: t('pillars.cancer.title'),         description: t('pillars.cancer.description') },
        { title: t('pillars.cardiovascular.title'), description: t('pillars.cardiovascular.description') },
        { title: t('pillars.metabolic.title'),      description: t('pillars.metabolic.description') },
        { title: t('pillars.neurological.title'),   description: t('pillars.neurological.description') },
      ]}
    />
  );
}
