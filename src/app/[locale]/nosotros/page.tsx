import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { sanityFetch } from '@/sanity/lib/fetch';
import { TESTIMONIALS_QUERY, FAQS_BY_PAGE_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/queries';
import { getLocalized } from '@/sanity/lib/localization';
import { HeroSection } from '@/components/ui/HeroSection';
import { TestimonialCarousel } from '@/components/ui/TestimonialCarousel';
import { FAQCarousel } from '@/components/ui/FAQCarousel';
import type { Locale } from '@/i18n/routing';
import type { Metadata } from 'next';
import type { Testimonial, FAQ, SiteSettings } from '@/sanity/types';
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

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('about');
  const tCommon = await getTranslations('common');

  const [settings, testimonials, faqs] = await Promise.all([
    sanityFetch<SiteSettings>({
      query: SITE_SETTINGS_QUERY,
      tags: ['siteSettings'],
    }),
    sanityFetch<Testimonial[]>({
      query: TESTIMONIALS_QUERY,
      tags: ['testimonial'],
    }),
    sanityFetch<FAQ[]>({
      query: FAQS_BY_PAGE_QUERY,
      params: { page: 'about' },
      tags: ['faq'],
    }),
  ]);
  console.log("Site settings fetched:", settings);
  return (
    <>
      {/* ─── HERO ─── */}
      <HeroSection
        image={settings.homeHeroImage}
        title={t('hero.title')}
        subtitle={getLocalized(settings.tagline, locale)}
        description={t('hero.description')}
        align="left"
        height="md"
        overlay="medium"
      />

      {/* ─── MÁS QUE MEDICINA ─── */}
      <section className="container-onkimia py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          {/* Title with underline decoration */}
          <div className="mb-12">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-normal leading-none mb-2 text-neutral-950">
              {t('moreThanMedicine.headingLine1')}<br />
              <span className="inline-block border-b-2 md:border-b-4 border-accent-500 pb-1">
                {t('moreThanMedicine.headingUnderlined')}
              </span>{t('moreThanMedicine.headingSuffix')}
            </h2>
          </div>

          <p className="text-lg text-neutral-700 leading-relaxed mb-12 max-w-4xl">
            {t('moreThanMedicine.description')}
          </p>

          {/* Lista de servicios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {/* TODO Tanda 4: reemplazar por query CLINIC_FEATURES_QUERY */}
            {[
              { title: locale === 'es' ? 'Consulta de oncología' : 'Oncology consultation' },
              { title: locale === 'es' ? 'Concierge de seguros' : 'Insurance concierge' },
              { title: locale === 'es' ? 'Valet parking' : 'Valet parking' },
              { title: 'Hospitality' },
              { title: locale === 'es' ? 'Cabinas de infusión privadas' : 'Private infusion cabins' },
              { title: locale === 'es' ? 'Cirugía' : 'Surgery' },
              { title: locale === 'es' ? 'Hematología' : 'Hematology' },
              { title: locale === 'es' ? 'Reumatología' : 'Rheumatology' },
              {
                title: 'App Onkimia',
                link: '#', // TODO: Add actual app download link
                linkText: t('downloadHere'),
              },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-neutral-50 rounded-lg border border-neutral-200"
              >
                <div className="w-2 h-2 bg-accent-500 rounded-full flex-shrink-0 mt-2" />
                <div>
                  <span className="text-neutral-800">{item.title}</span>
                  {item.link && (
                    <a
                      href={item.link}
                      className="text-accent-600 hover:text-accent-700 text-sm ml-2 underline"
                    >
                      ({item.linkText})
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CUERPO, MENTE Y AMBIENTE ─── */}
      <section className="bg-neutral-50 py-16 md:py-24">
        <div className="container-onkimia">
          <div className="max-w-6xl mx-auto">
            {/* Title with underline decoration */}
            <div className="mb-12">
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-normal leading-none">
                {t('bodyMind.headingPrefix')}{' '}
                <span className="relative inline-block pb-6">
                  {t('bodyMind.headingUnderlined')}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent-500" />
                </span>{t('bodyMind.headingSuffix')}
              </h2>
            </div>

            <p className="text-lg text-neutral-700 mb-12 max-w-3xl">
              {t('bodyMind.description')}
            </p>

            {/* Large image placeholder */}
            <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden bg-neutral-200 mb-12">
              <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
                {/* Placeholder for therapy/treatment image */}
              </div>
            </div>

            {/* Two info cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl border border-neutral-200">
                <h3 className="text-2xl font-medium text-brand-900 mb-4">
                  {t('supportGroup.title')}
                </h3>
                <p className="text-neutral-700">
                  {t('supportGroup.description')}
                </p>
              </div>

              <div className="bg-white p-8 rounded-xl border border-neutral-200">
                <h3 className="text-2xl font-medium text-brand-900 mb-4">
                  Onkimia Aware
                </h3>
                <p className="text-neutral-700">
                  {t('aware.description')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALES ─── */}
      {testimonials.length > 0 && (
        <section className="container-onkimia py-16 md:py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-medium text-brand-900 mb-4">
              {t('testimonials.title')}
            </h2>
            <p className="text-lg text-neutral-700">
              {t('testimonials.subtitle')}
            </p>
          </div>
          <TestimonialCarousel testimonials={testimonials} locale={locale} />
        </section>
      )}

      {/* ─── ¿TIENES DUDAS? ─── */}
      <section className="container-onkimia py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-normal leading-none mb-6 text-neutral-950">
            <span className="inline-block border-b-2 md:border-b-4 border-accent-500 pb-1">
              {t('doubts.headingUnderlined')}
            </span>{' '}
            {t('doubts.headingSuffix')}
          </h2>
          <p className="text-lg text-neutral-700 mb-6">
            {t('doubts.description')}
          </p>
          <Link
            href="/contacto#contact-form"
            className="inline-block bg-accent-500 hover:bg-accent-600 text-white font-medium px-8 py-3 rounded-lg transition-colors"
          >
            {tCommon('contactUs')}
          </Link>
        </div>
      </section>

      {/* ─── PREGUNTAS FRECUENTES ─── */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-onkimia">
          <div className="mb-12 max-w-6xl mx-auto">
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-normal leading-none text-neutral-950">
              <span className="inline-block border-b-2 md:border-b-4 border-accent-500 pb-1">
                {t('faq.headingUnderlined')}
              </span>{t('faq.headingSuffix')}
            </h2>
          </div>
          {faqs.length > 0 ? (
            <FAQCarousel faqs={faqs} locale={locale} />
          ) : (
            <div className="text-center py-12">
              <p className="text-neutral-600">
                {t('faq.empty')}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

// Made with Bob
