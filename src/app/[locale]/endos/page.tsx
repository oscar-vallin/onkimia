import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { sanityFetch } from '@/sanity/lib/fetch';
import { FAQS_BY_PAGE_QUERY, ENDOS_PROCEDURES_QUERY, ENDOS_PAGE_QUERY } from '@/sanity/queries';
import { urlFor } from '@/sanity/image';
import { getLocalized } from '@/sanity/lib/localization';
import type { FAQ, Procedure, EndosPage } from '@/sanity/types';
import type { Locale } from '@/i18n/routing';
import { SanityImage as Image } from '@/components/ui/SanityImage';
import { PageHero } from '@/components/sections/PageHero';
import { Microscope, Search, Activity, FlaskConical, ScanLine, ShieldCheck, UserCheck, Cpu, Zap, Clock, Heart, Check } from 'lucide-react';
import { BookingButton } from '@/components/ui/BookingButton';
import { UnitAvailabilityBanner } from '@/components/ui/UnitAvailabilityBanner';
import { FAQPageLd, MedicalProcedureLd } from '@/components/seo/JsonLd';
import { FAQAccordionItem } from '@/components/ui/FAQAccordionItem';
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

  const [endosPageData, faqs, procedures, t] = await Promise.all([
    sanityFetch<EndosPage | null>({ query: ENDOS_PAGE_QUERY, tags: ['endosPage'] }),
    sanityFetch<FAQ[]>({ query: FAQS_BY_PAGE_QUERY, params: { page: 'endos' }, tags: ['faq'] }),
    sanityFetch<Procedure[]>({ query: ENDOS_PROCEDURES_QUERY, params: { locale }, tags: ['procedure'] }),
    getTranslations('endos'),
  ]);

  return (
    <>
      <link rel="preload" as="image" href="/heros/endos-hero-desktop.webp" type="image/webp" media="(min-width: 769px)" fetchPriority="high" />
      <link rel="preload" as="image" href="/heros/endos-hero-mobile.webp"  type="image/webp" media="(max-width: 768px)" fetchPriority="high" />
    <div className="endos-page">
      {/* ─── HERO ─── */}
      <PageHero
        imageSrc="/heros/endos-hero-desktop.webp"
        mobileImageSrc="/heros/endos-hero-mobile.webp"
        mobileObjectPosition="object-[center_25%]"
        imagePosition="md:object-[88%_25%]"
        eyebrow={t('hero.eyebrow')}
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
          <div className="bg-white border border-black/[0.07] rounded-2xl p-7 flex items-start gap-4">
            <ShieldCheck className="w-5 h-5 text-endos-teal-700 flex-shrink-0 mt-0.5" aria-hidden="true"/>
            <div>
              <h3 className="font-serif text-xl text-primary mb-1">{t('procedures.others')}</h3>
              <p className="text-sm text-secondary leading-relaxed">{t('procedures.othersDescription')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          PROCEDURES WITH IMAGES — Sanity photos
      ════════════════════════════════════════ */}
      {procedures.length > 0 && (
        <section className="bg-white py-20 md:py-28" aria-label={t('procedures.title')}>
          <div className="container-onkimia">
            <div className={`grid gap-4 ${
              procedures.length === 1 ? 'grid-cols-1 max-w-lg mx-auto' :
              procedures.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
              procedures.length >= 3 && procedures.length <= 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' :
              'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}>
              {procedures.map((proc, i) => (
                <article
                  key={proc._id}
                  className={`relative rounded-3xl overflow-hidden group ${
                    procedures.length >= 5 && i === 0 ? 'sm:col-span-2' : ''
                  }`}
                >
                  <div className={`relative w-full ${
                    procedures.length >= 5 && i === 0 ? 'aspect-[16/10]' : 'aspect-[3/4]'
                  }`}>
                    {proc.image?.asset ? (
                      <Image
                        src={urlFor(proc.image).width(900).height(1200).format('webp').quality(85).url()}
                        alt={proc.name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                        placeholder={proc.image?.asset?.metadata?.lqip ? 'blur' : 'empty'}
                        blurDataURL={proc.image?.asset?.metadata?.lqip ?? undefined}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-endos-teal-700/10" />
                    )}
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 35%, transparent 45%, rgba(0,0,0,0.80) 70%, rgba(0,0,0,0.92) 100%)' }}
                      aria-hidden="true"
                    />
                    <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
                      <div>
                        <span className="inline-block text-[10px] tracking-[0.2em] uppercase text-white/60 bg-white/[0.12] rounded-full px-3 py-1.5 backdrop-blur-sm">
                          ENDOS
                        </span>
                        <h3 className="font-serif text-2xl md:text-3xl text-white mt-3 leading-tight">{proc.name}</h3>
                      </div>
                      <p className="text-white/95 text-mx leading-relaxed">{proc.shortDescription}</p>
                    </div>
                  </div>
                  <MedicalProcedureLd name={proc.name} description={proc.shortDescription} />
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

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
