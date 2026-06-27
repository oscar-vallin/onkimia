import { Suspense } from 'react';
import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ROUTES } from '@/config/routes';
import { sanityFetch } from '@/sanity/lib/fetch';
import { SITE_SETTINGS_QUERY } from '@/sanity/queries';
import { HeroHome } from '@/components/sections/HeroHome';
import { HowItWorks } from '@/components/sections/HowItWorks';
import { Pillars } from '@/components/sections/Pillars';
import { Studies } from '@/components/sections/Studies';
import { Wellness } from '@/components/sections/Wellness';
import type { SiteSettings } from '@/sanity/types';
import type { Locale } from '@/i18n/routing';
import { getLocalized } from '@/sanity/lib/localization';
import { buildMetadata } from '@/lib/seo/metadata';
import { FALLBACK_WELLNESS, FALLBACK_SERVICES } from '@/content/fallbacks';
import { StickyStages } from '@/components/sections/StickyStages';
// Retirado del home nuevo (migración 2026-06-23). Conservado por si se reutiliza.
// import { OrbitDiagram } from '@/components/sections/OrbitDiagram';
import { DoctorsSection } from '@/components/sections/home/DoctorsSection';
import { InsurancesSection } from '@/components/sections/home/InsurancesSection';
// import { PriorityCare } from '@/components/sections/PriorityCare';
import { AppointmentCta } from '@/components/sections/AppointmentCta';
// Retirado del home nuevo (migración 2026-06-23). Conservado por si se reutiliza.
// import { ProceduresSection } from '@/components/sections/home/ProceduresSection';

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
      {/* ─── Hero image preloads — LCP critical path.
          Next.js App Router hoists <link> RSC elements to <head>.
          media attrs mirror the <picture> in HeroHome.tsx exactly so
          the browser downloads only the variant it will display. ─── */}
      <link rel="preload" as="image" href="/heros/hero-main-750.webp"  type="image/webp" media="(max-width: 749px)"                          fetchPriority="high" />
      <link rel="preload" as="image" href="/heros/hero-main-1280.webp" type="image/webp" media="(min-width: 750px) and (max-width: 1279px)"  fetchPriority="high" />
      <link rel="preload" as="image" href="/heros/hero-main-1920.webp" type="image/webp" media="(min-width: 1280px)"                         fetchPriority="high" />

      {/* ─── HERO — above the fold, renders immediately ─── */}
      <HeroHome
        eyebrowBase={t('homeHero.eyebrowBase')}
        eyebrowDefaultCity={t('homeHero.eyebrowDefaultCity')}
        eyebrowColimaCity={t('homeHero.eyebrowColimaCity')}
        title={t('homeHero.title')}
        description={t('homeHero.description')}
        primaryCta={{ label: t('homeHero.cta.primary.label'), href: t('homeHero.cta.primary.href') }}
        secondaryCta={{ label: t('homeHero.cta.secondary.label'), href: t('homeHero.cta.secondary.href') }}
        stats={[
          { number: t('homeHero.stats.specialists.number'), label: t('homeHero.stats.specialists.label') },
          { number: t('homeHero.stats.detection.number'), label: t('homeHero.stats.detection.label') },
          { number: t('homeHero.stats.guide.number'), label: t('homeHero.stats.guide.label') },
        ]}
      />

      {/* ─── HOW IT WORKS — static ─── */}
      <HowItWorks
        eyebrow={t('howItWorks.eyebrow')}
        title={t('howItWorks.title')}
        intro={t('howItWorks.intro')}
        cta={t('howItWorks.cta')}
        ctaHref={ROUTES.services}
        steps={[
          {
            number: t('howItWorks.step1.number'),
            title: t('howItWorks.step1.title'),
            description: t('howItWorks.step1.description'),
            image: settings.howItWorksSteps?.[0]?.image,
          },
          {
            number: t('howItWorks.step2.number'),
            title: t('howItWorks.step2.title'),
            description: t('howItWorks.step2.description'),
            image: settings.howItWorksSteps?.[1]?.image,
          },
          {
            number: t('howItWorks.step3.number'),
            title: t('howItWorks.step3.title'),
            description: t('howItWorks.step3.description'),
            image: settings.howItWorksSteps?.[2]?.image,
          },
        ]}
      />

      {/* ─── PILLARS — static ─── */}
      <Pillars
        eyebrow={t('pillars.eyebrow')}
        title={t('pillars.title')}
        intro={t('pillars.intro')}
        cta={t('pillars.cta')}
        ctaHref={ROUTES.services}
        pillars={[
          { title: t('pillars.cancer.title'),        description: t('pillars.cancer.description') },
          { title: t('pillars.cardiovascular.title'), description: t('pillars.cardiovascular.description') },
          { title: t('pillars.metabolic.title'),      description: t('pillars.metabolic.description') },
          { title: t('pillars.neurological.title'),   description: t('pillars.neurological.description') },
        ]}
      />

      {/* ─── STUDIES — static ─── */}
      <Studies
        eyebrow={t('studies.eyebrow')}
        title={t('studies.title')}
        intro={t('studies.intro')}
        labels={[
          { title: t('studies.mri.title'),     subtitle: t('studies.mri.subtitle') },
          { title: t('studies.bio.title'),     subtitle: t('studies.bio.subtitle') },
          { title: t('studies.cardio.title'),  subtitle: t('studies.cardio.subtitle') },
          { title: t('studies.genomics.title'),subtitle: t('studies.genomics.subtitle') },
        ]}
        gallery={settings.studiesGallery}
      />

      {/* ─── PROCEDURES — Retirado del home nuevo (migración 2026-06-23). Conservado por si se reutiliza. ─── */}
      {/* <Suspense fallback={<ProceduresCarouselSkeleton />}>
        <ProceduresSection locale={locale} backgroundImage={settings.proceduresBgImage} />
      </Suspense> */}

      {/* ─── CUIDARTE ES NUESTRA PRIORIDAD ─── */}
      {/* <PriorityCare
        title={t('priorityCare.title')}
        subtitle={t('priorityCare.subtitle')}
        card1Title={t('priorityCare.card1.title')}
        card1Description={t('priorityCare.card1.description')}
        card2Title={t('priorityCare.card2.title')}
        card2Description={t('priorityCare.card2.description')}
        card3Title={t('priorityCare.card3.title')}
        card3Description={t('priorityCare.card3.description')}
        additionalServices={t('priorityCare.additionalServices')}
      /> */}

      {/* ─── ORBIT — Retirado del home nuevo (migración 2026-06-23). Conservado por si se reutiliza. ─── */}
      {/* <OrbitDiagram
        eyebrow={t('orbit.eyebrow')}
        title={t('orbit.title')}
        items={[
          { num: '1', name: t('orbit.items.cercana.name'), description: t('orbit.items.cercana.description') },
          { num: '2', name: t('orbit.items.precisa.name'), description: t('orbit.items.precisa.description') },
          { num: '3', name: t('orbit.items.integral.name'), description: t('orbit.items.integral.description') },
          { num: '4', name: t('orbit.items.humana.name'), description: t('orbit.items.humana.description') },
        ]}
      /> */}

      {/* ─── SERVICES — uses Sanity servicesList; fallback to hardcoded items ─── */}
      <StickyStages
        eyebrow={t('services.eyebrow')}
        title={t('services.title')}
        lead={t('services.lead')}
        ctaLabel={t('services.cta')}
        ctaHref={ROUTES.contact}
        items={
          settings.servicesList?.length
            ? settings.servicesList.map((s) => ({
                icon: s.icon,
                title: getLocalized(s.title, locale as 'es' | 'en'),
                description: getLocalized(s.description, locale as 'es' | 'en'),
              }))
            : FALLBACK_SERVICES[locale as 'es' | 'en'] ?? FALLBACK_SERVICES.es
        }
      />

      {/* ─── DOCTORS — streamed ─── */}
      <Suspense fallback={<DoctorsGridSkeleton />}>
        <DoctorsSection locale={locale} />
      </Suspense>

      {/* ─── WELLNESS — static, items from Sanity or i18n fallback ─── */}
      <Wellness
        eyebrow={t('wellness.eyebrow')}
        title={t('wellness.title')}
        intro={t('wellness.intro')}
        backgroundImage={settings.wellnessImage}
        items={
          settings.wellbeingList?.length
            ? settings.wellbeingList.map((w) => ({
                icon: w.icon,
                title: getLocalized(w.title, locale as 'es' | 'en'),
                description: getLocalized(w.description, locale as 'es' | 'en'),
              }))
            : FALLBACK_WELLNESS[locale as 'es' | 'en'] ?? FALLBACK_WELLNESS.es
        }
      />

      {/* ─── INSURANCES — streamed ─── */}
      <Suspense fallback={<InsurancesSkeleton />}>
        <InsurancesSection />
      </Suspense>

       {/* ─── AGENDA TU CITA ─── */}
      <AppointmentCta
        title={t('appointment.title')}
        step1={t('appointment.step1')}
        step3={t('appointment.step3')}
        tagline={t('appointment.tagline')}
        cta={t('appointment.cta')}
        ctaHref={ROUTES.contactForm}
        backgroundImage={settings.appointmentCtaBgImage}
      />
    </>
  );
}


// Retirado del home nuevo (migración 2026-06-23). Conservado por si se reutiliza.
// function ProceduresCarouselSkeleton() {
//   return (
//     <div className="bg-ink py-20 md:py-28 animate-pulse">
//       <div className="container-onkimia">
//         <div className="h-3 w-36 bg-white/10 rounded mb-4" />
//         <div className="h-10 w-72 bg-white/10 rounded" />
//       </div>
//       <div className="mt-12 flex gap-5 overflow-hidden px-6">
//         {Array.from({ length: 4 }).map((_, i) => (
//           <div key={i} className="w-[300px] h-[400px] flex-shrink-0 rounded-3xl bg-white/5" />
//         ))}
//       </div>
//     </div>
//   );
// }

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
