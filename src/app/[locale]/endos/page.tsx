import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { sanityFetch } from '@/sanity/lib/fetch';
import { SITE_SETTINGS_QUERY, FAQS_BY_PAGE_QUERY, PROCEDURES_QUERY } from '@/sanity/queries';
import { urlFor } from '@/sanity/image';
import { getLocalized } from '@/sanity/lib/localization';
import type { SiteSettings, FAQ, Procedure } from '@/sanity/types';
import type { Locale } from '@/i18n/routing';
import Image from 'next/image';
import {
  UserCheck,
  Cpu,
  Zap,
  Clock,
  Heart,
} from 'lucide-react';
import { BookingButton } from '@/components/ui/BookingButton';
import { UnitAvailabilityBanner } from '@/components/ui/UnitAvailabilityBanner';
import { FAQCarousel } from '@/components/ui/FAQCarousel';
import { MedicalProcedureLd, FAQPageLd } from '@/components/seo/JsonLd';
import { buildMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'endos.metadata' });

  return buildMetadata({ title: t('title'), description: t('description'), locale, pathname: '/endos' });
}

const BENEFIT_KEYS = [
  { key: 'specializedTeam', icon: UserCheck },
  { key: 'latestTechnology', icon: Cpu },
  { key: 'agileProcedures', icon: Zap },
  { key: 'timeAndCostSavings', icon: Clock },
  { key: 'empatheticCare', icon: Heart },
] as const;

export default async function EndosPage({
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
      params: { page: 'endos' },
      tags: ['faq'],
    }),
    sanityFetch<Procedure[]>({
      query: PROCEDURES_QUERY,
      params: { locale },
      tags: ['procedure'],
    }),
    getTranslations('endos'),
  ]);

  const heroImage = settings.endosHeroImage || settings.homeHeroImage;

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
          <BookingButton section="endos" variant="primary" />
        </div>
      </section>

      {/* ─── BANNER DISPONIBILIDAD ─── */}
      <UnitAvailabilityBanner
        availableIn={['guadalajara']}
        messageKey="endos.availability.banner"
      />

      {/* ─── ¿QUÉ HACEMOS? ─── */}
      <section
        className="container-onkimia py-16 md:py-24"
        aria-labelledby="endos-procedures-title"
      >
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2
            id="endos-procedures-title"
            className="font-serif text-4xl md:text-5xl mb-4"
          >
            {t('procedures.title')}
          </h2>
          <p className="text-lg text-gray-warm leading-relaxed text-pretty">
            {t('procedures.intro')}
          </p>
        </div>

        {/* TODO: add longDescription field to procedure schema when client provides full descriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {procedures.map((proc) => (
            <article
              key={proc._id}
              className="bg-cream border border-line rounded-2xl p-6 hover:border-teal-soft transition-colors transition-shadow"
            >
              <h3 className="font-serif text-xl mb-2">
                {proc.name}
              </h3>
              <p className="text-gray-warm text-sm leading-relaxed">
                {proc.shortDescription}
              </p>
              <MedicalProcedureLd
                name={proc.name}
                description={proc.shortDescription}
              />
            </article>
          ))}
        </div>
      </section>

      {/* ─── BENEFICIOS ─── */}
      <section
        className="bg-cream py-16 md:py-24"
        aria-labelledby="endos-benefits-title"
      >
        <div className="container-onkimia">
          <h2
            id="endos-benefits-title"
            className="font-serif text-4xl md:text-5xl text-center mb-12"
          >
            {t('benefits.title')}
          </h2>
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {BENEFIT_KEYS.map(({ key, icon: Icon }) => (
              <li key={key} className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-full bg-teal text-white flex items-center justify-center mb-3">
                  <Icon className="w-7 h-7" aria-hidden="true" />
                </div>
                <p className="text-sm text-gray-warm">
                  {t(`benefits.items.${key}`)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ─── SEGURIDAD Y CONFIANZA ─── */}
      <section
        className="container-onkimia py-16 md:py-24"
        aria-labelledby="endos-safety-title"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
          <div>
            <h2
              id="endos-safety-title"
              className="font-serif text-4xl md:text-5xl mb-6"
            >
              {t('safety.title')}
            </h2>
            <p className="text-lg text-gray-warm text-pretty leading-relaxed">
              {t('safety.description')}
            </p>
          </div>
          {settings.endosSafetyImage && (
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <Image
                src={urlFor(settings.endosSafetyImage)
                  .width(800)
                  .quality(82)
                  .format('webp')
                  .url()}
                alt={t('safety.title')}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          )}
        </div>
      </section>

      {/* ─── FAQs ─── */}
      {faqs.length > 0 && (
        <section
          className="bg-cream py-16 md:py-24"
          aria-labelledby="endos-faq-title"
        >
          <div className="container-onkimia">
            <h2
              id="endos-faq-title"
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
        className="bg-ink py-16 md:py-24"
        aria-labelledby="endos-cta-title"
      >
        <div className="container-onkimia">
          <div className="max-w-3xl mx-auto text-center">
            <h2 id="endos-cta-title" className="font-serif text-4xl md:text-5xl text-white mb-6">
              {t('cta.title')}
            </h2>
            <p className="text-lg text-white/70 leading-relaxed mb-8 text-pretty">
              {t('cta.description')}
            </p>
            <BookingButton section="endos" variant="primary" />
          </div>
        </div>
      </section>
    </>
  );
}
