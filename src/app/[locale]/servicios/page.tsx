import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { sanityFetch } from '@/sanity/lib/fetch';
import { SITE_SETTINGS_QUERY, MAIN_SERVICES_QUERY } from '@/sanity/queries';
import { HeroSection } from '@/components/ui/HeroSection';
import type { Service, SiteSettings } from '@/sanity/types';
import type { Locale } from '@/i18n/routing';
import type { Metadata } from 'next';
import Image from 'next/image';
import { urlFor } from '@/sanity/image';
import { buildMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return buildMetadata({ title: t('servicesTitle'), description: t('servicesDescription'), locale: locale as import('@/i18n/routing').Locale, pathname: '/servicios' });
}

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

   const [settings, services] = await Promise.all([
      sanityFetch<SiteSettings>({
        query: SITE_SETTINGS_QUERY,
        tags: ['siteSettings'],
      }),
      sanityFetch<Service>({
        query: MAIN_SERVICES_QUERY,
        tags: ['service'],
      }),
    ]);

  const t = await getTranslations({ locale, namespace: 'services' });

  console.log(services)

  const clinics = [
    { name: t('clinics.breast') },
    { name: t('clinics.lung') },
    { name: t('clinics.prostate') },
    { name: t('clinics.cns') },
    { name: t('clinics.headNeck') },
    { name: t('clinics.thoracic') },
    { name: t('clinics.hepatic') },
    { name: t('clinics.renal') },
    { name: t('clinics.gastric') },
    { name: t('clinics.gynecological') },
    { name: t('clinics.urinary') },
    { name: t('clinics.digestive') },
    { name: t('clinics.skin') },
    { name: t('clinics.gastrointestinal') },
  ];

  const complementaryUnits = [
    {
      name: t('complementary.endos.name'),
      description: t('complementary.endos.description'),
      link: '#', 
    },
    {
      name: t('complementary.cuidare.name'),
      description: t('complementary.cuidare.description'),
      link: '#', 
    },
    {
      name: t('complementary.haranna.name'),
      description: t('complementary.haranna.description'),
      link: '#', 
    },
    {
      name: t('complementary.kalika.name'),
      description: t('complementary.kalika.description'),
      link: '#', 
    },
  ];

  // Socios Comerciales
  const commercialPartners = [
    {
      name: t('partners.sanvite.name'),
      description: t('partners.sanvite.description'),
      link: '#',
    },
    {
      name: t('partners.aster.name'),
      description: t('partners.aster.description'),
      link: '#',
    },
    {
      name: t('partners.sedi.name'),
      description: t('partners.sedi.description'),
      link: '#',
    },
    {
      name: t('partners.breeze.name'),
      description: t('partners.breeze.description'),
      link: '#',
    },
    {
      name: t('partners.vocalia.name'),
      description: t('partners.vocalia.description'),
      link: '#',
    },
  ];

  return (
    <>
      <HeroSection
        image={settings.homeHeroImage}
        title={t('hero.title')}
        subtitle={t('hero.description')}
        description=""
        align="left"
        height="md"
        overlay="medium"
      />
      {/* ─── SECCIÓN 1 — Atención Oncológica Especializada ─── */}
      <section className="container-onkimia py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal leading-tight mb-2 text-ink text-balance">
              {locale === 'es' ? (
                <>
                  Atención Oncológica{' '}
                  <span className="inline-block border-b-2 md:border-b-4 border-teal pb-1">
                    Especializada
                  </span>
                </>
              ) : (
                <>
                  Specialized{' '}
                  <span className="inline-block border-b-2 md:border-b-4 border-teal pb-1">
                    Oncology Care
                  </span>
                </>
              )}
            </h2>
          </div>

          <p className="text-lg text-gray-warm leading-relaxed mb-12 max-w-4xl">
            {t('main.description')}
          </p>
          <div className="relative w-full aspect-[16/9] rounded-3xl overflow-hidden mb-8 shadow-xl bg-ink">
            {services?.heroImage?.asset && (
              <Image
                src={urlFor(services?.heroImage).width(2400).quality(85).format('webp').url()}
                alt={t('hero.title')}
                fill
                priority
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 1280px) 100vw, 1200px"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-ink/70 to-ink/40 z-10" />
            <div className="absolute inset-0 z-20 flex items-center justify-center px-8">
              <div className="text-white max-w-2xl">
                <ul className="space-y-3 text-lg md:text-xl">
                  <li className="flex items-start gap-3">
                    <span className="text-teal-soft mt-1">●</span>
                    <span>{t('main.feature1')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-teal-soft mt-1">●</span>
                    <span>{t('main.feature2')}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-teal-soft mt-1">●</span>
                    <span>{t('main.feature3')}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <p className="text-center text-lg text-gray-warm leading-relaxed max-w-3xl mx-auto">
            {t('main.prevention')}
          </p>
        </div>
      </section>

      {/* ─── SECCIÓN 2 — Clínicas de Atención Oncológica ─── */}
      <section className="bg-cream py-16 md:py-24">
        <div className="container-onkimia">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal leading-tight mb-2 text-ink text-balance">
                {locale === 'es' ? (
                  <>
                    Clínicas de Atención{' '}
                    <span className="inline-block border-b-2 md:border-b-4 border-teal pb-1">
                      Oncológica
                    </span>
                  </>
                ) : (
                  <>
                    Oncology Care{' '}
                    <span className="inline-block border-b-2 md:border-b-4 border-teal pb-1">
                      Clinics
                    </span>
                  </>
                )}
              </h2>
            </div>

            <p className="text-lg text-gray-warm leading-relaxed mb-12 max-w-4xl">
              {t('clinics.description')}
            </p>
            <div className="relative w-full min-h-[420px] md:aspect-[16/9] md:h-auto rounded-3xl overflow-hidden bg-gradient-to-br from-ink to-ink-2">
              {services?.clinicsSectionImage?.asset && (
                <Image
                  src={urlFor(services?.clinicsSectionImage).width(2400).quality(85).format('webp').url()}
                  alt={t('clinics.title')}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1280px) 100vw, 1200px"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-ink/60 to-transparent z-10" />
              <div className="relative z-20 flex items-center px-8 md:px-16 py-10 md:absolute md:inset-0 md:py-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-3 text-white max-w-3xl">
                  {clinics.map((clinic, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-teal-soft mt-1">●</span>
                      <span className="text-base md:text-lg">{clinic.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="container-onkimia py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          {/* Title with underline decoration */}
          <div className="mb-12">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal leading-tight mb-2 text-ink text-balance">
              {locale === 'es' ? (
                <>
                  <span className="inline-block border-b-2 md:border-b-4 border-teal pb-1">
                    Servi
                  </span>cios Complementarios
                </>
              ) : (
                <>
                  <span className="inline-block border-b-2 md:border-b-4 border-teal pb-1">
                    Comple
                  </span>mentary Services
                </>
              )}
            </h2>
          </div>

          <p className="text-lg text-gray-warm leading-relaxed mb-12 max-w-4xl">
            {t('complementary.description')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {complementaryUnits.map((unit, index) => (
              <div
                key={index}
                className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-teal to-teal-soft p-8 text-white min-h-[280px] flex flex-col justify-between"
              >
                <div>
                  <h3 className="font-serif text-2xl md:text-3xl mb-4">
                    {unit.name}
                  </h3>
                  <p className="text-white/90 leading-relaxed">
                    {unit.description}
                  </p>
                </div>
                {unit.link && (
                  <a
                    href={unit.link}
                    className="inline-flex items-center gap-2 text-white hover:text-white/80 transition-colors mt-4"
                  >
                    <span className="text-sm font-medium">
                      {t('complementary.moreInfo')}
                    </span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-cream py-16 md:py-24">
        <div className="container-onkimia">
          <div className="max-w-6xl mx-auto">
            {/* Title with underline decoration */}
            <div className="mb-12">
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal leading-tight mb-2 text-ink text-balance">
                {locale === 'es' ? (
                  <>
                    <span className="inline-block border-b-2 md:border-b-4 border-teal pb-1">
                      Socios Come
                    </span>rciales
                  </>
                ) : (
                  <>
                    <span className="inline-block border-b-2 md:border-b-4 border-teal pb-1">
                      Commercial Pa
                    </span>rtners
                  </>
                )}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {commercialPartners.map((partner, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl p-6 border border-line hover:border-teal hover:shadow-lg transition-all transition-shadow"
                >
                  <div className="flex items-center justify-center h-16 mb-4">
                    <h3 className="font-serif text-xl text-ink">
                      {partner.name}
                    </h3>
                  </div>
                  <p className="text-gray-warm text-sm leading-relaxed mb-4">
                    {partner.description}
                  </p>
                  {partner.link && (
                    <a
                      href={partner.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-teal hover:text-teal-soft transition-colors text-sm font-medium"
                    >
                      <span>{t('partners.visitWebsite')}</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="bg-ink py-16 md:py-24">
        <div className="container-onkimia">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-lg text-white/70 leading-relaxed mb-8">
              {t('cta.description')}
            </p>
            <Link
              href="/contacto#contact-form"
              className="inline-block bg-teal hover:bg-teal-soft text-white font-medium px-8 py-3 rounded-lg transition-colors text-lg"
            >
              {t('cta.button')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
