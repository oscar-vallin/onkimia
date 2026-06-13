import { setRequestLocale, getTranslations } from 'next-intl/server';
import { sanityFetch } from '@/sanity/lib/fetch';
import { TESTIMONIALS_QUERY, SITE_SETTINGS_QUERY, ABOUT_PAGE_QUERY } from '@/sanity/queries';
import { getLocalized } from '@/sanity/lib/localization';
import { HeroSection } from '@/components/ui/HeroSection';
import { MoreThanMedicine } from '@/components/sections/MoreThanMedicine';
import { InitiativeCards } from '@/components/sections/InitiativeCards';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { ContactCTA } from '@/components/sections/ContactCTA';
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
    sanityFetch<SiteSettings>({
      query: SITE_SETTINGS_QUERY,
      tags: ['siteSettings'],
    }),
    sanityFetch<Testimonial[]>({
      query: TESTIMONIALS_QUERY,
      tags: ['testimonial'],
    }),
    sanityFetch<AboutPage | null>({
      query: ABOUT_PAGE_QUERY,
      params: { locale },
      tags: ['aboutPage'],
    }),
  ]);

  return (
    <>
      {/* ─── HERO ─── */}
      <HeroSection
        eyebrow="NOSOTROS · ONCOLOGÍA INTEGRAL"
        title={getLocalized(aboutPage?.heroTitle, locale) || t('hero.title')}
        description={getLocalized(aboutPage?.heroDescription, locale) || t('hero.description')}
        image={settings.aboutHeroImage}
        height="full"
        overlay="gradient"
        align="left"
        primaryCta={{ label: t('cta.button'), href: '/contacto' }}
      />

      {/* ─── MÁS QUE MEDICINA ─── */}
      <MoreThanMedicine
        titleLine1={getLocalized(aboutPage?.moreTitleLine1, locale) || t('moreThanMedicine.headingLine1')}
        titleUnderlined={getLocalized(aboutPage?.moreTitleUnderlined, locale) || t('moreThanMedicine.headingUnderlined')}
        titleSuffix={getLocalized(aboutPage?.moreTitleSuffix, locale) || t('moreThanMedicine.headingSuffix')}
        description={getLocalized(aboutPage?.moreDescription, locale) || t('moreThanMedicine.description')}
        services={(aboutPage?.differentialServices ?? []).map((s) => ({
          title: getLocalized(s.title, locale) || '',
          link: s.link,
          linkText: getLocalized(s.linkText, locale) || undefined,
        }))}
      />

      {/* ─── CUERPO, MENTE Y CUIDADO INTEGRAL + INICIATIVAS ─── */}
      <InitiativeCards
        bodyMindTitlePrefix={getLocalized(aboutPage?.bodyMindTitlePrefix, locale) || t('bodyMind.headingPrefix')}
        bodyMindTitleUnderlined={getLocalized(aboutPage?.bodyMindTitleUnderlined, locale) || t('bodyMind.headingUnderlined')}
        bodyMindTitleSuffix={getLocalized(aboutPage?.bodyMindTitleSuffix, locale) || t('bodyMind.headingSuffix')}
        bodyMindDescription={getLocalized(aboutPage?.bodyMindDescription, locale) || t('bodyMind.description')}
        supportGroupTitle={getLocalized(aboutPage?.supportGroupTitle, locale) || t('supportGroup.title')}
        supportGroupDescription={getLocalized(aboutPage?.supportGroupDescription, locale) || t('supportGroup.description')}
        awareTitle={getLocalized(aboutPage?.awareTitle, locale) || 'Onkimia Aware'}
        awareDescription={getLocalized(aboutPage?.awareDescription, locale) || t('aware.description')}
      />

      {/* ─── TESTIMONIALES + REIKI IMAGE ─── */}
      <TestimonialsSection
        title={getLocalized(aboutPage?.testimonialsTitle, locale) || t('testimonials.title')}
        subtitle={getLocalized(aboutPage?.testimonialsSubtitle, locale) || t('testimonials.subtitle')}
        testimonials={testimonials}
        locale={locale}
        reikyImage={aboutPage?.reikyImage}
      />

      {/* ─── ¿TIENES DUDAS? CTA ─── */}
      <ContactCTA
        titleUnderlined={getLocalized(aboutPage?.doubtsTitleUnderlined, locale) || t('doubts.headingUnderlined')}
        titleSuffix={getLocalized(aboutPage?.doubtsTitleSuffix, locale) || t('doubts.headingSuffix')}
        description={getLocalized(aboutPage?.doubtsDescription, locale) || t('doubts.description')}
        buttonLabel={t('cta.button')}
        buttonHref="/contacto"
      />

      {/* ─── FAQ CON DOCTORES ─── */}
      {aboutPage?.faqItems && aboutPage.faqItems.length > 0 && (
        <DoctorFAQSection
          eyebrow={t('faq.eyebrow')}
          title={`${getLocalized(aboutPage.faqTitleUnderlined, locale) || t('faq.headingUnderlined')} *${getLocalized(aboutPage.faqTitleSuffix, locale) || t('faq.headingSuffix')}*`}
          items={aboutPage.faqItems}
        />
      )}
    </>
  );
}
