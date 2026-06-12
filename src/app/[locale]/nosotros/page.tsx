import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { sanityFetch } from '@/sanity/lib/fetch';
import { TESTIMONIALS_QUERY, FAQS_BY_PAGE_QUERY, SITE_SETTINGS_QUERY, ABOUT_PAGE_QUERY } from '@/sanity/queries';
import { getLocalized } from '@/sanity/lib/localization';
import { HeroSection } from '@/components/ui/HeroSection';
import { TestimonialCarousel } from '@/components/ui/TestimonialCarousel';
import { FAQCarousel } from '@/components/ui/FAQCarousel';
import type { Locale } from '@/i18n/routing';
import type { Metadata } from 'next';
import type { Testimonial, FAQ, SiteSettings, AboutPage } from '@/sanity/types';
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

  const [settings, testimonials, faqs, aboutPage] = await Promise.all([
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
    sanityFetch<AboutPage | null>({
      query: ABOUT_PAGE_QUERY,
      tags: ['aboutPage'],
    }),
  ]);

  return (
    <>
      {/* ─── HERO ─── */}
      <HeroSection
        image={settings.aboutHeroImage}
        title={getLocalized(aboutPage?.heroTitle, locale) || t('hero.title')}
        subtitle={getLocalized(settings.tagline, locale)}
        description={getLocalized(aboutPage?.heroDescription, locale) || t('hero.description')}
        align="left"
        height="md"
        overlay="medium"
      />

      {/* ─── MÁS QUE MEDICINA ─── */}
      <section className="container-onkimia py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal leading-none mb-2 text-ink">
              {getLocalized(aboutPage?.moreTitleLine1, locale) || t('moreThanMedicine.headingLine1')}<br />
              <span className="inline-block border-b-2 md:border-b-4 border-teal pb-1">
                {getLocalized(aboutPage?.moreTitleUnderlined, locale) || t('moreThanMedicine.headingUnderlined')}
              </span>{getLocalized(aboutPage?.moreTitleSuffix, locale) || t('moreThanMedicine.headingSuffix')}
            </h2>
          </div>

          <p className="text-lg text-gray-warm leading-relaxed mb-12 max-w-4xl">
            {getLocalized(aboutPage?.moreDescription, locale) || t('moreThanMedicine.description')}
          </p>

          {/* Lista de servicios diferenciales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {(aboutPage?.differentialServices ?? []).map((item, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-4 bg-cream rounded-lg border border-line"
              >
                <div className="w-2 h-2 bg-teal rounded-full flex-shrink-0 mt-2" />
                <div>
                  <span className="text-ink">{getLocalized(item.title, locale)}</span>
                  {item.link && (
                    <a
                      href={item.link}
                      className="text-teal hover:text-teal-soft text-sm ml-2 underline"
                    >
                      ({getLocalized(item.linkText, locale) || t('downloadHere')})
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CUERPO, MENTE Y AMBIENTE ─── */}
      <section className="bg-cream py-16 md:py-24">
        <div className="container-onkimia">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal leading-none text-ink">
                {getLocalized(aboutPage?.bodyMindTitlePrefix, locale) || t('bodyMind.headingPrefix')}{' '}
                <span className="relative inline-block pb-6">
                  {getLocalized(aboutPage?.bodyMindTitleUnderlined, locale) || t('bodyMind.headingUnderlined')}
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-teal" />
                </span>{getLocalized(aboutPage?.bodyMindTitleSuffix, locale) || t('bodyMind.headingSuffix')}
              </h2>
            </div>

            <p className="text-lg text-gray-warm leading-relaxed mb-12 max-w-3xl">
              {getLocalized(aboutPage?.bodyMindDescription, locale) || t('bodyMind.description')}
            </p>

            {/* Large image placeholder */}
            <div className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-3xl overflow-hidden bg-cream-2 mb-12">
              <div className="absolute inset-0 flex items-center justify-center text-gray-soft">
                {/* Placeholder for therapy/treatment image */}
              </div>
            </div>

            {/* Two info cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-2xl border border-line">
                <h3 className="font-serif text-2xl text-ink mb-4">
                  {getLocalized(aboutPage?.supportGroupTitle, locale) || t('supportGroup.title')}
                </h3>
                <p className="text-gray-warm leading-relaxed">
                  {getLocalized(aboutPage?.supportGroupDescription, locale) || t('supportGroup.description')}
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-line">
                <h3 className="font-serif text-2xl text-ink mb-4">
                  {getLocalized(aboutPage?.awareTitle, locale) || 'Onkimia Aware'}
                </h3>
                <p className="text-gray-warm leading-relaxed">
                  {getLocalized(aboutPage?.awareDescription, locale) || t('aware.description')}
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
            <h2 className="font-serif text-4xl md:text-5xl text-ink mb-4">
              {getLocalized(aboutPage?.testimonialsTitle, locale) || t('testimonials.title')}
            </h2>
            <p className="text-lg text-gray-warm leading-relaxed">
              {getLocalized(aboutPage?.testimonialsSubtitle, locale) || t('testimonials.subtitle')}
            </p>
          </div>
          <TestimonialCarousel testimonials={testimonials} locale={locale} />
        </section>
      )}

      {/* ─── ¿TIENES DUDAS? ─── */}
      <section className="bg-ink py-16 md:py-24">
        <div className="container-onkimia">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal leading-none mb-6 text-white">
              <span className="inline-block border-b-2 md:border-b-4 border-teal pb-1">
                {getLocalized(aboutPage?.doubtsTitleUnderlined, locale) || t('doubts.headingUnderlined')}
              </span>{' '}
              {getLocalized(aboutPage?.doubtsTitleSuffix, locale) || t('doubts.headingSuffix')}
            </h2>
            <p className="text-lg text-white/70 leading-relaxed mb-6">
              {getLocalized(aboutPage?.doubtsDescription, locale) || t('doubts.description')}
            </p>
            <Link
              href="/contacto#contact-form"
              className="inline-block bg-teal hover:bg-teal-soft text-white font-medium px-8 py-3 rounded-lg transition-colors"
            >
              {tCommon('contactUs')}
            </Link>
          </div>
        </div>
      </section>

      {/* ─── PREGUNTAS FRECUENTES ─── */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-onkimia">
          <div className="mb-12 max-w-6xl mx-auto">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal leading-none text-ink">
              <span className="inline-block border-b-2 md:border-b-4 border-teal pb-1">
                {getLocalized(aboutPage?.faqTitleUnderlined, locale) || t('faq.headingUnderlined')}
              </span>{getLocalized(aboutPage?.faqTitleSuffix, locale) || t('faq.headingSuffix')}
            </h2>
          </div>
          {faqs.length > 0 ? (
            <FAQCarousel faqs={faqs} locale={locale} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-warm">
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
