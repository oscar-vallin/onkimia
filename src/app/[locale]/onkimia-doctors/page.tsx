import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { sanityFetch } from '@/sanity/lib/fetch';
import { SITE_SETTINGS_QUERY } from '@/sanity/queries';
import { urlFor } from '@/sanity/image';
import type { SiteSettings } from '@/sanity/types';
import type { Locale } from '@/i18n/routing';
import Image from 'next/image';
import {
  Activity,
  HeartPulse,
  Flower2,
  Target,
  Users,
  Sparkles,
  Shield,
  Check,
} from 'lucide-react';
import { BookingButton } from '@/components/ui/BookingButton';
import { MedicalBusinessLd } from '@/components/seo/JsonLd';
import { DecorativeBubbles } from '@/components/ui/DecorativeBubbles';
import { buildMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'doctors.metadata' });

  return buildMetadata({ title: t('title'), description: t('description'), locale, pathname: '/onkimia-doctors' });
}

const IMPROVEMENT_KEYS = [
  'waitTime',
  'fragmentation',
  'coordinated',
  'adherence',
  'emotional',
] as const;

const UNITS = [
  {
    key: 'endos',
    icon: Activity,
    section: 'endos',
    items: ['diagnosis', 'ambulatory', 'lessFriction'],
  },
  {
    key: 'cuidare',
    icon: HeartPulse,
    section: 'cuidare',
    items: ['painManagement', 'dayClinic', 'palliativeCare'],
  },
  {
    key: 'wellness',
    icon: Flower2,
    section: 'onkimia-doctors',
    items: ['psychology', 'nutrition', 'physiotherapy', 'boutique'],
  },
] as const;

const BENEFIT_CATEGORIES = [
  {
    key: 'clinicalFocus',
    icon: Target,
    items: ['lessBurden', 'structuredProcesses', 'readyInfrastructure'],
  },
  {
    key: 'multidisciplinary',
    icon: Users,
    items: ['interaction', 'integralCases', 'continuity'],
  },
  {
    key: 'premiumExperience',
    icon: Sparkles,
    items: ['privateBooths', 'specializedUnits', 'humanSupport'],
  },
  {
    key: 'institutionalBacking',
    icon: Shield,
    items: ['solidBrand', 'standardized', 'compliance'],
  },
] as const;

export default async function OnkimiaDoctorsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [settings, t] = await Promise.all([
    sanityFetch<SiteSettings>({
      query: SITE_SETTINGS_QUERY,
      tags: ['siteSettings'],
    }),
    getTranslations('doctors'),
  ]);

  const heroImage = settings.doctorsHeroImage || settings.homeHeroImage;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://onkimia.com';

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
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.60) 100%)',
          }}
          aria-hidden="true"
        />
        <div className="relative h-full container-onkimia flex flex-col items-center justify-center text-center pt-24 md:pt-32">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-white mb-4 md:mb-6 text-balance mt-20">
            {t('hero.headline')}
          </h1>
          <p className="text-sm md:text-xl text-white/90 max-w-3xl text-pretty mb-6 md:mb-8">
            {t('hero.description')}
          </p>
          <BookingButton
            section="onkimia-doctors"
            variant="primary"
            customLabel={t('cta.button')}
            customMessage={t('cta.message')}
          />
        </div>
      </section>

      {/* ─── ¿QUÉ ES ONKIMIA DOCTORS? ─── */}
      <section
        className="container-onkimia py-16 md:py-24"
        aria-labelledby="doctors-about-title"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2
            id="doctors-about-title"
            className="font-serif text-4xl md:text-5xl mb-6"
          >
            {t('about.title')}
          </h2>
          <p className="text-lg text-gray-warm text-pretty leading-relaxed">
            {t('about.description')}
          </p>
        </div>
      </section>

      {/* ─── MEJORAS PARA TU PACIENTE ─── */}
      <section
        className="relative bg-ink py-16 md:py-24 overflow-hidden"
        aria-labelledby="doctors-improvements-title"
      >
        <DecorativeBubbles variant="scattered" opacity={0.5} />
        <div className="relative container-onkimia">
          <h2
            id="doctors-improvements-title"
            className="font-serif text-4xl md:text-5xl text-white text-center mb-12"
          >
            {t('improvements.title')}
          </h2>
          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto mb-10">
            {IMPROVEMENT_KEYS.map((key, index) => (
              <li
                key={key}
                className="flex flex-col items-center text-center rounded-2xl p-6 bg-teal/10"
              >
                <span className="text-5xl font-serif text-teal mb-3">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <p className="text-sm leading-snug text-white/95">
                  {t(`improvements.items.${key}`)}
                </p>
              </li>
            ))}
          </ol>
          <p className="text-center text-lg text-white/85 max-w-3xl mx-auto text-pretty italic">
            {t('improvements.subtitle')}
          </p>
        </div>
      </section>

      {/* ─── UNIDADES DE NEGOCIO ─── */}
      <section
        className="container-onkimia py-16 md:py-24"
        aria-labelledby="doctors-units-title"
      >
        <h2
          id="doctors-units-title"
          className="font-serif text-4xl md:text-5xl text-center mb-12 text-balance"
        >
          {t('units.title')}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {UNITS.map(({ key, icon: Icon, section, items }) => (
            <article
              key={key}
              className="bg-cream border border-line rounded-2xl p-6 flex flex-col"
            >
              <div className="w-14 h-14 rounded-lg bg-teal/10 text-teal flex items-center justify-center mb-4">
                <Icon className="w-7 h-7" aria-hidden="true" />
              </div>
              <h3 className="font-serif text-2xl mb-4">{t(`units.${key}.name`)}</h3>
              <ul className="space-y-2 mb-6 flex-1">
                {items.map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <Check
                      className="w-4 h-4 text-teal flex-shrink-0 mt-1"
                      aria-hidden="true"
                    />
                    <span className="text-sm text-gray-warm">
                      {t(`units.${key}.items.${item}`)}
                    </span>
                  </li>
                ))}
              </ul>
              <BookingButton
                section={section}
                variant="primary"
                customLabel={t('units.scheduleTour')}
                customMessage={t(`units.${key}.tourMessage`)}
                className="w-full"
              />
            </article>
          ))}
        </div>
      </section>

      {/* ─── BENEFICIOS PARA EL MÉDICO ─── */}
      <section
        className="bg-cream py-16 md:py-24"
        aria-labelledby="doctors-benefits-title"
      >
        <div className="container-onkimia">
          <h2
            id="doctors-benefits-title"
            className="font-serif text-4xl md:text-5xl text-center mb-12"
          >
            {t('benefits.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {BENEFIT_CATEGORIES.map(({ key, icon: Icon, items }) => (
              <article
                key={key}
                className="bg-white border border-line rounded-2xl p-6"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-teal text-white flex items-center justify-center">
                    <Icon className="w-6 h-6" aria-hidden="true" />
                  </div>
                  <h3 className="font-serif text-xl">
                    {t(`benefits.categories.${key}.title`)}
                  </h3>
                </div>
                <ul className="space-y-2">
                  {items.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <Check
                        className="w-4 h-4 text-teal flex-shrink-0 mt-1"
                        aria-hidden="true"
                      />
                      <span className="text-sm text-gray-warm">
                        {t(`benefits.categories.${key}.items.${item}`)}
                      </span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA FINAL ─── */}
      <section
        className="container-onkimia py-16 md:py-24"
        aria-labelledby="doctors-cta-title"
      >
        <div className="max-w-3xl mx-auto text-center bg-ink rounded-2xl p-12">
          <h2
            id="doctors-cta-title"
            className="font-serif text-4xl md:text-5xl text-white mb-6"
          >
            {t('cta.title')}
          </h2>
          <p className="text-lg text-white/90 mb-8 text-pretty leading-relaxed">
            {t('cta.description')}
          </p>
          <BookingButton
            section="onkimia-doctors"
            variant="primary"
            customLabel={t('cta.button')}
            customMessage={t('cta.message')}
          />
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
