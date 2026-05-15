import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { sanityFetch } from '@/sanity/lib/fetch';
import { SITE_SETTINGS_QUERY, DOCTORS_QUERY } from '@/sanity/queries';
import { urlFor } from '@/sanity/image';
import { getLocalized } from '@/sanity/lib/localization';
import { HeroSection } from '@/components/ui/HeroSection';
import type { SiteSettings, Doctor } from '@/sanity/types';
import type { Locale } from '@/i18n/routing';
import Image from 'next/image';
import { buildMetadata } from '@/lib/seo/metadata';
import {
  Stethoscope,
  Microscope,
  HeartHandshake,
  Heart,
  Activity,
  Brain,
  ShoppingBag,
  Apple,
  Dna,
  ClipboardCheck,
  UserSearch,
  CalendarCheck,
} from 'lucide-react';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return buildMetadata({
    title: t('defaultTitle'),
    description: t('defaultDescription'),
    locale,
    pathname: '',
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('home');

  const [settings, doctors] = await Promise.all([
    sanityFetch<SiteSettings>({
      query: SITE_SETTINGS_QUERY,
      tags: ['siteSettings'],
    }),
    sanityFetch<Doctor[]>({
      query: DOCTORS_QUERY,
      tags: ['doctor'],
    }),
  ]);

  const heroDescription = settings.homeHeroDescription
    ? getLocalized(settings.homeHeroDescription, locale)
    : t('hero.description');

  return (
    <>
      {/* ─── HERO ─── */}
      <HeroSection
        image={settings.homeHeroImage}
        title={`${t('hero.welcome')} ${settings.title}`}
        subtitle={getLocalized(settings.tagline, locale)}
        description={heroDescription}
        align="center"
        height="lg"
        overlay="medium"
      />

      {/* ─── CUIDARTE ES NUESTRA PRIORIDAD ─── */}
      <section className="container-onkimia py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-brand-900 mb-4">
              {t('priorityCare.title')}
            </h2>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              {t('priorityCare.subtitle')}
            </p>
          </div>

          {/* 3 cards principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center mb-4">
                <Stethoscope className="w-7 h-7" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-medium text-brand-900 mb-2">
                {t('priorityCare.card1.title')}
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                {t('priorityCare.card1.description')}
              </p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center mb-4">
                <Microscope className="w-7 h-7" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-medium text-brand-900 mb-2">
                {t('priorityCare.card2.title')}
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                {t('priorityCare.card2.description')}
              </p>
            </div>

            <div className="bg-white border border-neutral-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="w-14 h-14 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center mb-4">
                <HeartHandshake className="w-7 h-7" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-medium text-brand-900 mb-2">
                {t('priorityCare.card3.title')}
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                {t('priorityCare.card3.description')}
              </p>
            </div>
          </div>

          {/* Servicios adicionales */}
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-neutral-600 text-sm">{t('priorityCare.additionalServices')}</p>
          </div>
        </div>
      </section>

      {/* ─── CONOCE A NUESTROS ESPECIALISTAS ─── */}
      {doctors.length > 0 && (
        <section className="bg-neutral-50 py-16 md:py-24">
          <div className="container-onkimia">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-brand-900 mb-4">
                {t('doctors.title')}
              </h2>
              <p className="text-lg text-neutral-700 max-w-3xl mx-auto">
                {t('doctors.description')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
              {doctors.slice(0, 8).map((doctor) => (
                <article
                  key={doctor._id}
                  className="bg-white rounded-xl overflow-hidden border border-neutral-200 hover:shadow-lg transition-shadow"
                >
                  <div className="relative aspect-[3/4] bg-brand-100">
                    {doctor.photo && (
                      <Image
                        src={urlFor(doctor.photo).width(400).height(533).url()}
                        alt={doctor.fullName}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-brand-900 mb-1">{doctor.fullName}</h3>
                    <p className="text-sm text-neutral-600">
                      {getLocalized(doctor.specialty, locale)}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── BIENESTAR INTEGRAL ─── */}
      <section className="container-onkimia py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-brand-900 mb-4">
              {t('wellness.title')}
            </h2>
            <p className="text-lg text-neutral-700 max-w-3xl mx-auto">
              {t('wellness.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(
              [
                { key: 'relaxation', Icon: Heart },
                { key: 'physiotherapy', Icon: Activity },
                { key: 'psychology', Icon: Brain },
                { key: 'boutique', Icon: ShoppingBag },
                { key: 'nutrition', Icon: Apple },
                { key: 'genomics', Icon: Dna },
              ] as const
            ).map(({ key, Icon }) => (
              <div
                key={key}
                className="bg-white border border-neutral-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-medium text-brand-900 mb-2">
                  {t(`wellness.${key}.title`)}
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  {t(`wellness.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AGENDA TU CITA ─── */}
      <section className="bg-accent-50 py-16 md:py-24">
        <div className="container-onkimia">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-brand-900 mb-6">
              {t('appointment.title')}
            </h2>
            <p className="text-lg text-neutral-700 mb-12">
              {t('appointment.description')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {(
                [
                  { Icon: ClipboardCheck, step: 'step1' },
                  { Icon: UserSearch, step: 'step2' },
                  { Icon: CalendarCheck, step: 'step3' },
                ] as const
              ).map(({ Icon, step }, index) => (
                <div key={step} className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-4">
                    <div className="absolute inset-0 rounded-full bg-accent-500 flex items-center justify-center">
                      <Icon className="w-10 h-10 text-white" aria-hidden="true" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-brand-900 text-white text-sm font-bold flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="font-medium text-brand-900">{t(`appointment.${step}`)}</h3>
                </div>
              ))}
            </div>

            <Link
              href="/contacto#contact-form"
              className="inline-block bg-accent-500 hover:bg-accent-600 text-white font-medium px-8 py-3 rounded-lg transition-colors text-lg"
            >
              {t('appointment.cta')}
            </Link>
          </div>
        </div>
      </section>

      {/* ─── CONVENIOS ─── */}
      <section className="container-onkimia py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium text-brand-900 text-center mb-12">
            {t('insurances.title')}
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {/* TODO Tanda 4: reemplazar por query INSURANCES_QUERY */}
            {[
              'AXA', 'GNP', 'MAPFRE', 'VUMI',
              'INBURSA', 'BANORTE', 'BESTDOCTORS', 'MD ABROAD',
              'CIGNA', 'SURA', 'BX+', 'ZURICH',
              'SCOTIABANK', 'HEALTHCASE', 'ATLAS', 'AXA ASSISTANCE',
            ].map((insurance) => (
              <div
                key={insurance}
                className="flex items-center justify-center p-6 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-accent-500 transition-colors min-h-[100px]"
              >
                <span className="text-neutral-600 font-medium text-center">{insurance}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
