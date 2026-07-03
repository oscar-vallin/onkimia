import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { sanityFetch } from '@/sanity/lib/fetch';
import { FAQS_BY_PAGE_QUERY, ENDOS_PAGE_QUERY } from '@/sanity/queries';
import { urlFor } from '@/sanity/image';
import { getLocalized } from '@/lib/localization';
import type { FAQ, EndosPage } from '@/sanity/types';
import type { Locale } from '@/i18n/routing';
import { SanityImage as Image } from '@/components/ui/SanityImage';
import NextImage from 'next/image';
import { PageHero } from '@/components/sections/PageHero';
import { Microscope, Search, Activity, FlaskConical, ScanLine, ShieldCheck, UserCheck, Cpu, Zap, Clock, Heart, Check, Syringe, Target, Droplets, Cable } from 'lucide-react';

import { BookingButton } from '@/components/ui/BookingButton';
import { UnitAvailabilityBanner } from '@/components/ui/UnitAvailabilityBanner';
import { FAQPageLd, MedicalProcedureLd } from '@/components/seo/JsonLd';
import { FAQAccordionItem } from '@/components/ui/FAQAccordionItem';
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
        eyebrow={
          <div className="inline-flex items-center bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2.5 shadow-lg">
            <NextImage
              src="/endos-procedures/endos-logo.webp"
              alt={t('hero.eyebrow')}
              width={180}
              height={60}
              className="h-18  md:h-18 w-auto object-contain"
              priority
            />
          </div>
        }
        title={`${t('hero.headlinePart1')}\n*${t('hero.headlinePart2')}*`}
        accent="endos"
        emphasisClassName="italic text-white/85"
        description={t('hero.description')}
        solidLeftBand
        mobileMinHeight="min-h-[90vh]"
      >
        <p className="hidden md:block text-white/45 text-sm italic mb-8">{t('hero.quote')}</p>
        <BookingButton section="endos" variant="primary" customLabel={t('cta.button')} customMessage={t('cta.message')} />
      </PageHero>

      {/* ─── AVAILABILITY BANNER ─── */}
      <UnitAvailabilityBanner availableIn={['guadalajara']} messageKey="endos.availability.banner" specializedUnit='Endos'/>

      {/* ════════════════════════════════════════
          DIAGNÓSTICO AMBULATORIO — icon cards
      ════════════════════════════════════════ */}
      <section className="bg-gray-50 py-20 md:py-28" aria-labelledby="endos-procedures-title">
        <div className="container-onkimia">
          <p className="text-xs tracking-[0.25em] uppercase text-secondary font-medium mb-5">
            {t('procedures.eyebrow')}
          </p>
          <h2 id="endos-procedures-title" className="font-serif text-4xl md:text-5xl lg:text-6xl text-primary leading-tight mb-5">
            {t('procedures.headlinePart1')}{' '}
            <em className="not-italic italic text-secondary">{t('procedures.headlinePart2')}</em>
          </h2>
          <p className="text-secondary text-lg leading-relaxed max-w-2xl mb-14">
            {t('procedures.intro')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {PROCEDURE_ITEM_KEYS.map((key, i) => {
              const Icon = PROCEDURE_ICONS[i];
              return (
                <article key={key} className="bg-white border border-black/[0.07] rounded-2xl p-7 hover:border-endos-teal-700/20 hover:shadow-sm transition-all duration-200">
                  <div className="w-11 h-11 rounded-xl bg-endos-teal-700/10 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-endos-teal-700" aria-hidden="true"/>
                  </div>
                  <h3 className="font-serif text-xl text-primary mb-2">{t(`procedures.items.${key}.name`)}</h3>
                  <p className="text-sm text-secondary leading-relaxed">{t(`procedures.items.${key}.shortDescription`)}</p>
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
            <p className="text-xs tracking-[0.25em] uppercase text-secondary font-medium mb-5">
              {t('specialties.eyebrow')}
            </p>
            <h2 id="endos-specialties-title" className="font-serif text-4xl md:text-5xl text-primary leading-tight mb-5">
              {t('specialties.title')}
            </h2>
            <p className="text-secondary text-lg leading-relaxed">
              {t('specialties.intro')}
            </p>
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
          <div className="text-center mb-14 max-w-2xl mx-auto">
            <p className="text-xs tracking-[0.25em] uppercase text-secondary font-medium mb-5">
              {t('benefits.eyebrow')}
            </p>
            <h2 id="endos-benefits-title" className="font-serif text-4xl md:text-5xl text-primary leading-tight mb-5">
              {t('benefits.title')}
            </h2>
            <p className="text-secondary text-base leading-relaxed">
              {t('benefits.description')}
            </p>
          </div>
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
      <section className="bg-endos-teal-900 py-20 md:py-28 border-t border-white/[0.06]" aria-labelledby="endos-safety-title">
        <div className="container-onkimia">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-stretch">
            {/* Left */}
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-white/50 font-medium mb-5">
                {t('safety.eyebrow')}
              </p>
              <h2 id="endos-safety-title" className="font-serif text-4xl md:text-5xl text-white leading-tight mb-8">
                {t('safety.title')}
              </h2>
              <p className="text-white/80 text-base leading-relaxed mb-10">
                {t('safety.description')}
              </p>
              <ul className="space-y-7 mb-10">
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
              </blockquote>
            </div>

            {/* Right — image */}
            <div className="relative h-full min-h-[420px] lg:min-h-0">
              <div className="relative w-full h-full rounded-3xl overflow-hidden bg-white/[0.03]">
                {endosPageData?.safetyImage?.asset ? (
                  <>
                    <Image
                      src={urlFor(endosPageData.safetyImage).width(900).format('webp').quality(85).url()}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover scale-110 blur-xl opacity-30"
                      aria-hidden="true"
                    />
                    <Image
                      src={urlFor(endosPageData.safetyImage).width(900).format('webp').quality(85).url()}
                      alt={t('safety.title')}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-contain relative z-10"
                      placeholder={endosPageData.safetyImage?.asset?.metadata?.lqip ? 'blur' : 'empty'}
                      blurDataURL={endosPageData.safetyImage?.asset?.metadata?.lqip ?? undefined}
                    />
                  </>
                ) : (
                  <div className="absolute inset-0 border border-white/[0.08] flex flex-col items-center justify-center gap-2">
                    <ShieldCheck className="w-10 h-10 text-white/10"/>
                    <p className="text-white/20 text-xs">endosSafetyImage</p>
                  </div>
                )}
              </div>
              {/* Floating badge */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white rounded-2xl shadow-xl px-6 py-4 flex items-center gap-3 min-w-[220px]">
                <div className="w-8 h-8 rounded-full bg-endos-teal-700/10 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4 text-endos-teal-700" aria-hidden="true"/>
                </div>
                <div>
                  <p className="font-medium text-primary text-sm leading-none mb-1">{t('safety.badge')}</p>
                  <p className="text-secondary text-xs">{t('safety.badgeSub')}</p>
                </div>
              </div>
            </div>
          </div>
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
              <p className="text-xs tracking-[0.25em] uppercase text-secondary font-medium mb-5 text-center">
                {t('faq.eyebrow')}
              </p>
              <h2 id="endos-faq-title" className="font-serif text-4xl md:text-5xl text-primary text-center mb-14">
                {t('faq.title')}
              </h2>
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

      {/* ════════════════════════════════════════
          CTA
      ════════════════════════════════════════ */}
      <section className="bg-white py-20 md:py-28" aria-labelledby="endos-cta-title">
        <div className="container-onkimia max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-[0.25em] uppercase text-secondary font-medium mb-6">
            {t('cta.eyebrow')}
          </p>
          <h2 id="endos-cta-title" className="font-serif text-4xl md:text-5xl text-primary leading-tight mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-secondary text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            {t('cta.description')}
          </p>
          <BookingButton section="endos" variant="primary" customLabel={t('cta.button')} customMessage={t('cta.message')} />
        </div>
      </section>
    </div>
    </>
  );
}
