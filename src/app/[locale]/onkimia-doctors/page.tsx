import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { sanityFetch } from '@/sanity/lib/fetch';
import { SITE_SETTINGS_QUERY, ONKIMIA_DOCS_SETTINGS_QUERY } from '@/sanity/queries';
import { urlFor } from '@/sanity/image';
import type { SiteSettings, OnkimiaDocsSettings } from '@/sanity/types';
import type { Locale } from '@/i18n/routing';
import Image from 'next/image';
import { Activity, HeartPulse, Flower2, Target, Users, Sparkles, Shield, Check } from 'lucide-react';
import { buildMetadata } from '@/lib/seo/metadata';
import { MedicalBusinessLd } from '@/components/seo/JsonLd';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'doctors.metadata' });
  return buildMetadata({ title: t('title'), description: t('description'), locale, pathname: '/onkimia-doctors' });
}

/* ─── Static data ─── */
const IMPROVEMENT_KEYS = ['waitTime', 'fragmentation', 'coordinated', 'adherence', 'emotional'] as const;

const UNITS = [
  { key: 'endos', icon: Activity, items: ['diagnosis', 'ambulatory', 'lessFriction'], whatsappKey: 'endos' },
  { key: 'cuidare', icon: HeartPulse, items: ['painManagement', 'dayClinic', 'palliativeCare'], whatsappKey: 'cuidare' },
  { key: 'wellness', icon: Flower2, items: ['psychology', 'nutrition', 'physiotherapy', 'boutique'], whatsappKey: null },
] as const;

const BENEFIT_CATEGORIES = [
  { key: 'clinicalFocus', icon: Target, items: ['lessBurden', 'structuredProcesses', 'readyInfrastructure'] },
  { key: 'multidisciplinary', icon: Users, items: ['interaction', 'integralCases', 'continuity'] },
  { key: 'premiumExperience', icon: Sparkles, items: ['privateBooths', 'specializedUnits', 'humanSupport'] },
  { key: 'institutionalBacking', icon: Shield, items: ['solidBrand', 'standardized', 'compliance'] },
] as const;

function buildWhatsApp(number: string | undefined | null, message: string) {
  const n = (number ?? '').replace(/\D/g, '');
  if (!n) return '#';
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`;
}

export default async function OnkimiaDoctorsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [settings, od, t] = await Promise.all([
    sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
    sanityFetch<OnkimiaDocsSettings>({ query: ONKIMIA_DOCS_SETTINGS_QUERY, tags: ['onkimiaDocsSettings'] }),
    getTranslations('doctors'),
  ]);

  const heroImageOd = od?.heroImage;
  const heroImageFallback = settings.doctorsHeroImage ?? settings.homeHeroImage;
  const heroImage = heroImageOd ?? heroImageFallback;
  const heroLqip = heroImageOd?.asset?.metadata?.lqip;
  const waCommercial = settings.whatsappCommercial;
  const waEndos = od?.whatsappEndos ?? waCommercial;
  const waCuidare = od?.whatsappCuidare ?? waCommercial;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://onkimia.com';

  return (
    <>
      {/* ════════════════════════════════════════
          HERO
      ════════════════════════════════════════ */}
      <section className="relative w-full min-h-[600px] md:min-h-[700px] overflow-hidden -mt-16 md:-mt-20 flex flex-col">
        {/* Background image */}
        {heroImage && (
          <Image
            src={urlFor(heroImage).width(1920).height(1080).format('webp').quality(82).url()}
            alt={t('hero.headlinePart1')}
            fill
            sizes="100vw"
            priority
            className="object-cover object-[75%_center] md:object-center"
            placeholder={heroLqip ? 'blur' : 'empty'}
            blurDataURL={heroLqip ?? undefined}
          />
        )}
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.40) 55%, rgba(0,0,0,0.60) 100%)' }}
          aria-hidden="true"
        />

        {/* ─── OD symbol / logo (top left, below nav) ─── */}
        <div className="relative z-10 container-onkimia pt-28 md:pt-36 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Symbol (mobile) / Logo (desktop) — from Sanity */}
            {od?.symbol?.asset && (
              <div className="md:hidden">
                <Image
                  src={urlFor(od.symbol).height(40).format('webp').quality(90).url()}
                  alt="Onkimia Doctors"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
            )}
            {od?.logo?.asset && (
              <div className="hidden md:block">
                <Image
                  src={urlFor(od.logo).height(36).format('webp').quality(90).url()}
                  alt="Onkimia Doctors"
                  width={180}
                  height={36}
                  className="object-contain"
                />
              </div>
            )}
            <p className="text-[10px] tracking-[0.22em] uppercase text-white/60 font-medium">
              {t('hero.eyebrow')}
            </p>
          </div>
          {/* Badge top-right */}
          <div className="hidden sm:flex items-center gap-2 border border-white/25 rounded-full px-4 py-2 bg-white/[0.06] backdrop-blur-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-white/70" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span className="text-[11px] tracking-[0.18em] uppercase text-white/80">{t('hero.badge')}</span>
          </div>
        </div>

        {/* ─── Hero content ─── */}
        <div className="relative z-10 container-onkimia flex flex-col flex-1 justify-center pb-24 md:pb-32 mt-10 md:mt-12 max-w-3xl">
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6">
            {t('hero.headlinePart1')}<br/>
            <em className="not-italic italic">{t('hero.headlinePart2')}</em>
          </h1>
          <p className="text-white/75 text-base md:text-lg italic mb-4 max-w-xl leading-relaxed">
            {t('hero.quote')}
          </p>
          <p className="text-white/65 text-sm md:text-base leading-relaxed max-w-lg mb-10">
            {t('hero.description')}
          </p>
          <div className="flex flex-wrap gap-3">
            <a
              href={buildWhatsApp(waCommercial, t('cta.message'))}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-ink font-medium px-7 py-3.5 rounded-xl hover:bg-white/90 transition-colors text-sm"
            >
              {t('hero.joinButton')}
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
            </a>
            <a
              href="#beneficios"
              className="inline-flex items-center gap-2 border border-white/30 text-white font-medium px-7 py-3.5 rounded-xl hover:bg-white/10 transition-colors text-sm"
            >
              {t('hero.benefitsButton')}
            </a>
          </div>
        </div>

        {/* ─── Stats bar ─── */}
        <div className="relative z-10 w-full border-t border-white/10 bg-black/30 backdrop-blur-sm">
          <div className="container-onkimia grid grid-cols-3">
            {([
              [t('hero.stat1Value'), t('hero.stat1Label')],
              [t('hero.stat2Value'), t('hero.stat2Label')],
              [t('hero.stat3Value'), t('hero.stat3Label')],
            ] as [string, string][]).map(([val, label], i) => (
              <div key={i} className={`py-5 text-center ${i > 0 ? 'border-l border-white/10' : ''}`}>
                <p className="font-serif text-base md:text-lg text-white leading-none mb-1">{val}</p>
                <p className="text-[10px] tracking-[0.18em] uppercase text-white/45">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          ¿QUÉ ES ONKIMIA DOCTORS?
      ════════════════════════════════════════ */}
      <section className="bg-white py-20 md:py-28" aria-labelledby="od-about-title">
        <div className="container-onkimia">
          <div className={`grid gap-12 md:gap-16 ${od?.whatIsImage?.asset ? 'md:grid-cols-2 items-center' : 'max-w-3xl mx-auto'}`}>
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-gray-warm font-medium mb-5">ONKIMIA DOCTORS</p>
              <h2 id="od-about-title" className="font-serif text-4xl md:text-5xl text-ink leading-tight mb-6">
                {t('about.title')}
              </h2>
              <p className="text-gray-warm text-lg leading-relaxed mb-10">
                {t('about.description')}
              </p>
              {/* Patient quality bullets */}
              <div className="bg-cream rounded-2xl p-7 border border-line">
                <p className="text-xs tracking-[0.2em] uppercase text-gray-warm font-medium mb-5">
                  {t('improvements.title')}
                </p>
                <ul className="space-y-3">
                  {IMPROVEMENT_KEYS.map((key) => (
                    <li key={key} className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-ink flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" aria-hidden="true"/>
                      </span>
                      <span className="text-sm text-ink leading-snug">{t(`improvements.items.${key}`)}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-gray-warm italic leading-relaxed mt-5 pt-5 border-t border-line">
                  {t('improvements.subtitle')}
                </p>
              </div>
            </div>
            {od?.whatIsImage?.asset && (
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden">
                <Image
                  src={urlFor(od.whatIsImage).width(900).height(1125).format('webp').quality(85).url()}
                  alt={t('about.title')}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  placeholder={od.whatIsImage?.asset?.metadata?.lqip ? 'blur' : 'empty'}
                  blurDataURL={od.whatIsImage?.asset?.metadata?.lqip ?? undefined}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          IMAGE BREAK — Improvements (optional)
      ════════════════════════════════════════ */}
      {od?.improvementsImage?.asset && (
        <div className="bg-white pb-20 md:pb-28">
          <div className="container-onkimia">
            <div className="relative w-full aspect-[16/6] rounded-3xl overflow-hidden">
              <Image
                src={urlFor(od.improvementsImage).width(1920).height(720).format('webp').quality(85).url()}
                alt=""
                fill
                sizes="(max-width: 1440px) 100vw, 1440px"
                className="object-cover"
                placeholder={od.improvementsImage?.asset?.metadata?.lqip ? 'blur' : 'empty'}
                blurDataURL={od.improvementsImage?.asset?.metadata?.lqip ?? undefined}
              />
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════
          UNIDADES DE NEGOCIO
      ════════════════════════════════════════ */}
      <section className="bg-ink py-20 md:py-28" aria-labelledby="od-units-title">
        <div className="container-onkimia">
          <p className="text-xs tracking-[0.25em] uppercase text-teal-soft font-medium mb-5">ECOSISTEMA</p>
          <h2 id="od-units-title" className="font-serif text-4xl md:text-5xl text-white leading-tight mb-14">
            {t('units.title')}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {UNITS.map(({ key, icon: Icon, items, whatsappKey }) => {
              const waNumber = whatsappKey === 'endos' ? waEndos : whatsappKey === 'cuidare' ? waCuidare : null;
              const waMessage = key !== 'wellness' ? t(`units.${key}.tourMessage`) : t('cta.message');
              const waHref = waNumber ? buildWhatsApp(waNumber, waMessage) : buildWhatsApp(waCommercial, waMessage);

              return (
                <article key={key} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-7 flex flex-col gap-6 hover:bg-white/[0.07] transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-teal/15 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-teal-soft" aria-hidden="true"/>
                  </div>
                  <h3 className="font-serif text-2xl text-white">{t(`units.${key}.name`)}</h3>
                  <ul className="space-y-2.5 flex-1">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-teal-soft flex-shrink-0 mt-2" aria-hidden="true"/>
                        <span className="text-sm text-white/65 leading-snug">{t(`units.${key}.items.${item}`)}</span>
                      </li>
                    ))}
                  </ul>
                  {key !== 'wellness' && (
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] text-white text-sm font-medium px-5 py-3 rounded-xl transition-colors"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-teal-soft" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      {t('units.scheduleTour')}
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          BENEFICIOS PARA EL MÉDICO
      ════════════════════════════════════════ */}
      <section id="beneficios" className="bg-cream py-20 md:py-28" aria-labelledby="od-benefits-title">
        <div className="container-onkimia">
          <div className={`grid gap-12 md:gap-16 ${od?.benefitsImage?.asset ? 'md:grid-cols-[1fr_1.1fr] items-start' : ''}`}>
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-gray-warm font-medium mb-5">MÉDICOS</p>
              <h2 id="od-benefits-title" className="font-serif text-4xl md:text-5xl text-ink leading-tight mb-12">
                {t('benefits.title')}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BENEFIT_CATEGORIES.map(({ key, icon: Icon, items }) => (
                  <article key={key} className="bg-white border border-line rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-ink flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-white" aria-hidden="true"/>
                      </div>
                      <h3 className="font-serif text-base text-ink leading-snug">{t(`benefits.categories.${key}.title`)}</h3>
                    </div>
                    <ul className="space-y-2">
                      {items.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-teal flex-shrink-0 mt-0.5" aria-hidden="true"/>
                          <span className="text-xs text-gray-warm leading-snug">{t(`benefits.categories.${key}.items.${item}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>

            {od?.benefitsImage?.asset && (
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden sticky top-24">
                <Image
                  src={urlFor(od.benefitsImage).width(900).height(1200).format('webp').quality(85).url()}
                  alt={t('benefits.title')}
                  fill
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="object-cover"
                  placeholder={od.benefitsImage?.asset?.metadata?.lqip ? 'blur' : 'empty'}
                  blurDataURL={od.benefitsImage?.asset?.metadata?.lqip ?? undefined}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA — Únete ahora
      ════════════════════════════════════════ */}
      <section className="bg-ink py-20 md:py-28" aria-labelledby="od-cta-title">
        <div className="container-onkimia max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-[0.25em] uppercase text-teal-soft font-medium mb-6">ONKIMIA DOCTORS</p>
          <h2 id="od-cta-title" className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            {t('cta.description')}
          </p>
          <a
            href={buildWhatsApp(waCommercial, t('cta.message'))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-white text-ink font-medium px-9 py-4 rounded-xl hover:bg-white/90 transition-colors text-base"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-teal" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {t('cta.button')}
          </a>
        </div>
      </section>

      {/* ─── JSON-LD ─── */}
      <MedicalBusinessLd
        name="Onkimia Doctors"
        description={t('about.description')}
        url={`${siteUrl}/${locale === 'es' ? '' : 'en/'}onkimia-doctors`}
      />
    </>
  );
}
