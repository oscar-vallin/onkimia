import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { sanityFetch } from '@/sanity/lib/fetch';
import { DOCTORS_QUERY, INSURANCES_QUERY, PROCEDURES_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/queries';
import { HeroHome } from '@/components/sections/HeroHome';
import type { Doctor, Insurance, Procedure, SiteSettings } from '@/sanity/types';
import type { Locale } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo/metadata';
import { ConveniosEditorial } from '@/components/sections/ConveniosEditorial';
import { StickyStages } from '@/components/sections/StickyStages';
import { ProcedureCarousel } from '@/components/sections/ProcedureCarousel';
import { SpecialistList } from '@/components/sections/SpecialistList';
import { OrbitDiagram } from '@/components/sections/OrbitDiagram';
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

  const [settings, doctors, insurances, procedures] = await Promise.all([
    sanityFetch<SiteSettings>({
      query: SITE_SETTINGS_QUERY,
      tags: ['siteSettings'],
    }),
    sanityFetch<Doctor[]>({
      query: DOCTORS_QUERY,
      tags: ['doctor'],
    }),
    sanityFetch<Insurance[]>({
      query: INSURANCES_QUERY,
      tags: ['insurance'],
    }),
    sanityFetch<Procedure[]>({
      query: PROCEDURES_QUERY,
      params: { locale },
      tags: ['procedure'],
    }),
  ]);
  
  return (
    <>
      {/* ─── HERO ─── */}
      <HeroHome
        eyebrow={t('homeHero.eyebrow')}
        title={t('homeHero.title')}
        description={t('homeHero.description')}
        primaryCta={{ label: t('homeHero.cta.primary.label'), href: t('homeHero.cta.primary.href') }}
        secondaryCta={{ label: t('homeHero.cta.secondary.label'), href: t('homeHero.cta.secondary.href') }}
        features={[
          { icon: 'pulse', title: t('homeHero.features.diagnostic.title'), description: t('homeHero.features.diagnostic.description') },
          { icon: 'heart', title: t('homeHero.features.human.title'), description: t('homeHero.features.human.description') },
          { icon: 'shield', title: t('homeHero.features.support.title'), description: t('homeHero.features.support.description') },
        ]}
        heroImage={settings.homeHeroImage}
      />

      <ProcedureCarousel
        eyebrow={t('homeProcedures.eyebrow')}
        title={t('homeProcedures.title')}
        lead={t('homeProcedures.lead')}
        backgroundImage={settings.proceduresBgImage}
        backgroundImageSrc="/images/procedures-bg-placeholder.jpg"
        procedures={procedures}
      />

      {/* ─── CUIDARTE ES NUESTRA PRIORIDAD ─── */}
      <section className="container-onkimia py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink mb-4">
              {t('priorityCare.title')}
            </h2>
            <p className="text-lg text-gray-warm leading-relaxed max-w-3xl mx-auto">
              {t('priorityCare.subtitle')}
            </p>
          </div>

          {/* 3 cards principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white border border-line rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 ease-out">
              <div className="w-14 h-14 rounded-lg bg-teal/10 text-teal flex items-center justify-center mb-4">
                <Stethoscope className="w-7 h-7" aria-hidden="true" />
              </div>
              <h3 className="text-xl text-ink mb-2">
                {t('priorityCare.card1.title')}
              </h3>
              <p className="text-gray-warm text-sm leading-relaxed">
                {t('priorityCare.card1.description')}
              </p>
            </div>

            <div className="bg-white border border-line rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 ease-out">
              <div className="w-14 h-14 rounded-lg bg-teal/10 text-teal flex items-center justify-center mb-4">
                <Microscope className="w-7 h-7" aria-hidden="true" />
              </div>
              <h3 className="text-xl text-ink mb-2">
                {t('priorityCare.card2.title')}
              </h3>
              <p className="text-gray-warm text-sm leading-relaxed">
                {t('priorityCare.card2.description')}
              </p>
            </div>

            <div className="bg-white border border-line rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 ease-out">
              <div className="w-14 h-14 rounded-lg bg-teal/10 text-teal flex items-center justify-center mb-4">
                <HeartHandshake className="w-7 h-7" aria-hidden="true" />
              </div>
              <h3 className="text-xl text-ink mb-2">
                {t('priorityCare.card3.title')}
              </h3>
              <p className="text-gray-warm text-sm leading-relaxed">
                {t('priorityCare.card3.description')}
              </p>
            </div>
          </div>

          {/* Servicios adicionales */}
          <div className="text-center max-w-3xl mx-auto">
            <p className="text-gray-warm text-sm">{t('priorityCare.additionalServices')}</p>
          </div>
        </div>
      </section>

      <OrbitDiagram
        eyebrow={t('orbit.eyebrow')}
        title={t('orbit.title')}
        items={[
          { num: '1', name: t('orbit.items.cercana.name'), description: t('orbit.items.cercana.description') },
          { num: '2', name: t('orbit.items.precisa.name'), description: t('orbit.items.precisa.description') },
          { num: '3', name: t('orbit.items.integral.name'), description: t('orbit.items.integral.description') },
          { num: '4', name: t('orbit.items.humana.name'), description: t('orbit.items.humana.description') },
        ]}
      />

      <StickyStages
        eyebrow={t('process.eyebrow')}
        title={t('process.title')}
        lead={t('process.lead')}
        heroImage={settings.processImage}
        imageSrc="/images/process-placeholder.jpg"
        imageAlt={t('process.imageAlt')}
        stages={[
          { step: t('process.step1.step'), title: t('process.step1.title'), description: t('process.step1.description'), icon: 'users' },
          { step: t('process.step2.step'), title: t('process.step2.title'), description: t('process.step2.description'), icon: 'microscope' },
          { step: t('process.step3.step'), title: t('process.step3.title'), description: t('process.step3.description'), icon: 'activity' },
          { step: t('process.step4.step'), title: t('process.step4.title'), description: t('process.step4.description'), icon: 'heart' },
        ]}
      />

      {doctors.length > 0 && (
        <SpecialistList
          doctors={doctors}
          eyebrow={t('doctors.eyebrow')}
          title={t('doctors.title')}
          description={t('doctors.description')}
          ctaLabel={t('doctors.viewDetail')}
          locale={locale}
        />
      )}

      {/* ─── BIENESTAR INTEGRAL ─── */}
      <section className="container-onkimia py-16 md:py-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink mb-4">
              {t('wellness.title')}
            </h2>
            <p className="text-lg text-gray-warm leading-relaxed max-w-3xl mx-auto">
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
                className="bg-white border border-line rounded-2xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-200 ease-out"
              >
                <div className="w-12 h-12 rounded-lg bg-teal/10 text-teal flex items-center justify-center mb-3">
                  <Icon className="w-6 h-6" aria-hidden="true" />
                </div>
                <h3 className="text-lg text-ink mb-2">
                  {t(`wellness.${key}.title`)}
                </h3>
                <p className="text-sm text-gray-warm leading-relaxed">
                  {t(`wellness.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AGENDA TU CITA ─── */}
      <section className="bg-ink py-16 md:py-24">
        <div className="container-onkimia">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6">
              {t('appointment.title')}
            </h2>
            <p className="text-lg text-white/70 leading-relaxed mb-12">
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
                    <div className="absolute inset-0 rounded-full bg-teal flex items-center justify-center">
                      <Icon className="w-10 h-10 text-white" aria-hidden="true" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-ink-2 border border-white/[0.08] text-white text-sm font-medium flex items-center justify-center">
                      {index + 1}
                    </div>
                  </div>
                  <h3 className="text-white">{t(`appointment.${step}`)}</h3>
                </div>
              ))}
            </div>

            <Link
              href="/contacto#contact-form"
              className="inline-block bg-teal hover:bg-teal-soft text-white font-medium px-8 py-3 rounded-lg transition-colors text-lg"
            >
              {t('appointment.cta')}
            </Link>
          </div>
        </div>
      </section>

      <ConveniosEditorial
        insurances={insurances}
        eyebrow={t('insurances.eyebrow')}
        title={t('insurances.title')}
        statLabel={t('insurances.statLabel')}
      />
    </>
  );
}
