import { setRequestLocale, getTranslations } from 'next-intl/server';
import { sanityFetch } from '@/sanity/lib/fetch';
import { TESTIMONIALS_QUERY, SITE_SETTINGS_QUERY, ABOUT_PAGE_QUERY } from '@/sanity/queries';
import { getLocalized } from '@/sanity/lib/localization';
import { AboutHero } from '@/components/sections/AboutHero';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { DoctorFAQSection } from '@/components/sections/DoctorFAQSection';
import type { Locale } from '@/i18n/routing';
import type { Metadata } from 'next';
import type { Testimonial, SiteSettings, AboutPage } from '@/sanity/types';
import { buildMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return buildMetadata({
    title: t('aboutTitle'),
    description: t('aboutDescription'),
    locale: locale as Locale,
    pathname: '/nosotros',
  });
}

export default async function NosotrosPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('about');

  const [settings, testimonials, aboutPage] = await Promise.all([
    sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
    sanityFetch<Testimonial[]>({ query: TESTIMONIALS_QUERY, tags: ['testimonial'] }),
    sanityFetch<AboutPage | null>({ query: ABOUT_PAGE_QUERY, params: { locale }, tags: ['aboutPage'] }),
  ]);

  return (
    <>
      {/* ─── HERO ─── */}
      <AboutHero
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
        description={t('hero.description')}
        ctaLabel={t('cta.button')}
        ctaHref="/contacto#contact-form"
        image={settings.aboutHeroImage}
      />

      {/* ─── CARRUSEL DE TESTIMONIALES ─── */}
      <TestimonialsSection
        title={getLocalized(aboutPage?.testimonialsTitle, locale) || t('testimonials.title')}
        subtitle={getLocalized(aboutPage?.testimonialsSubtitle, locale) || t('testimonials.subtitle')}
        testimonials={testimonials}
        locale={locale}
        reikyImage={aboutPage?.reikyImage}
      />

      {/* ─── FAQ CON FOTO DE DOCTOR ─── */}
      {aboutPage?.faqItems && aboutPage.faqItems.length > 0 && (
        <DoctorFAQSection
          eyebrow={t('faq.eyebrow')}
          title={t('faq.title')}
          items={aboutPage.faqItems}
        />
      )}
    </>
  );
}
