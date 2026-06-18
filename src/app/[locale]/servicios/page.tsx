import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { sanityFetch } from '@/sanity/lib/fetch';
import { SITE_SETTINGS_QUERY, SERVICIOS_PAGE_QUERY } from '@/sanity/queries';
import { PageHero } from '@/components/sections/PageHero';
import type { ServiciosPage, SiteSettings } from '@/sanity/types';
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
  return buildMetadata({
    title: t('servicesTitle'),
    description: t('servicesDescription'),
    locale: locale as Locale,
    pathname: '/servicios',
  });
}

/* ─── Clinic specialty icons ─── */
const clinicIcons = [
  /* Mama */ <path key="breast" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="currentColor"/>,
  /* Pulmón */ <path key="lung" d="M4 14c0 2.21 1.79 4 4 4v-4H4zm0-4v2h4V6c-2.21 0-4 1.79-4 4zm8-4v10c2.21 0 4-1.79 4-4V10c0-2.21-1.79-4-4-4zm0-2c-1.1 0-2 .9-2 2h4c0-1.1-.9-2-2-2z" fill="currentColor"/>,
  /* Próstata */ <path key="prostate" d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="none" stroke="currentColor" strokeWidth="1.5"/>,
  /* SNC */ <path key="cns" d="M9 2C6.24 2 4 4.24 4 7c0 1.86 1.02 3.47 2.53 4.33C5.6 12.18 5 13.53 5 15c0 3.31 2.69 6 6 6h1c3.31 0 6-2.69 6-6 0-1.47-.6-2.82-1.53-3.67C17.98 10.47 19 8.86 19 7c0-2.76-2.24-5-5-5h-1c-.6 0-1.18.11-1.73.29" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>,
  /* Cabeza y cuello */ <><circle key="headneck-c" cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.5"/><path key="headneck-p" d="M8 16c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v4H8v-4z" fill="none" stroke="currentColor" strokeWidth="1.5"/></>,
  /* Torácicas */ <path key="thoracic" d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 10H8v-1c0-1.33 2.67-2 4-2s4 .67 4 2v1z" fill="currentColor"/>,
  /* Hepática */ <path key="hepatic" d="M17 8C8 10 5.9 16.17 3.82 19.5 3.27 20.42 3.95 21 4.5 21c.5 0 .82-.34 1.22-.5C7 20 8.5 19.5 10 19.5c3 0 4.5 2 9 2V8c-1 0-1.5.5-2 1z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>,
  /* Renal */ <path key="renal" d="M12 3c-3.31 0-6 2.69-6 6 0 4.5 6 12 6 12s6-7.5 6-12c0-3.31-2.69-6-6-6zm0 8.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" fill="none" stroke="currentColor" strokeWidth="1.5"/>,
  /* Gástrica */ <path key="gastric" d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm0 1.5L19.5 8H14V3.5zM6 20V4h6v6h6v10H6z" fill="currentColor"/>,
  /* Ginecológica */ <path key="gyneco" d="M12 2a7 7 0 110 14A7 7 0 0112 2zm0 10a3 3 0 100-6 3 3 0 000 6zm0 3v2m-2 2h4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>,
  /* Urinaria */ <><path key="urinary-p" d="M4.93 4.93A10 10 0 0119.07 19.07" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/><path key="urinary-q" d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/><circle key="urinary-c" cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none"/></>,
  /* Digestiva */ <path key="digestive" d="M17 7H7v10h10V7zm-5 7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="none" stroke="currentColor" strokeWidth="1.5"/>,
  /* Piel */ <path key="skin" d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>,
  /* Gastrointestinal */ <><rect key="gastro-r" x="3" y="3" width="18" height="18" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5"/><path key="gastro-p" d="M3 9h18M9 21V9" stroke="currentColor" strokeWidth="1.5"/></>,
];

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [settings, services, t] = await Promise.all([
    sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
    sanityFetch<ServiciosPage | null>({ query: SERVICIOS_PAGE_QUERY, tags: ['serviciosPage'] }),
    getTranslations({ locale, namespace: 'services' }),
  ]);

  const clinics = [
    t('clinics.breast'), t('clinics.lung'), t('clinics.prostate'), t('clinics.cns'),
    t('clinics.headNeck'), t('clinics.thoracic'), t('clinics.hepatic'), t('clinics.renal'),
    t('clinics.gastric'), t('clinics.gynecological'), t('clinics.urinary'),
    t('clinics.digestive'), t('clinics.skin'), t('clinics.gastrointestinal'),
  ];

  const complementaryUnits = [
    { name: t('complementary.endos.name'), description: t('complementary.endos.description'), link: t('complementary.endos.link') },
    { name: t('complementary.cuidare.name'), description: t('complementary.cuidare.description'), link: t('complementary.cuidare.link') },
    { name: t('complementary.haranna.name'), description: t('complementary.haranna.description'), link: t('complementary.haranna.link') },
    { name: t('complementary.kalika.name'), description: t('complementary.kalika.description'), link: t('complementary.kalika.link') },
  ];

  const commercialPartners = [
    { name: t('partners.sanvite.name'), description: t('partners.sanvite.description'), link: t('partners.sanvite.link') },
    { name: t('partners.aster.name'), description: t('partners.aster.description'), link: t('partners.aster.link') },
    { name: t('partners.sedi.name'), description: t('partners.sedi.description'), link: t('partners.sedi.link') },
    { name: t('partners.breeze.name'), description: t('partners.breeze.description'), link: t('partners.breeze.link') },
    { name: t('partners.vocalia.name'), description: t('partners.vocalia.description'), link: t('partners.vocalia.link') },
  ];

  const features = [
    { title: t('main.feature1Title'), description: t('main.feature1Description'), stat: t('main.feature1Stat'), icon: 'hospital' },
    { title: t('main.feature2Title'), description: t('main.feature2Description'), stat: t('main.feature2Stat'), icon: 'heart' },
    { title: t('main.feature3Title'), description: t('main.feature3Description'), stat: t('main.feature3Stat'), icon: 'monitor' },
  ];

  return (
    <div className="flex flex-col flex-1">
      {/* ─── HERO ─── */}
      <PageHero
        imageSrc={(() => { const img = settings.serviciosHeroImage ?? settings.homeHeroImage; return img ? urlFor(img).width(1920).quality(82).format('webp').url() : undefined; })()}
        blurDataURL={(settings.serviciosHeroImage ?? settings.homeHeroImage)?.asset?.metadata?.lqip ?? undefined}
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
        description={t('hero.description')}
        primaryCta={{ label: t('cta.button'), href: '/contacto#contact-form' }}
      />

      {/* ─── 1. NUESTRO ENFOQUE — 3 feature cards ─── */}
      <section className="bg-white py-20 md:py-28">
        <div className="container-onkimia">
          <p className="text-xs tracking-[0.25em] uppercase text-gray-warm font-medium mb-5">
            {t('main.eyebrow')}
          </p>
          <p className="text-gray-warm text-lg md:text-xl leading-relaxed max-w-2xl mb-14">
            {t('main.lead')}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <article key={i} className="bg-white border border-line rounded-2xl p-8 flex flex-col gap-6 shadow-xs hover:shadow-md hover:border-teal/20 transition-all duration-300">
                {/* Icon */}
                <div className="w-12 h-12 rounded-2xl bg-ink flex items-center justify-center flex-shrink-0">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white" aria-hidden="true">
                    {f.icon === 'hospital' && <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 3v5m0 0v5m0-5H7m5 0h5" stroke="white" strokeWidth="1.6" strokeLinecap="round"/>}
                    {f.icon === 'heart' && <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" stroke="white" strokeWidth="1.6" strokeLinejoin="round"/>}
                    {f.icon === 'monitor' && <><rect x="2" y="3" width="20" height="14" rx="2" stroke="white" strokeWidth="1.6"/><path d="M8 21h8M12 17v4" stroke="white" strokeWidth="1.6" strokeLinecap="round"/></>}
                  </svg>
                </div>
                {/* Content */}
                <div className="flex-1">
                  <h3 className="font-serif text-xl text-ink leading-snug mb-3">{f.title}</h3>
                  <p className="text-gray-warm text-sm leading-relaxed">{f.description}</p>
                </div>
                {/* Stat */}
                <div className="flex items-center gap-2 pt-4 border-t border-line">
                  <span className="w-2 h-2 rounded-full bg-gray-soft flex-shrink-0" aria-hidden="true"/>
                  <span className="text-sm text-gray-warm">{f.stat}</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── IMAGE BREAK 1 — Enfoque ─── */}
      {services?.enfoqueImage?.asset && (
        <div className="bg-white pb-20 md:pb-28">
          <div className="container-onkimia">
            <div className="relative w-full aspect-[16/6] rounded-3xl overflow-hidden">
              <Image
                src={urlFor(services.enfoqueImage).width(1920).height(720).format('webp').quality(85).url()}
                alt={t('main.title')}
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

      {/* ─── 2. CLÍNICAS — specialty grid ─── */}
      <section className="bg-cream py-20 md:py-28">
        <div className="container-onkimia">
          <div className="text-center mb-14 md:mb-18">
            <p className="text-xs tracking-[0.25em] uppercase text-gray-warm font-medium mb-5">
              {t('clinics.eyebrow')}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink leading-tight mb-6">
              {t('clinics.title')}
            </h2>
            <p className="text-gray-warm text-lg leading-relaxed max-w-2xl mx-auto">
              {t('clinics.description')}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {clinics.map((name, i) => (
              <div
                key={i}
                className="bg-white border border-line rounded-2xl p-5 flex flex-col gap-3 hover:border-teal/25 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 text-gray-soft">
                    <svg width="28" height="28" viewBox="0 0 24 24" aria-hidden="true">
                      {clinicIcons[i]}
                    </svg>
                  </div>
                  <span className="font-serif text-2xl text-line leading-none select-none">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <p className="font-sans text-sm font-medium text-ink leading-snug">{name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── IMAGE BREAK 2 — Clínicas ─── */}
      {services?.clinicsSectionImage?.asset && (
        <div className="bg-cream pb-20 md:pb-28">
          <div className="container-onkimia">
            <div className="relative w-full aspect-[16/6] rounded-3xl overflow-hidden">
              <Image
                src={urlFor(services.clinicsSectionImage).width(1920).height(720).format('webp').quality(85).url()}
                alt={t('clinics.title')}
                fill
                sizes="(max-width: 1440px) 100vw, 1440px"
                className="object-cover"
                placeholder={services.clinicsSectionImage?.asset?.metadata?.lqip ? 'blur' : 'empty'}
                blurDataURL={services.clinicsSectionImage?.asset?.metadata?.lqip ?? undefined}
              />
            </div>
          </div>
        </div>
      )}

      {/* ─── 3. UNIDADES COMPLEMENTARIAS — dark cards with links ─── */}
      <section className="bg-ink py-20 md:py-28">
        <div className="container-onkimia">
          <p className="text-xs tracking-[0.25em] uppercase text-teal-soft font-medium mb-5">
            {t('complementary.eyebrow')}
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight">
              {t('complementary.title')}
            </h2>
            <p className="text-white/60 text-base leading-relaxed max-w-md md:text-right">
              {t('complementary.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {complementaryUnits.map((unit) => (
              <Link
                key={unit.name}
                href={unit.link as `/${string}`}
                className="group bg-white/[0.04] border border-white/[0.08] rounded-2xl p-7 flex flex-col gap-5 hover:bg-white/[0.08] hover:border-teal/30 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
              >
                <div>
                  <p className="text-[10px] tracking-[0.2em] uppercase text-white/40 mb-3">
                    {t('complementary.unitLabel')}
                  </p>
                  <h3 className="font-serif text-3xl text-white leading-none">{unit.name}</h3>
                </div>
                <div className="h-px bg-white/10" aria-hidden="true" />
                <p className="text-white/60 text-sm leading-relaxed flex-1">{unit.description}</p>
                <span className="inline-flex items-center gap-2 text-white/50 group-hover:text-teal-soft transition-colors text-sm">
                  {t('complementary.knowMore')}
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M3 8h10M9 4l4 4-4 4"/>
                  </svg>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. SOCIOS COMERCIALES ─── */}
      <section className="bg-cream py-20 md:py-28">
        <div className="container-onkimia">
          <p className="text-xs tracking-[0.25em] uppercase text-gray-warm font-medium mb-5">
            {t('partners.eyebrow')}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl text-ink leading-tight mb-14">
            {t('partners.title')}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {commercialPartners.map((partner) => (
              <article
                key={partner.name}
                className="bg-white border border-line rounded-2xl p-7 flex flex-col gap-4 hover:border-teal/25 hover:shadow-sm transition-all duration-200"
              >
                {/* Name as wordmark placeholder */}
                <div className="h-12 flex items-center">
                  <span className="font-serif text-2xl text-ink">{partner.name}</span>
                </div>
                <div className="h-px bg-line" aria-hidden="true"/>
                <p className="text-gray-warm text-sm leading-relaxed flex-1">{partner.description}</p>
                {partner.link && partner.link !== '#' ? (
                  <a
                    href={partner.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-teal text-sm font-medium hover:text-teal-soft transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal rounded-sm"
                  >
                    {t('partners.visitWebsite')}
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M3 8h10M9 4l4 4-4 4"/>
                    </svg>
                  </a>
                ) : (
                  <span className="text-gray-soft text-sm">{t('partners.visitWebsite')}</span>
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
      <section className="bg-ink py-20 md:py-28 grow">
        <div className="container-onkimia">
          <div className="max-w-3xl mx-auto text-center">
            <p className="text-xs tracking-[0.25em] uppercase text-teal-soft font-medium mb-6">
              {t('cta.eyebrow')}
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
              {t('cta.description')}
            </p>
            <Link
              href="/contacto#contact-form"
              className="inline-flex items-center gap-2 bg-teal hover:bg-teal-soft text-white font-medium px-8 py-4 rounded-xl transition-colors text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              {t('cta.button')}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3 8h10M9 4l4 4-4 4"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
