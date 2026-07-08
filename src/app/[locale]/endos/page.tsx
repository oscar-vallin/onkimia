import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { sanityFetch } from '@/sanity/lib/fetch';
import { FAQS_BY_PAGE_QUERY, ENDOS_PAGE_QUERY } from '@/sanity/queries';
import { getLocalized } from '@/lib/localization';
import type { FAQ, EndosPage } from '@/sanity/types';
import type { Locale } from '@/i18n/routing';
import NextImage from 'next/image';
import { PageHero } from '@/components/sections/PageHero';
import { Microscope, Search, Activity, FlaskConical, ScanLine, ShieldCheck, UserCheck, Cpu, Zap, Clock, Heart, Check, Syringe, Target, Droplets, Cable } from 'lucide-react';

import { BookingButton } from '@/components/ui/BookingButton';
import { UnitAvailabilityBanner } from '@/components/ui/UnitAvailabilityBanner';
import { FAQPageLd, MedicalProcedureLd } from '@/components/seo/JsonLd';
import { FAQAccordionItem } from '@/components/ui/FAQAccordionItem';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { FlipCard } from '@/components/ui/FlipCard';
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

/* ─── Static data ─── */
const PROCEDURE_ICONS = [Microscope, Search, Activity, FlaskConical, ScanLine] as const;
const PROCEDURE_ITEM_KEYS = ['endoscopy', 'colonoscopy', 'bronchoscopy', 'biopsy', 'ultrasoundGuided'] as const;
const OTHERS_ICONS = [Syringe, Target, Droplets, Cable] as const;

const SPECIALTY_KEYS = [
  { key: 'endodigestive', image: '/endos-procedures/endos_procedure_1.jpg' },
  { key: 'urology',       image: '/endos-procedures/endos_procedure_2.jpg' },
  { key: 'ent',           image: '/endos-procedures/endos_procedure_3.jpg' },
  { key: 'pulmonology',   image: '/endos-procedures/endos_procedure_4.jpg' },
] as const;

const BENEFIT_KEYS = [
  { key: 'specializedTeam', icon: UserCheck },
  { key: 'latestTechnology', icon: Cpu },
  { key: 'agileProcedures', icon: Zap },
  { key: 'timeAndCostSavings', icon: Clock },
  { key: 'empatheticCare', icon: Heart },
] as const;

const SAFETY_CHECKLIST = ['protocols', 'doctors', 'technology'] as const;

export default async function EndosPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [endosPageData, faqs, t] = await Promise.all([
    sanityFetch<EndosPage | null>({ query: ENDOS_PAGE_QUERY, tags: ['endosPage'] }),
    sanityFetch<FAQ[]>({ query: FAQS_BY_PAGE_QUERY, params: { page: 'endos' }, tags: ['faq'] }),
    getTranslations('endos'),
  ]);

  return (
    <>
      <link rel="preload" as="image" href="/heros/endos-hero-desktop.webp" type="image/webp" media="(min-width: 768px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/heros/endos-hero-mobile.webp"  type="image/webp" media="(max-width: 767px)" fetchPriority="high" />
    <div className="endos-page">
      {/* ─── HERO ─── */}
      <PageHero
        imageSrc="/heros/endos-hero-desktop.webp"
        mobileImageSrc="/heros/endos-hero-mobile.webp"
        mobileObjectPosition="object-[center_25%]"
        imagePosition="md:object-[88%_25%]"
        eyebrow=""
        title={`${t('hero.headlinePart1')}\n*${t('hero.headlinePart2')}*`}
        accent="endos"
        emphasisClassName="italic text-white/85"
        description={t('hero.description')}
        solidLeftBand
        mobileMinHeight="min-h-[90vh]"
      >
        {/* <p className="hidden md:block text-white/45 text-sm italic mb-8">{t('hero.quote')}</p> */}
        {/* <BookingButton section="endos" variant="primary" customLabel={t('cta.button')} customMessage={t('cta.message')} /> */}
      </PageHero>

      {/* ─── AVAILABILITY BANNER ─── */}
      <UnitAvailabilityBanner availableIn={['guadalajara']} messageKey="endos.availability.banner" specializedUnit='Endos'/>

      {/* ════════════════════════════════════════
          DIAGNÓSTICO AMBULATORIO — icon cards
      ════════════════════════════════════════ */}
      <section className="bg-gray-50 py-20 md:py-28" aria-labelledby="endos-procedures-title">
        <div className="container-onkimia">
          <SectionHeader
            align="left"
            id="endos-procedures-title"
            eyebrow={t('procedures.eyebrow')}
            title={<>{t('procedures.headlinePart1')}{' '}<em className="not-italic italic text-secondary">{t('procedures.headlinePart2')}</em></>}
            titleClassName="lg:text-6xl"
            intro={t('procedures.intro')}
            introClassName="text-lg md:text-lg max-w-2xl mb-14"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {PROCEDURE_ITEM_KEYS.map((key, i) => {
              const Icon = PROCEDURE_ICONS[i];
              return (
                <article key={key} className="bg-white border border-black/[0.07] rounded-2xl p-7 flex flex-row items-start gap-4 hover:border-endos-teal-700/20 hover:shadow-sm transition-all duration-200">
                  <div className="w-11 h-11 rounded-xl bg-endos-teal-700/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-endos-teal-700" aria-hidden="true"/>
                  </div>
                  <h3 className="font-serif text-xl text-primary">{t(`procedures.items.${key}.name`)}</h3>
                  {/* <p className="text-sm text-secondary leading-relaxed">{t(`procedures.items.${key}.shortDescription`)}</p> */}
                </article>
              );
            })}
          </div>

          {/* Others */}
          <div className="bg-white border border-black/[0.07] rounded-2xl p-7">
            <div className="flex items-start gap-4 mb-6">
              <ShieldCheck className="w-5 h-5 text-endos-teal-700 flex-shrink-0 mt-0.5" aria-hidden="true"/>
              <div>
                <h3 className="font-serif text-xl text-primary mb-1">{t('procedures.others')}</h3>
                <p className="text-sm text-secondary leading-relaxed">{t('procedures.othersDescription')}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pl-0 sm:pl-9">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(t.raw('procedures.othersItems') as any[]).map((item, i) => {
                const Icon = OTHERS_ICONS[i];
                return (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-endos-teal-900 rounded-xl p-4"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-4 h-4 text-endos-mint-500" aria-hidden="true"/>
                    </div>
                    <p className="text-sm text-white leading-snug font-medium">{item}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SPECIALTIES — flip cards (front: title, back: description)
      ════════════════════════════════════════ */}
      <section className="bg-white py-20 md:py-28" aria-labelledby="endos-specialties-title">
        <div className="container-onkimia">
          <div className="max-w-2xl mb-14">
            <SectionHeader
              align="left"
              id="endos-specialties-title"
              eyebrow={t('specialties.eyebrow')}
              title={t('specialties.title')}
              intro={t('specialties.intro')}
              introClassName="text-lg md:text-lg"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SPECIALTY_KEYS.map(({ key, image }) => (
              <FlipCard
                key={key}
                image={image}
                title={t(`specialties.items.${key}.name`)}
                description={t(`specialties.items.${key}.description`)}
                flipHint={t('specialties.flipHint')}
              />
            ))}
          </div>
        </div>
      </section>
      {SPECIALTY_KEYS.map(({ key }) => (
        <MedicalProcedureLd
          key={key}
          name={t(`specialties.items.${key}.name`)}
          description={t(`specialties.items.${key}.description`)}
        />
      ))}

      {/* ════════════════════════════════════════
          CALIDAD HOSPITALARIA — benefits
      ════════════════════════════════════════ */}
      <section className="bg-gray-50 py-20 md:py-28" aria-labelledby="endos-benefits-title">
        <div className="container-onkimia">
          <SectionHeader
            id="endos-benefits-title"
            eyebrow={t('benefits.eyebrow')}
            title={t('benefits.title')}
            intro={t('benefits.description')}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {BENEFIT_KEYS.map(({ key, icon: Icon }) => (
              <div key={key} className="bg-white border border-black/[0.07] rounded-2xl p-6 flex flex-col items-center text-center gap-4 hover:shadow-sm hover:border-endos-teal-700/10 transition-all duration-200">
                <div className="w-12 h-12 rounded-2xl bg-endos-teal-700 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-white" aria-hidden="true"/>
                </div>
                <p className="font-medium text-primary text-sm leading-snug">{t(`benefits.items.${key}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SEGURIDAD Y CONFIANZA
      ════════════════════════════════════════ */}
      <section className="bg-endos-teal-900 py-12 md:py-16 border-t border-white/[0.06]" aria-labelledby="endos-safety-title">
        <div className="container-onkimia">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
            {/* Left */}
            <div>
              <SectionHeader
                align="left"
                theme="dark"
                id="endos-safety-title"
                eyebrow={t('safety.eyebrow')}
                title={t('safety.title')}
                titleClassName="mb-8"
                intro={t('safety.description')}
                introClassName="text-base text-white/80 mb-10"
              />
              {/* <ul className="space-y-7 mb-10">
                {SAFETY_CHECKLIST.map((key) => (
                  <li key={key} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-white/70" aria-hidden="true"/>
                    </div>
                    <div>
                      <p className="font-medium text-white text-mx mb-1">{t(`safety.checklistItems.${key}.title`)}</p>
                      <p className="text-white/75 text-sm leading-relaxed">{t(`safety.checklistItems.${key}.description`)}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <blockquote className="border-l-2 border-white/30 pl-5">
                <p className="text-white/80 text-mx italic leading-relaxed">{t('safety.quote')}</p>
              </blockquote> */}
            </div>

            {/* Right — image */}
            <div className="relative lg:h-full min-h-[420px] lg:min-h-0">
              <div className="relative w-full h-[420px] lg:h-[300px] rounded-3xl overflow-hidden bg-white/[0.03]">
                <NextImage
                  src="/endos-procedures/safety_trust.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover scale-110 blur-xl opacity-30"
                  aria-hidden="true"
                />
                <NextImage
                  src="/endos-procedures/safety_trust.jpg"
                  alt={t('safety.title')}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-contain relative z-10"
                />
              </div>
              {/* Floating badge — normal flow below the image on mobile (avoids
                  clipping when the overlap doesn't have room to breathe on
                  short viewports); floats overlapping the photo from lg: up */}
              {/* <div className="static mt-4 mx-auto max-w-fit lg:absolute lg:mt-0 lg:bottom-6 lg:left-1/2 lg:-translate-x-1/2 bg-white rounded-2xl shadow-xl px-6 py-4 flex items-center gap-3 min-w-[220px]">
                <div className="w-8 h-8 rounded-full bg-endos-teal-700/10 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4 text-endos-teal-700" aria-hidden="true"/>
                </div>
                <div>
                  <p className="font-medium text-primary text-sm leading-none mb-1">{t('safety.badge')}</p>
                  <p className="text-secondary text-xs">{t('safety.badgeSub')}</p>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>

       {/* ════════════════════════════════════════
          CTA
      ════════════════════════════════════════ */}
      <section className="bg-white py-20 md:py-28" aria-labelledby="endos-cta-title">
        <div className="container-onkimia max-w-3xl mx-auto text-center">
          <SectionHeader
            id="endos-cta-title"
            eyebrow={t('cta.eyebrow')}
            title={t('cta.title')}
            intro={t('cta.description')}
            introClassName="text-lg md:text-lg max-w-xl mx-auto"
            className="mb-0 md:mb-0"
          >
            <BookingButton section="endos" variant="primary" customLabel={t('cta.button')} customMessage={t('cta.message')} />
          </SectionHeader>
        </div>
      </section>

      {/* ════════════════════════════════════════
          PREGUNTAS FRECUENTES
      ════════════════════════════════════════ */}
      {(endosPageData?.faqItems?.length || faqs.length) > 0 && (() => {
        const inlineFaqs = endosPageData?.faqItems?.length
          ? endosPageData.faqItems.map((item) => ({
              id: item._key,
              question: getLocalized(item.question, locale),
              answer: getLocalized(item.answer, locale),
            }))
          : faqs.map((faq) => ({
              id: faq._id,
              question: getLocalized(faq.question, locale),
              answer: getLocalized(faq.answer, locale),
            }));
        return (
          <section className="bg-gray-50 py-20 md:py-28" aria-labelledby="endos-faq-title">
            <div className="container-onkimia">
              <SectionHeader
                id="endos-faq-title"
                eyebrow={t('faq.eyebrow')}
                title={t('faq.title')}
              />
              <div className="max-w-3xl mx-auto space-y-3">
                {inlineFaqs.map((faq) => (
                  <FAQAccordionItem key={faq.id} question={faq.question} answer={faq.answer} accent="endos" />
                ))}
              </div>
              <FAQPageLd faqs={inlineFaqs.map((faq) => ({ question: faq.question, answer: faq.answer }))} />
            </div>
          </section>
        );
      })()}

    </div>
    </>
  );
}
