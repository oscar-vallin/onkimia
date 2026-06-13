import { Suspense } from 'react';
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { sanityFetch } from '@/sanity/lib/fetch';
import { SITE_SETTINGS_QUERY } from '@/sanity/queries';
import { HeroHome } from '@/components/sections/HeroHome';
import type { SiteSettings } from '@/sanity/types';
import type { Locale } from '@/i18n/routing';
import { buildMetadata } from '@/lib/seo/metadata';
import { StickyStages } from '@/components/sections/StickyStages';
import { OrbitDiagram } from '@/components/sections/OrbitDiagram';
import { DoctorsSection } from '@/components/sections/home/DoctorsSection';
import { InsurancesSection } from '@/components/sections/home/InsurancesSection';
import { ProceduresSection } from '@/components/sections/home/ProceduresSection';
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

  // Only settings fetched here — hero flushes immediately while
  // doctors/insurances/procedures stream in via Suspense boundaries below.
  const settings = await sanityFetch<SiteSettings>({
    query: SITE_SETTINGS_QUERY,
    tags: ['siteSettings'],
  });

  return (
    <>
      {/* ─── HERO — above the fold, renders immediately ─── */}
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

      {/* ─── PROCEDURES — streamed ─── */}
      <Suspense fallback={<ProceduresCarouselSkeleton />}>
        <ProceduresSection locale={locale} backgroundImage={settings.proceduresBgImage} />
      </Suspense>

      {/* ─── CUIDARTE ES NUESTRA PRIORIDAD — static ─── */}
      <section className="bg-ink py-16 md:py-24">
        <div className="container-onkimia max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-4">
              {t('priorityCare.title')}
            </h2>
            <p className="text-lg text-white/65 leading-relaxed max-w-3xl mx-auto">
              {t('priorityCare.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {(
              [
                { Icon: Stethoscope, titleKey: 'priorityCare.card1.title', descKey: 'priorityCare.card1.description' },
                { Icon: Microscope,  titleKey: 'priorityCare.card2.title', descKey: 'priorityCare.card2.description' },
                { Icon: HeartHandshake, titleKey: 'priorityCare.card3.title', descKey: 'priorityCare.card3.description' },
              ] as const
            ).map(({ Icon, titleKey, descKey }) => (
              <article
                key={titleKey}
                className="group relative rounded-3xl overflow-hidden bg-ink-2 border border-white/[0.08] p-8 md:p-10 transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-[0_24px_60px_rgba(0,0,0,0.4)] hover:border-white/[0.16]"
              >
                {/* Teal glow on hover */}
                <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-teal/[0.05] blur-3xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true" />
                <div className="relative w-12 h-12 rounded-2xl bg-teal/10 flex items-center justify-center mb-8">
                  <Icon className="w-6 h-6 text-teal-soft" aria-hidden="true" />
                </div>
                <h3 className="relative font-serif text-2xl text-white mb-4 leading-tight">
                  {t(titleKey)}
                </h3>
                <p className="relative text-white/65 text-base leading-relaxed">
                  {t(descKey)}
                </p>
              </article>
            ))}
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <p className="text-white/45 text-sm">{t('priorityCare.additionalServices')}</p>
          </div>
        </div>
      </section>

      {/* ─── ORBIT — static ─── */}
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

      {/* ─── STICKY STAGES — static (uses settings already resolved above) ─── */}
      <StickyStages
        eyebrow={t('process.eyebrow')}
        title={t('process.title')}
        lead={t('process.lead')}
        heroImage={settings.processImage}
        imageAlt={t('process.imageAlt')}
        stages={[
          { step: t('process.step1.step'), title: t('process.step1.title'), description: t('process.step1.description'), icon: 'users' },
          { step: t('process.step2.step'), title: t('process.step2.title'), description: t('process.step2.description'), icon: 'microscope' },
          { step: t('process.step3.step'), title: t('process.step3.title'), description: t('process.step3.description'), icon: 'activity' },
          { step: t('process.step4.step'), title: t('process.step4.title'), description: t('process.step4.description'), icon: 'heart' },
        ]}
      />

      {/* ─── DOCTORS — streamed ─── */}
      <Suspense fallback={<DoctorsGridSkeleton />}>
        <DoctorsSection locale={locale} />
      </Suspense>

      {/* ─── BIENESTAR INTEGRAL — static ─── */}
      <section className="bg-cream py-16 md:py-24">
        <div className="container-onkimia max-w-6xl mx-auto">
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
              <article
                key={key}
                className="rounded-2xl border border-line bg-white p-6 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(26,122,110,0.12)] hover:border-teal/30"
              >
                <div className="w-10 h-10 rounded-xl bg-[var(--teal-dim)] flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-teal" aria-hidden="true" />
                </div>
                <h3 className="font-sans font-medium text-ink text-lg mb-2">{t(`wellness.${key}.title`)}</h3>
                <p className="text-gray-warm text-sm leading-relaxed">{t(`wellness.${key}.description`)}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AGENDA TU CITA — static ─── */}
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

      {/* ─── INSURANCES — streamed ─── */}
      <Suspense fallback={<InsurancesSkeleton />}>
        <InsurancesSection />
      </Suspense>
    </>
  );
}

function ProceduresCarouselSkeleton() {
  return (
    <div className="bg-ink py-20 md:py-28 animate-pulse">
      <div className="container-onkimia">
        <div className="h-3 w-36 bg-white/10 rounded mb-4" />
        <div className="h-10 w-72 bg-white/10 rounded" />
      </div>
      <div className="mt-12 flex gap-5 overflow-hidden px-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-[300px] h-[400px] flex-shrink-0 rounded-3xl bg-white/5" />
        ))}
      </div>
    </div>
  );
}

function DoctorsGridSkeleton() {
  return (
    <div className="bg-ink py-20 md:py-28 animate-pulse">
      <div className="container-onkimia">
        <div className="text-center mb-16">
          <div className="h-3 w-28 bg-white/10 rounded mx-auto mb-4" />
          <div className="h-10 w-80 bg-white/10 rounded mx-auto mb-3" />
          <div className="h-4 w-96 bg-white/10 rounded mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}

function InsurancesSkeleton() {
  return (
    <div className="bg-cream py-20 md:py-28 animate-pulse">
      <div className="container-onkimia">
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_2fr] gap-12 items-center">
          <div>
            <div className="h-24 w-20 bg-ink/10 rounded mb-4" />
            <div className="h-3 w-48 bg-ink/10 rounded" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-[90px] rounded-2xl bg-ink/10" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
