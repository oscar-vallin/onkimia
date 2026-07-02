import { getTranslations } from 'next-intl/server';
import { sanityFetch } from '@/sanity/lib/fetch';
import { SITE_SETTINGS_QUERY } from '@/sanity/queries';
import type { SiteSettings } from '@/sanity/types';
import { Studies } from '@/components/sections/Studies';
import type { SectionProps } from '@/components/sections/registry';

export async function StudiesSection({}: SectionProps) {
  const [settings, t] = await Promise.all([
    sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
    getTranslations('home'),
  ]);

  return (
    <Studies
      eyebrow={t('studies.eyebrow')}
      title={t('studies.title')}
      intro={t('studies.intro')}
      labels={[
        { title: t('studies.mri.title'),      subtitle: t('studies.mri.subtitle') },
        { title: t('studies.bio.title'),      subtitle: t('studies.bio.subtitle') },
        { title: t('studies.cardio.title'),   subtitle: t('studies.cardio.subtitle') },
        { title: t('studies.genomics.title'), subtitle: t('studies.genomics.subtitle') },
      ]}
      gallery={settings.studiesGallery}
    />
  );
}
