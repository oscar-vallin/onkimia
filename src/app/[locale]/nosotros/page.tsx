import { setRequestLocale, getTranslations } from 'next-intl/server';
import { sanityFetch } from '@/sanity/lib/fetch';
import { TESTIMONIALS_QUERY, SITE_SETTINGS_QUERY, ABOUT_PAGE_QUERY } from '@/sanity/queries';
import { getLocalized } from '@/sanity/lib/localization';
import { PageHero } from '@/components/sections/PageHero';
import { urlFor } from '@/sanity/image';
import { MisionSection } from '@/components/sections/MisionSection';
import { MoreThanMedicine } from '@/components/sections/MoreThanMedicine';
import { Enfoque360Section } from '@/components/sections/Enfoque360Section';
import { InitiativeCards } from '@/components/sections/InitiativeCards';
import { TestimonialsSection } from '@/components/sections/TestimonialsSection';
import { ContactCTA } from '@/components/sections/ContactCTA';
import { DoctorFAQSection } from '@/components/sections/DoctorFAQSection';
import { AppBanner } from '@/components/sections/AppBanner';
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const differentialServices = (t.raw('moreThanMedicine.services') as any[]) ?? [];

  return (
    <>
      {/* ─── HERO ─── */}
      {/* <PageHero
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
        description={t('hero.description')}
        primaryCta={{ label: t('cta.button'), href: '/contacto#contact-form' }}
        imageSrc='/test-about/about-hero-right-hq.jpg'
        //imageSrc={settings.aboutHeroImage ? urlFor(settings.aboutHeroImage).width(1920).quality(82).format('webp').url() : undefined}
        mobileImageSrc="/mobile-hero/about-hero.jpg"
        blurDataURL={settings.aboutHeroImage?.asset?.metadata?.lqip ?? undefined}
        imageAlt=""
        mobileObjectPosition="object-[center_25%]"
       
        
        solidLeftBand
      /> */}

      {/* ─── NUESTRA MISIÓN ─── */}
      <MisionSection
        eyebrow={t('mision.eyebrow')}
        title={t('mision.title')}
        description={t('mision.description')}
      />

      {/* ─── 1. MÁS QUE MEDICINA ─── */}
      <MoreThanMedicine
        eyebrow={t('moreThanMedicine.eyebrow')}
        titleLine1={t('moreThanMedicine.headingLine1')}
        titleUnderlined={t('moreThanMedicine.headingUnderlined')}
        titleSuffix={t('moreThanMedicine.headingSuffix')}
        description={t('moreThanMedicine.description')}
        services={differentialServices}
      />

      {/* ─── 2. CUERPO, MENTE Y CUIDADO INTEGRAL ─── */}
      <Enfoque360Section
        eyebrow={t('enfoque360.eyebrow')}
        title={t('enfoque360.title')}
        description={t('enfoque360.description')}
        stat1Value={t('enfoque360.stat1Value')}
        stat1Label={t('enfoque360.stat1Label')}
        stat2Value={t('enfoque360.stat2Value')}
        stat2Label={t('enfoque360.stat2Label')}
        image={aboutPage?.enfoque360Image}
        items={[
          { title: t('enfoque360.items.item1Title'), description: t('enfoque360.items.item1Description') },
          { title: t('enfoque360.items.item2Title'), description: t('enfoque360.items.item2Description') },
          { title: t('enfoque360.items.item3Title'), description: t('enfoque360.items.item3Description') },
        ]}
      />

      {/* ─── 3 & 4. GRUPO DE APOYO + ONKIMIA AWARE ─── */}
      <InitiativeCards
        eyebrow={t('initiativeCards.eyebrow')}
        description={t('initiativeCards.description')}
        supportGroupTitle={t('supportGroup.title')}
        supportGroupDescription={t('supportGroup.description')}
        supportGroupCategory={t('supportGroup.category')}
        supportGroupLink={t('supportGroup.link')}
        supportGroupImage={aboutPage?.supportGroupImage}
        awareTitle="Onkimia Aware"
        awareDescription={t('aware.description')}
        awareCategory={t('aware.category')}
        awareLink={t('aware.link')}
        awareImage={aboutPage?.awareImage}
      />

      {/* ─── 5. CARRUSEL DE TESTIMONIALES ─── */}
      <TestimonialsSection
        title={getLocalized(aboutPage?.testimonialsTitle, locale) || t('testimonials.title')}
        subtitle={getLocalized(aboutPage?.testimonialsSubtitle, locale) || t('testimonials.subtitle')}
        testimonials={testimonials}
        locale={locale}
        reikyImage={aboutPage?.reikyImage}
      />

      {/* ─── 6. FAQ CON FOTO DE DOCTOR ─── */}
      {aboutPage?.faqItems && aboutPage.faqItems.length > 0 && (
        <DoctorFAQSection
          eyebrow={t('faq.eyebrow')}
          title={t('faq.title')}
          items={aboutPage.faqItems}
        />
      )}

      {/* ─── 7. CONTÁCTANOS ─── */}
      <ContactCTA
        titleUnderlined={t('doubts.headingUnderlined')}
        titleSuffix={t('doubts.headingSuffix')}
        description={t('doubts.description')}
        buttonLabel={t('cta.button')}
        buttonHref="/contacto"
      />

      {/* ─── APP ONKIMIA ─── */}
      <AppBanner
        title={t('appBanner.title')}
        description={t('appBanner.description')}
        appStoreLabel={t('appBanner.appStore')}
        googlePlayLabel={t('appBanner.googlePlay')}
      />
    </>
  );
}
