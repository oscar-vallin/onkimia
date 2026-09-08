import { getTranslations } from 'next-intl/server';
import { sanityFetch } from '@/sanity/lib/fetch';
import { SITE_SETTINGS_QUERY } from '@/sanity/queries';
import type { SiteSettings } from '@/sanity/types';
import { AppointmentCta } from '@/components/sections/AppointmentCta';
import { ROUTES } from '@/config/routes';
import type { SectionProps } from '@/components/sections/registry';

export async function AppointmentCtaSection({}: SectionProps) {
  const [settings, t] = await Promise.all([
    sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
    getTranslations('home'),
  ]);

  return (
    <AppointmentCta
      title={t('appointment.title')}
      cta={t('appointment.cta')}
      ctaHref={ROUTES.contactForm}
      backgroundImage={settings.appointmentCtaBgImage}
    />
  );
}
