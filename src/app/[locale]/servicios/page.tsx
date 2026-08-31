import { setRequestLocale, getTranslations } from 'next-intl/server';
import { sanityFetch } from '@/sanity/lib/fetch';
import { SERVICIOS_PAGE_QUERY } from '@/sanity/queries';
import { PageHero } from '@/components/sections/PageHero';
import type { ServiciosPage } from '@/sanity/types';
import type { Locale } from '@/i18n/routing';
import type { Metadata } from 'next';
import { SanityImage as Image } from '@/components/ui/SanityImage';
import { urlFor } from '@/sanity/image';
import { buildMetadata } from '@/lib/seo/metadata';
import { CLINIC_ICONS } from '@/data/clinicIcons';
import { ServicesClinicsAndUnits } from '@/components/sections/services/ServicesClinicsAndUnits';
import { CtaBlock } from '@/components/ui/CtaBlock';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ServicesPremiumIntro } from '@/components/sections/ServicesPremiumIntro';
import { HeroPreload } from '@/components/seo/HeroPreload';
import { BreadcrumbListJsonLd } from '@/components/seo/JsonLd';
import { ROUTES } from '@/config/routes';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return buildMetadata({
    title: t('servicesTitle'),
    description: t('servicesDescription'),
    locale: locale as Locale,
    pathname: '/servicios',
  });
}

const CLINIC_SLUGS = [
  'breast', 'lung', 'prostate', 'cns', 'headNeck', 'thoracic',
  'hepatic', 'renal', 'gastric', 'gynecological', 'urinary',
  'digestive', 'skin', 'gastrointestinal',
] as const;

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [services, t, tNav] = await Promise.all([
    sanityFetch<ServiciosPage | null>({ query: SERVICIOS_PAGE_QUERY, tags: ['serviciosPage'] }),
    getTranslations({ locale, namespace: 'services' }),
    getTranslations({ locale, namespace: 'navigation' }),
  ]);

  const clinics = CLINIC_SLUGS.map((slug) => ({
    slug,
    name: t(`clinics.${slug}` as Parameters<typeof t>[0]),
  }));

  const complementaryUnits = [
    { name: t('complementary.endos.name'), description: t('complementary.endos.description'), link: t('complementary.endos.link') },
    { name: t('complementary.cuidare.name'), description: t('complementary.cuidare.description'), link: t('complementary.cuidare.link') },
    { name: t('complementary.haranna.name'), description: t('complementary.haranna.description'), link: t('complementary.haranna.link') },
    { name: t('complementary.kalika.name'), description: t('complementary.kalika.description'), link: t('complementary.kalika.link') },
  ];

  const commercialPartners = [
    { name: t('partners.sanvite.name'), description: t('partners.sanvite.description'), link: "https://sanvite.com/" },
    { name: t('partners.aster.name'), description: t('partners.aster.description'), link: "https://asterclinic.mx/" },
    { name: t('partners.sedi.name'), description: t('partners.sedi.description'), link: "https://www.laboratoriosedi.com/" },
    { name: t('partners.breeze.name'), description: t('partners.breeze.description'), link: "https://www.instagram.com/breezeandbluee/" },
    { name: t('partners.vocalia.name'), description: t('partners.vocalia.description'), link: "https://www.otorrinolaringologos.com/" },
  ];

  return (
    <>
      <HeroPreload name="services" />
      <BreadcrumbListJsonLd
        locale={locale}
        items={[
          { href: ROUTES.home, name: tNav('home') },
          { href: ROUTES.services, name: tNav('services') },
        ]}
      />
    <div className="flex flex-col flex-1">
      {/* ─── HERO ─── */}
      <PageHero
        imageSrc="/heros/services-hero-desktop.webp"
        mobileImageSrc="/heros/services-hero-mobile.webp"
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
        description={t('hero.description')}
        extraDim
        solidLeftBand
      />

      {/* ─── PREMIUM INTRO ─── */}
      <ServicesPremiumIntro
        lead={t('main.lead')}
        feature1Title={t('main.feature1Title')}
        feature1Stat={t('main.feature1Stat')}
        feature2Title={t('main.feature2Title')}
        feature2Stat={t('main.feature2Stat')}
        feature3Title={t('main.feature3Title')}
        feature3Stat={t('main.feature3Stat')}
      />

      {/* ─── CLÍNICAS + UNIDADES COMPLEMENTARIAS ─── */}
      <ServicesClinicsAndUnits
        clinics={clinics.map(({ slug, name }) => ({ slug, name, icon: CLINIC_ICONS[slug] }))}
        clinicsEyebrow={t('clinics.eyebrow')}
        clinicsTitle={t('clinics.title')}
        clinicsDescription={t('clinics.description')}
        clinicsStat={t('main.feature1Stat')}
        clinicsSectionImage={services?.clinicsSectionImage}
        clinicsImageAlt={t('clinics.title')}
        complementaryUnits={complementaryUnits}
        complementaryEyebrow={t('complementary.eyebrow')}
        complementaryTitle={t('complementary.title')}
        complementaryDescription={t('complementary.description')}
        complementaryUnitLabel={t('complementary.unitLabel')}
        complementaryLinkLabel={t('complementary.knowMore')}
        complementaryStat={t('main.feature2Stat')}
      />

      {/* ─── IMAGE BREAK — Enfoque ─── */}
      {services?.enfoqueImage?.asset && (
        <div className="bg-white py-14 md:py-20">
          <div className="container-onkimia">
            <div className="relative w-full aspect-[16/6] rounded-3xl overflow-hidden">
              <Image
                src={urlFor(services.enfoqueImage).width(1920).height(720).format('webp').quality(85).url()}
                alt={t('main.feature1Title')}
                fill
                sizes="(max-width: 1440px) 100vw, 1440px"
                className="object-cover"
                placeholder={services.enfoqueImage?.asset?.metadata?.lqip ? 'blur' : 'empty'}
                blurDataURL={services.enfoqueImage?.asset?.metadata?.lqip ?? undefined}
              />
            </div>
          </div>
        </div>
      )}

      {/* ─── TECNOLOGÍA AVANZADA ─── */}
      {/* <CtaBlock
        eyebrow={t('main.eyebrow')}
        title={t('main.feature3Title')}
        description={t('main.feature3Description')}
        stat={t('main.feature3Stat')}
      /> */}

      {/* ─── 4. SOCIOS COMERCIALES ─── */}
      <section className="bg-gray-50 py-20 md:py-28">
        <div className="container-onkimia">
          <SectionHeader
            align="left"
            eyebrow={t('partners.eyebrow')}
            title={t('partners.title')}
            titleClassName="mb-14"
          />

          {/* flex (not grid) so an incomplete last row centers its cards
              instead of left-aligning under a fixed column track */}
          <div className="flex flex-wrap justify-center gap-4">
            {commercialPartners.map((partner) => (
              <article
                key={partner.name}
                className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(33.333%-0.667rem)] bg-white border border-black/[0.07] rounded-2xl p-7 flex flex-col gap-4 hover:border-primary/20 hover:shadow-sm transition-all duration-200"
              >
                {/* Name as wordmark placeholder */}
                <div className="h-12 flex items-center">
                  <span className="font-serif text-2xl text-primary">{partner.name}</span>
                </div>
                <div className="h-px bg-black/[0.05]" aria-hidden="true"/>
                <p className="text-secondary text-sm leading-relaxed flex-1">{partner.description}</p>
                {partner.link && partner.link !== '#' ? (
                  <a
                    href={partner.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-primary text-sm font-medium hover:text-primary/60 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-sm"
                  >
                    {t('partners.visitWebsite')}
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4"/>
                    </svg>
                  </a>
                ) : (
                  <span className="text-secondary/50 text-sm">{t('partners.visitWebsite')}</span>
                )}
              </article>
            ))}
          </div>

          {/* ─── IMAGE BREAK 3 — Partners ─── */}
          {services?.partnersImage?.asset && (
            <div className="mt-14">
              <div className="relative w-full aspect-[16/6] rounded-3xl overflow-hidden">
                <Image
                  src={urlFor(services.partnersImage).width(1920).height(720).format('webp').quality(85).url()}
                  alt={t('partners.title')}
                  fill
                  sizes="(max-width: 1440px) 100vw, 1440px"
                  className="object-cover"
                  placeholder={services.partnersImage?.asset?.metadata?.lqip ? 'blur' : 'empty'}
                  blurDataURL={services.partnersImage?.asset?.metadata?.lqip ?? undefined}
                />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ─── 5. CTA ─── */}
      <CtaBlock
        eyebrow={t('cta.eyebrow')}
        title={t('cta.title')}
        description={t('cta.description')}
        href="/contacto#contact-form"
        buttonLabel={t('cta.button')}
        grow
      />
    </div>
    </>
  );
}
