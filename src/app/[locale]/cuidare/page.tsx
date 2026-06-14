import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { sanityFetch } from '@/sanity/lib/fetch';
import { SITE_SETTINGS_QUERY, FAQS_BY_PAGE_QUERY, CUIDARE_PROCEDURES_QUERY } from '@/sanity/queries';
import { urlFor } from '@/sanity/image';
import { getLocalized } from '@/sanity/lib/localization';
import type { SiteSettings, FAQ, Procedure } from '@/sanity/types';
import type { Locale } from '@/i18n/routing';
import Image from 'next/image';
import {
  UserCheck,
  Cpu,
  ShieldCheck,
  Clock,
  TrendingDown,
  Heart,
} from 'lucide-react';
import { BookingButton } from '@/components/ui/BookingButton';
import { UnitAvailabilityBanner } from '@/components/ui/UnitAvailabilityBanner';
import { FAQCarousel } from '@/components/ui/FAQCarousel';
import { TreatmentAccordion, type Treatment } from '@/components/ui/TreatmentAccordion';
import { MedicalProcedureLd, FAQPageLd } from '@/components/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'cuidare.metadata' });

  return buildMetadata({ title: t('title'), description: t('description'), locale, pathname: '/cuidare' });
}

const BENEFIT_KEYS = [
  { key: 'skilledStaff', icon: UserCheck },
  { key: 'advancedTech', icon: Cpu },
  { key: 'internationalProtocols', icon: ShieldCheck },
  { key: 'fasterRecovery', icon: Clock },
  { key: 'costReduction', icon: TrendingDown },
  { key: 'empatheticCare', icon: Heart },
] as const;

const TREATMENT_KEYS = [
  { key: 'antibioticInfusion', iconKey: 'Syringe' },
  { key: 'hydration', iconKey: 'Droplets' },
  { key: 'neuromodulator', iconKey: 'Brain' },
  { key: 'painManagement', iconKey: 'Activity' },
  { key: 'oncologicalToxicity', iconKey: 'Shield' },
  { key: 'drugAdministration', iconKey: 'Pill' },
] as const;

const RADIOLOGY_KEYS = [
  'abscessDrainage',
  'biopsies',
  'venousCatheter',
  'evacuatingPuncture',
  'infiltrations',
] as const;

export default async function CuidarePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [settings, faqs, procedures, t] = await Promise.all([
    sanityFetch<SiteSettings>({
      query: SITE_SETTINGS_QUERY,
      tags: ['siteSettings'],
    }),
    sanityFetch<FAQ[]>({
      query: FAQS_BY_PAGE_QUERY,
      params: { page: 'cuidare' },
      tags: ['faq'],
    }),
    sanityFetch<Procedure[]>({
      query: CUIDARE_PROCEDURES_QUERY,
      params: { locale },
      tags: ['procedure'],
    }),
    getTranslations('cuidare'),
  ]);

  const heroImage = settings.cuidareHeroImage || settings.homeHeroImage;

  const treatments: Treatment[] = TREATMENT_KEYS.map(({ key, iconKey }) => ({
    id: key,
    iconKey,
    title: t(`treatments.items.${key}.title`),
    description: t(`treatments.items.${key}.description`),
  }));

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative w-full min-h-[480px] md:min-h-[600px] max-h-[800px] overflow-hidden -mt-16 md:-mt-20">
        {heroImage && (
          <Image
            src={urlFor(heroImage).width(1920).quality(82).format('webp').url()}
            alt={t('hero.headline')}
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        )}
        <div
          className=""
          aria-hidden="true"
        />
        <div className="relative h-full container-onkimia flex flex-col items-center justify-center text-center pt-24 md:pt-32">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4 md:mb-6 text-balance mt-12">
            {t('hero.headline')}
          </h1>
          <p className="text-sm md:text-xl text-white/90 max-w-3xl text-pretty mb-6 md:mb-8">
            {t('hero.description')}
          </p>
          <BookingButton section="cuidare" variant="primary" />
        </div>
      </section>

      {/* ─── BANNER DISPONIBILIDAD ─── */}
      <UnitAvailabilityBanner
        availableIn={['guadalajara']}
        messageKey="cuidare.availability.banner"
      />

      {/* ─── BENEFICIOS ─── */}
      <section
        className="bg-cream py-16 md:py-24"
        aria-labelledby="cuidare-benefits-title"
      >
        <div className="container-onkimia">
          <h2
            id="cuidare-benefits-title"
            className="font-serif text-4xl md:text-5xl text-center mb-12 max-w-3xl mx-auto text-balance"
          >
            {t('benefits.title')}
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {BENEFIT_KEYS.map(({ key, icon: Icon }) => (
              <li
                key={key}
                className="flex items-start gap-3 bg-white p-4 rounded-2xl border border-line"
              >
                <div className="w-10 h-10 flex-shrink-0 rounded-full bg-teal/10 text-teal flex items-center justify-center">
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </div>
                <p className="text-sm text-gray-warm leading-snug pt-2">
                  {t(`benefits.items.${key}`)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── TRATAMIENTOS AMBULATORIOS ─── */}
      <section
        className="container-onkimia py-16 md:py-24"
        aria-labelledby="cuidare-treatments-title"
      >
        <h2
          id="cuidare-treatments-title"
          className="font-serif text-4xl md:text-5xl text-center mb-12"
        >
          {t('treatments.title')}
        </h2>

        <TreatmentAccordion treatments={treatments} />

        {/* JSON-LD por cada tratamiento */}
        {treatments.map((tr) => (
          <MedicalProcedureLd
            key={tr.id}
            name={tr.title}
            description={tr.description}
          />
        ))}
      </section>

      {/* ─── PROCEDIMIENTOS CUIDARE — fotos prominentes ─── */}
      {procedures.length > 0 && (
        <section className="bg-white py-20 md:py-28" aria-label="Procedimientos Cuidare">
          <div className="container-onkimia">
            <div className={`grid gap-4 ${
              procedures.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' :
              procedures.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
              'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}>
              {procedures.map((proc, i) => (
                <article
                  key={proc._id}
                  className={`relative rounded-3xl overflow-hidden group ${
                    procedures.length >= 3 && i === 0 ? 'sm:col-span-2 lg:col-span-1' : ''
                  }`}
                >
                  <div className="relative w-full aspect-[4/3]">
                    {proc.image?.asset ? (
                      <Image
                        src={urlFor(proc.image).width(1400).height(1050).format('webp').quality(85).url()}
                        alt={proc.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        placeholder={proc.image?.asset?.metadata?.lqip ? 'blur' : 'empty'}
                        blurDataURL={proc.image?.asset?.metadata?.lqip ?? undefined}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-ink/10" />
                    )}
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 45%, rgba(0,0,0,0.85) 100%)' }}
                      aria-hidden="true"
                    />
                    <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
                      <div>
                        <span className="inline-block text-[10px] tracking-[0.2em] uppercase text-white/60 bg-white/[0.12] rounded-full px-3 py-1.5 backdrop-blur-sm">
                          CUIDARE
                        </span>
                        <h3 className="font-serif text-2xl md:text-3xl text-white mt-3 leading-tight">{proc.name}</h3>
                      </div>
                      <p className="text-white/70 text-sm leading-relaxed">{proc.shortDescription}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── RADIOLOGÍA INTERVENCIONISTA ─── */}
      <section className="relative overflow-hidden py-20 md:py-28" aria-labelledby="cuidare-radiology-title">
        {/* Background image */}
        {settings.cuidareRadiologyImage?.asset && (
          <Image
            src={urlFor(settings.cuidareRadiologyImage).width(1920).height(1080).format('webp').quality(80).url()}
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
            placeholder={settings.cuidareRadiologyImage?.asset?.metadata?.lqip ? 'blur' : 'empty'}
            blurDataURL={settings.cuidareRadiologyImage?.asset?.metadata?.lqip ?? undefined}
          />
        )}
        {/* Dark overlay — always present, deeper when no image */}
        <div
          className="absolute inset-0 bg-ink"
          style={{ opacity: settings.cuidareRadiologyImage?.asset ? 0.82 : 1 }}
          aria-hidden="true"
        />

        <div className="relative z-10 container-onkimia">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">
            {/* Left */}
            <div>
              <p className="text-[10px] tracking-[0.28em] uppercase text-white/50 font-medium mb-6">
                {t('radiology.eyebrow')}
              </p>
              <h2 id="cuidare-radiology-title" className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
                {t('radiology.headlinePart1')}<br/>
                <em className="not-italic italic">{t('radiology.headlinePart2')}</em>
              </h2>
              <p className="text-white/60 text-base md:text-lg leading-relaxed mb-10">
                {t('radiology.description')}
              </p>
              {/* Stat pills */}
              <div className="flex flex-wrap gap-3">
                <div className="bg-white/[0.07] border border-white/[0.10] rounded-2xl px-7 py-5 text-center min-w-[130px]">
                  <p className="font-serif text-2xl text-white leading-none mb-1">{t('radiology.stat1Value')}</p>
                  <p className="text-[11px] tracking-[0.15em] uppercase text-white/40">{t('radiology.stat1Label')}</p>
                </div>
                <div className="bg-white/[0.07] border border-white/[0.10] rounded-2xl px-7 py-5 text-center min-w-[130px]">
                  <p className="font-serif text-2xl text-white leading-none mb-1">{t('radiology.stat2Value')}</p>
                  <p className="text-[11px] tracking-[0.15em] uppercase text-white/40">{t('radiology.stat2Label')}</p>
                </div>
              </div>
            </div>

            {/* Right — items with icon + name + description */}
            <ul className="space-y-3">
              {RADIOLOGY_KEYS.map((key, i) => {
                const icons = ['⚡', '📋', '↔', '🧪', '🎯'];
                return (
                  <li key={key} className="flex gap-4 bg-white/[0.04] border border-white/[0.08] rounded-2xl px-6 py-5 hover:bg-white/[0.07] transition-colors">
                    <div className="w-9 h-9 rounded-full bg-white/[0.08] flex items-center justify-center flex-shrink-0 mt-0.5 text-white/50">
                      <span className="text-sm" aria-hidden="true">{icons[i]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm leading-snug mb-1">{t(`radiology.items.${key}.name`)}</p>
                      <p className="text-white/50 text-sm leading-relaxed">{t(`radiology.items.${key}.description`)}</p>
                    </div>
                    <MedicalProcedureLd name={t(`radiology.items.${key}.name`)} />
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      {/* ─── CUIDADOS PALIATIVOS ─── */}
      {/* TODO Cliente: confirmar contenido real de Cuidados Paliativos.
          El texto actual parece testimonio/diferenciador, no descripción técnica del servicio. */}
      <section
        className="container-onkimia py-16 md:py-24"
        aria-labelledby="cuidare-palliative-title"
      >
        <div className="max-w-3xl mx-auto bg-ink text-white rounded-2xl p-8 md:p-12 relative">
          <span
            className="absolute top-4 left-6 text-6xl font-serif text-white/40 opacity-50"
            aria-hidden="true"
          >
            &ldquo;
          </span>
          <h2
            id="cuidare-palliative-title"
            className="font-serif text-3xl md:text-4xl text-white mb-4 mt-4"
          >
            {t('palliative.title')}
          </h2>
          <p className="text-lg leading-relaxed text-pretty text-white/90">
            {t('palliative.description')}
          </p>
        </div>
      </section>

      {/* ─── FAQs ─── */}
      {faqs.length > 0 && (
        <section
          className="bg-cream py-16 md:py-24"
          aria-labelledby="cuidare-faq-title"
        >
          <div className="container-onkimia">
            <h2
              id="cuidare-faq-title"
              className="font-serif text-4xl md:text-5xl text-center mb-12"
            >
              {t('faq.title')}
            </h2>
            <FAQCarousel faqs={faqs} locale={locale} />
            <FAQPageLd
              faqs={faqs.map((faq) => ({
                question: getLocalized(faq.question, locale),
                answer: getLocalized(faq.answer, locale),
              }))}
            />
          </div>
        </section>
      )}

      {/* ─── CTA FINAL ─── */}
      <section
        className="container-onkimia py-16 md:py-24"
        aria-labelledby="cuidare-cta-title"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2 id="cuidare-cta-title" className="font-serif text-4xl md:text-5xl mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-lg text-gray-warm leading-relaxed mb-8 text-pretty">
            {t('cta.description')}
          </p>
          <BookingButton section="cuidare" variant="primary" />
        </div>
      </section>
    </>
  );
}
