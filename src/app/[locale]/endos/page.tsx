import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { sanityFetch } from '@/sanity/lib/fetch';
import { SITE_SETTINGS_QUERY, FAQS_BY_PAGE_QUERY, ENDOS_PROCEDURES_QUERY, ENDOS_PAGE_QUERY } from '@/sanity/queries';
import { urlFor } from '@/sanity/image';
import { getLocalized } from '@/sanity/lib/localization';
import type { SiteSettings, FAQ, Procedure, EndosPage } from '@/sanity/types';
import type { Locale } from '@/i18n/routing';
import Image from 'next/image';
import { PageHero } from '@/components/sections/PageHero';
import { Microscope, Search, Activity, FlaskConical, ScanLine, ShieldCheck, UserCheck, Cpu, Zap, Clock, Heart, Check } from 'lucide-react';
import { BookingButton } from '@/components/ui/BookingButton';
import { UnitAvailabilityBanner } from '@/components/ui/UnitAvailabilityBanner';
import { FAQPageLd, MedicalProcedureLd } from '@/components/seo/JsonLd';
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

  const [settings, endosPageData, faqs, procedures, t] = await Promise.all([
    sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
    sanityFetch<EndosPage | null>({ query: ENDOS_PAGE_QUERY, tags: ['endosPage'] }),
    sanityFetch<FAQ[]>({ query: FAQS_BY_PAGE_QUERY, params: { page: 'endos' }, tags: ['faq'] }),
    sanityFetch<Procedure[]>({ query: ENDOS_PROCEDURES_QUERY, params: { locale }, tags: ['procedure'] }),
    getTranslations('endos'),
  ]);

  const heroImage = settings.endosHeroImage ?? settings.homeHeroImage;
  const heroLqip = settings.endosHeroImage?.asset?.metadata?.lqip ?? settings.homeHeroImage?.asset?.metadata?.lqip;

  return (
    <>
      {/* ─── HERO ─── */}
      <PageHero
        imageSrc={heroImage ? urlFor(heroImage).width(1920).height(1080).format('webp').quality(82).url() : undefined}
        blurDataURL={heroLqip ?? undefined}
        mobileObjectPosition="object-[center_25%]"
        imagePosition="md:object-[68%_45%]"
        eyebrow={t('hero.eyebrow')}
        title={`${t('hero.headlinePart1')} *${t('hero.headlinePart2')}*`}
        description={t('hero.description')}
      >
        <p className="text-white/45 text-sm italic mb-8">{t('hero.quote')}</p>
        <BookingButton section="endos" variant="primary" customLabel={t('cta.button')} customMessage={t('cta.message')} />
      </PageHero>

      {/* ─── AVAILABILITY BANNER ─── */}
      <UnitAvailabilityBanner availableIn={['guadalajara']} messageKey="endos.availability.banner" />

      {/* ════════════════════════════════════════
          DIAGNÓSTICO AMBULATORIO — icon cards
      ════════════════════════════════════════ */}
      <section className="bg-cream py-20 md:py-28" aria-labelledby="endos-procedures-title">
        <div className="container-onkimia">
          <p className="text-xs tracking-[0.25em] uppercase text-gray-warm font-medium mb-5">
            {t('procedures.eyebrow')}
          </p>
          <h2 id="endos-procedures-title" className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink leading-tight mb-5">
            {t('procedures.headlinePart1')}{' '}
            <em className="not-italic italic text-teal">{t('procedures.headlinePart2')}</em>
          </h2>
          <p className="text-gray-warm text-lg leading-relaxed max-w-2xl mb-14">
            {t('procedures.intro')}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {PROCEDURE_ITEM_KEYS.map((key, i) => {
              const Icon = PROCEDURE_ICONS[i];
              return (
                <article key={key} className="bg-white border border-line rounded-2xl p-7 hover:border-teal/25 hover:shadow-sm transition-all duration-200">
                  <div className="w-11 h-11 rounded-xl bg-teal/10 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-teal" aria-hidden="true"/>
                  </div>
                  <h3 className="font-serif text-xl text-ink mb-2">{t(`procedures.items.${key}.name`)}</h3>
                  <p className="text-sm text-gray-warm leading-relaxed">{t(`procedures.items.${key}.shortDescription`)}</p>
                </article>
              );
            })}
          </div>

          {/* Others */}
          <div className="bg-white border border-line rounded-2xl p-7 flex items-start gap-4">
            <ShieldCheck className="w-5 h-5 text-teal flex-shrink-0 mt-0.5" aria-hidden="true"/>
            <div>
              <h3 className="font-serif text-xl text-ink mb-1">{t('procedures.others')}</h3>
              <p className="text-sm text-gray-warm leading-relaxed">{t('procedures.othersDescription')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          PROCEDURES WITH IMAGES — Sanity photos (prominent, not a carousel)
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
                      <div className="absolute inset-0 bg-ink/10" />
                    )}
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 45%, rgba(0,0,0,0.82) 100%)' }}
                      aria-hidden="true"
                    />
                    <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-8">
                      <div>
                        <span className="inline-block text-[10px] tracking-[0.2em] uppercase text-white/60 bg-white/[0.12] rounded-full px-3 py-1.5 backdrop-blur-sm">
                          ENDOS
                        </span>
                        <h3 className="font-serif text-2xl md:text-3xl text-white mt-3 leading-tight">{proc.name}</h3>
                      </div>
                      <p className="text-white/70 text-sm leading-relaxed">{proc.shortDescription}</p>
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
      <section className="bg-ink py-20 md:py-28" aria-labelledby="endos-benefits-title">
        <div className="container-onkimia">
          <p className="text-xs tracking-[0.25em] uppercase text-teal-soft font-medium mb-5">
            {t('benefits.eyebrow')}
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <h2 id="endos-benefits-title" className="font-serif text-4xl md:text-5xl text-white leading-tight">
              {t('benefits.title')}
            </h2>
            <p className="text-white/50 text-base leading-relaxed max-w-sm md:text-right">
              {t('benefits.description')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {BENEFIT_KEYS.map(({ key, icon: Icon }) => (
              <div key={key} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-6 flex flex-col gap-4 hover:bg-white/[0.07] transition-colors">
                <div className="w-10 h-10 rounded-xl bg-teal/15 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-teal-soft" aria-hidden="true"/>
                </div>
                <p className="text-sm text-white/70 leading-snug">{t(`benefits.items.${key}`)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SEGURIDAD Y CONFIANZA
      ════════════════════════════════════════ */}
      <section className="bg-ink py-20 md:py-28 border-t border-white/[0.06]" aria-labelledby="endos-safety-title">
        <div className="container-onkimia">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-stretch">
            {/* Left */}
            <div>
              <p className="text-xs tracking-[0.25em] uppercase text-teal-soft font-medium mb-5">
                {t('safety.eyebrow')}
              </p>
              <h2 id="endos-safety-title" className="font-serif text-4xl md:text-5xl text-white leading-tight mb-8">
                {t('safety.title')}
              </h2>
              <p className="text-white/60 text-base leading-relaxed mb-10">
                {t('safety.description')}
              </p>
              <ul className="space-y-7 mb-10">
                {SAFETY_CHECKLIST.map((key) => (
                  <li key={key} className="flex gap-4">
                    <div className="w-6 h-6 rounded-full bg-teal/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-teal-soft" aria-hidden="true"/>
                    </div>
                    <div>
                      <p className="font-medium text-white text-sm mb-1">{t(`safety.checklistItems.${key}.title`)}</p>
                      <p className="text-white/50 text-sm leading-relaxed">{t(`safety.checklistItems.${key}.description`)}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <blockquote className="border-l-2 border-teal/40 pl-5">
                <p className="text-white/45 text-sm italic leading-relaxed">{t('safety.quote')}</p>
              </blockquote>
            </div>

            {/* Right — image */}
            <div className="relative h-full min-h-[420px] lg:min-h-0">
              <div className="relative w-full h-full rounded-3xl overflow-hidden bg-white/[0.03]">
                {endosPageData?.safetyImage?.asset ? (
                  <>
                    {/* Background fill — blurred cover, prevents jarring empty letterbox
                        space around the contained image while keeping the premium dark feel */}
                    <Image
                      src={urlFor(endosPageData.safetyImage).width(900).format('webp').quality(85).url()}
                      alt=""
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover scale-110 blur-xl opacity-30"
                      aria-hidden="true"
                    />
                    {/* Foreground — object-contain shows the full image, never cropped.
                        Centers automatically within the box (matches text column height
                        via h-full on the parent), no further alignment markup needed. */}
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
                <div className="w-8 h-8 rounded-full bg-teal/15 flex items-center justify-center flex-shrink-0">
                  <ShieldCheck className="w-4 h-4 text-teal" aria-hidden="true"/>
                </div>
                <div>
                  <p className="font-medium text-ink text-sm leading-none mb-1">{t('safety.badge')}</p>
                  <p className="text-gray-warm text-xs">{t('safety.badgeSub')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          PREGUNTAS FRECUENTES
      ════════════════════════════════════════ */}
      {faqs.length > 0 && (
        <section className="bg-cream py-20 md:py-28" aria-labelledby="endos-faq-title">
          <div className="container-onkimia">
            <p className="text-xs tracking-[0.25em] uppercase text-gray-warm font-medium mb-5 text-center">
              {t('faq.eyebrow')}
            </p>
            <h2 id="endos-faq-title" className="font-serif text-4xl md:text-5xl text-ink text-center mb-14">
              {t('faq.title')}
            </h2>
            <div className="max-w-3xl mx-auto space-y-3">
              {faqs.map((faq) => (
                <EndosFAQItem
                  key={faq._id}
                  question={getLocalized(faq.question, locale)}
                  answer={getLocalized(faq.answer, locale)}
                />
              ))}
            </div>
            <FAQPageLd faqs={faqs.map((faq) => ({
              question: getLocalized(faq.question, locale),
              answer: getLocalized(faq.answer, locale),
            }))}/>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════
          CTA
      ════════════════════════════════════════ */}
      <section className="bg-white py-20 md:py-28" aria-labelledby="endos-cta-title">
        <div className="container-onkimia max-w-3xl mx-auto text-center">
          <p className="text-xs tracking-[0.25em] uppercase text-gray-warm font-medium mb-6">
            {t('cta.eyebrow')}
          </p>
          <h2 id="endos-cta-title" className="font-serif text-4xl md:text-5xl text-ink leading-tight mb-6">
            {t('cta.title')}
          </h2>
          <p className="text-gray-warm text-lg leading-relaxed mb-10 max-w-xl mx-auto">
            {t('cta.description')}
          </p>
          <BookingButton section="endos" variant="primary" customLabel={t('cta.button')} customMessage={t('cta.message')} />
        </div>
      </section>
    </>
  );
}

/* ─── FAQ accordion (native HTML details/summary, no JS state) ─── */
function EndosFAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group bg-white border border-line rounded-2xl overflow-hidden open:border-l-4 open:border-l-teal">
      <summary className="flex items-center justify-between gap-4 px-7 py-5 cursor-pointer list-none select-none">
        <span className="font-medium text-ink text-sm leading-snug">{question}</span>
        <span className="w-7 h-7 rounded-full border border-line flex items-center justify-center flex-shrink-0 group-open:bg-teal group-open:border-teal transition-colors">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-gray-warm group-open:text-white group-open:rotate-45 transition-all" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M6 1v10M1 6h10"/>
          </svg>
        </span>
      </summary>
      <div className="px-7 pb-6 text-gray-warm text-sm leading-relaxed border-t border-line pt-4">
        {answer}
      </div>
    </details>
  );
}
