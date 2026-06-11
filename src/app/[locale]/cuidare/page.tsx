import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { sanityFetch } from '@/sanity/lib/fetch';
import { SITE_SETTINGS_QUERY, FAQS_BY_PAGE_QUERY } from '@/sanity/queries';
import { urlFor } from '@/sanity/image';
import { getLocalized } from '@/sanity/lib/localization';
import type { SiteSettings, FAQ } from '@/sanity/types';
import type { Locale } from '@/i18n/routing';
import Image from 'next/image';
import {
  UserCheck,
  Cpu,
  ShieldCheck,
  Clock,
  TrendingDown,
  Heart,
  Check,
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

  const [settings, faqs, t] = await Promise.all([
    sanityFetch<SiteSettings>({
      query: SITE_SETTINGS_QUERY,
      tags: ['siteSettings'],
    }),
    sanityFetch<FAQ[]>({
      query: FAQS_BY_PAGE_QUERY,
      params: { page: 'cuidare' },
      tags: ['faq'],
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
            src={urlFor(heroImage).width(2400).quality(82).format('webp').url()}
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

      {/* ─── RADIOLOGÍA INTERVENCIONISTA ─── */}
      <section
        className="bg-cream py-16 md:py-24"
        aria-labelledby="cuidare-radiology-title"
      >
        <div className="container-onkimia max-w-4xl">
          <h2
            id="cuidare-radiology-title"
            className="font-serif text-4xl md:text-5xl text-center mb-12 text-balance"
          >
            {t('radiology.title')}
          </h2>
          <ul className="space-y-3">
            {RADIOLOGY_KEYS.map((key) => (
              <li
                key={key}
                className="flex items-start gap-3 bg-white p-4 rounded-2xl"
              >
                <Check
                  className="w-5 h-5 text-teal flex-shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <span className="text-ink">
                  {t(`radiology.items.${key}`)}
                </span>
                <MedicalProcedureLd name={t(`radiology.items.${key}`)} />
              </li>
            ))}
          </ul>
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
