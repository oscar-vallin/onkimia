import { getTranslations } from 'next-intl/server';
import { sanityFetch } from '@/sanity/lib/fetch';
import { SITE_SETTINGS_QUERY } from '@/sanity/queries';
import type { SiteSettings } from '@/sanity/types';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { ROUTES } from '@/config/routes';
import type { SectionProps } from '@/components/sections/registry';

export async function HowItWorksSection({}: SectionProps) {
  const [settings, t] = await Promise.all([
    sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
    getTranslations('home'),
  ]);

  return (
    <HowItWorks
      eyebrow={t('howItWorks.eyebrow')}
      title={t('howItWorks.title')}
      intro={t('howItWorks.intro')}
      cta={t('howItWorks.cta')}
      ctaHref={ROUTES.services}
      steps={[
        {
          number: t('howItWorks.step1.number'),
          title: t('howItWorks.step1.title'),
          description: t('howItWorks.step1.description'),
          image: settings.howItWorksSteps?.[0]?.image,
        },
        {
          number: t('howItWorks.step2.number'),
          title: t('howItWorks.step2.title'),
          description: t('howItWorks.step2.description'),
          image: settings.howItWorksSteps?.[1]?.image,
        },
        {
          number: t('howItWorks.step3.number'),
          title: t('howItWorks.step3.title'),
          description: t('howItWorks.step3.description'),
          image: settings.howItWorksSteps?.[2]?.image,
        },
      ]}
    />
  );
}
