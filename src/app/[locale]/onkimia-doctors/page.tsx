import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Locale } from '@/i18n/routing';
import { PageHero } from '@/components/sections/PageHero';
import { Activity, HeartPulse, Flower2, Mic2, Target, Users, Sparkles, Shield, Check, ExternalLink } from 'lucide-react';
import { buildMetadata } from '@/lib/seo/metadata';
import { MedicalBusinessLd, BreadcrumbListJsonLd } from '@/components/seo/JsonLd';
import { HeroPreload } from '@/components/seo/HeroPreload';
import { ROUTES } from '@/config/routes';
import { SectionHeader } from '@/components/ui/SectionHeader';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'doctors.metadata' });
  return buildMetadata({ title: t('title'), description: t('description'), locale, pathname: '/onkimia-doctors' });
}

/* ─── Static data ─── */
const IMPROVEMENT_KEYS = ['waitTime', 'fragmentation', 'coordinated', 'adherence', 'emotional'] as const;

const UNITS = [
  { key: 'endos', icon: Activity, items: ['diagnosis', 'ambulatory', 'lessFriction'], whatsappKey: 'endos', href: null },
  { key: 'cuidare', icon: HeartPulse, items: ['painManagement', 'dayClinic', 'palliativeCare'], whatsappKey: 'cuidare', href: null },
   { key: 'vocalia', icon: Mic2, items: ['expertise', 'technology', 'personalizedCare'], whatsappKey: null, href: 'https://www.otorrinolaringologos.com/' },
  { key: 'wellness', icon: Flower2, items: ['psychology', 'nutrition', 'physiotherapy', 'boutique'], whatsappKey: null, href: null },
] as const;

const BENEFIT_CATEGORIES = [
  { key: 'clinicalFocus', icon: Target, items: ['lessBurden', 'structuredProcesses', 'readyInfrastructure'] },
  { key: 'multidisciplinary', icon: Users, items: ['interaction', 'integralCases', 'continuity'] },
  { key: 'premiumExperience', icon: Sparkles, items: ['privateBooths', 'specializedUnits', 'humanSupport'] },
  { key: 'institutionalBacking', icon: Shield, items: ['solidBrand', 'standardized', 'compliance'] },
] as const;

function buildWhatsApp(number: string | undefined | null, message: string) {
  const n = (number ?? '').replace(/\D/g, '');
  if (!n) return '#';
  return `https://wa.me/${n}?text=${encodeURIComponent(message)}`;
}

export default async function OnkimiaDoctorsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, tNav] = await Promise.all([
    getTranslations('doctors'),
    getTranslations({ locale, namespace: 'navigation' }),
  ]);

  const waCommercial = '5213320331257';
  const waEndos = waCommercial;
  const waCuidare = waCommercial;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://onkimia.com';

  return (
    <>
      <HeroPreload name="doctors" />
      <BreadcrumbListJsonLd
        locale={locale}
        items={[
          { href: ROUTES.home, name: tNav('home') },
          { href: ROUTES.doctors, name: tNav('doctors') },
        ]}
      />
    <div className="doctors-page">
      {/* ─── HERO ─── */}
      <PageHero
        imageSrc="/heros/doctors-hero-desktop.webp"
        mobileImageSrc="/heros/doctors-hero-mobile.webp"
        imagePosition="md:object-[65%_0%]"
        imageClassName="md:mt-20"
        eyebrow={t('hero.eyebrow')}
        title={`${t('hero.headlinePart1')}\n*${t('hero.headlinePart2')}*`}
        accent="doctors"
        emphasisClassName="text-doctors-blue"
        description={t('hero.description')}
        topSlot={
          <div className="hidden sm:flex items-center gap-2 border border-white/25 rounded-full px-4 py-2 bg-white/[0.06] backdrop-blur-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-white/70" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span className="text-[11px] tracking-[0.18em] uppercase text-white/80">{t('hero.badge')}</span>
          </div>
        }
        solidLeftBand
      >
        {/* <p className="hidden md:block text-white/75 text-base md:text-lg italic mb-6 max-w-xl leading-relaxed">
          {t('hero.quote')}
        </p> */}
        {/* <div className="flex flex-wrap gap-3 mt-6 md:mt-0">
          <a
            href={buildWhatsApp(waCommercial, t('cta.message'))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white text-ink font-medium px-7 py-3.5 rounded-xl hover:bg-white/90 transition-colors text-sm"
          >
            {t('hero.joinButton')}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>
          </a>
          <a
            href="#beneficios"
            className="inline-flex items-center gap-2 border border-white/30 text-white font-medium px-7 py-3.5 rounded-xl hover:bg-white/10 transition-colors text-sm"
          >
            {t('hero.benefitsButton')}
          </a>
        </div> */}
      </PageHero>

      {/* ════════════════════════════════════════
          ¿QUÉ ES ONKIMIA DOCTORS?
      ════════════════════════════════════════ */}
      <section className="bg-white py-20 md:py-28" aria-labelledby="od-about-title">
        <div className="container-onkimia">
          <div className="max-w-3xl mx-auto">
            <div>
              <SectionHeader
                align="left"
                id="od-about-title"
                eyebrow="ONKIMIA DOCTORS"
                title={t('about.title')}
                titleClassName="mb-6"
                intro={t('about.description')}
                introClassName="text-lg md:text-lg mb-10"
              />
              <p className="text-base text-secondary leading-relaxed mb-10">
                {t('about.ecosystemDescription')}
              </p>
              {/* Patient quality bullets */}
              <div className="bg-gray-50 rounded-2xl p-7 border border-doctors-blue/20">
                <h3 className="text-base font-semibold text-primary mb-5">
                  {t('improvements.question')}
                </h3>
                <p className="text-xs tracking-[0.2em] uppercase text-secondary font-medium mb-5">
                  {t('improvements.title')}
                </p>
                <ul className="space-y-3">
                  {IMPROVEMENT_KEYS.map((key) => (
                    <li key={key} className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-doctors-blue flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-white" aria-hidden="true"/>
                      </span>
                      <span className="text-sm text-primary leading-snug">{t(`improvements.items.${key}`)}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-secondary italic leading-relaxed mt-5 pt-5 border-t border-black/[0.07]">
                  {t('improvements.subtitle')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ════════════════════════════════════════
          UNIDADES DE NEGOCIO
      ════════════════════════════════════════ */}
      <section className="bg-doctors-ink py-20 md:py-28" aria-labelledby="od-units-title">
        <div className="container-onkimia">
          <SectionHeader
            align="left"
            theme="dark"
            id="od-units-title"
            eyebrow="ECOSISTEMA"
            eyebrowClassName="text-doctors-blue"
            title={t('units.title')}
            titleClassName="mb-14"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {UNITS.map(({ key, icon: Icon, items, whatsappKey, href }) => {
              const waNumber = whatsappKey === 'endos' ? waEndos : whatsappKey === 'cuidare' ? waCuidare : null;
              const waMessage = key !== 'wellness' && key !== 'vocalia' ? t(`units.${key}.tourMessage`) : t('cta.message');
              const waHref = waNumber ? buildWhatsApp(waNumber, waMessage) : buildWhatsApp(waCommercial, waMessage);
              const showWhatsApp = whatsappKey !== null;

              return (
                <article key={key} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-7 flex flex-col gap-6 hover:bg-white/[0.07] transition-colors">
                  <div className="w-11 h-11 rounded-xl bg-doctors-blue/15 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-doctors-blue" aria-hidden="true"/>
                  </div>
                  <h3 className="font-serif text-2xl text-white">{t(`units.${key}.name`)}</h3>
                  <ul className="space-y-2.5 flex-1">
                    {items.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-doctors-blue flex-shrink-0 mt-2" aria-hidden="true"/>
                        <span className="text-sm text-white/65 leading-snug">{t(`units.${key}.items.${item}`)}</span>
                      </li>
                    ))}
                  </ul>
                  {showWhatsApp && (
                    <a
                      href={waHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] text-white text-sm font-medium px-5 py-3 rounded-xl transition-colors"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" className="text-doctors-blue" aria-hidden="true">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      {t('units.scheduleTour')}
                    </a>
                  )}
                  {href && (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 bg-white/[0.08] hover:bg-white/[0.14] border border-white/[0.12] text-white text-sm font-medium px-5 py-3 rounded-xl transition-colors"
                    >
                      <ExternalLink className="w-4 h-4 text-doctors-blue" aria-hidden="true" />
                      {t('units.vocalia.visitWebsite')}
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          BENEFICIOS PARA EL MÉDICO
      ════════════════════════════════════════ */}
      <section id="beneficios" className="bg-gray-50 py-20 md:py-28" aria-labelledby="od-benefits-title">
        <div className="container-onkimia">
          <div className="grid gap-12 md:gap-16">
            <div>
              <SectionHeader
                align="left"
                id="od-benefits-title"
                eyebrow="MÉDICOS"
                title={t('benefits.title')}
                titleClassName="mb-12"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BENEFIT_CATEGORIES.map(({ key, icon: Icon, items }) => (
                  <article key={key} className="bg-white border border-black/[0.07] rounded-2xl p-6">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-10 h-10 rounded-xl bg-doctors-blue flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-white" aria-hidden="true"/>
                      </div>
                      <h3 className="font-serif text-base text-primary leading-snug">{t(`benefits.categories.${key}.title`)}</h3>
                    </div>
                    <ul className="space-y-2">
                      {items.map((item) => (
                        <li key={item} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-doctors-blue flex-shrink-0 mt-0.5" aria-hidden="true"/>
                          <span className="text-xs text-secondary leading-snug">{t(`benefits.categories.${key}.items.${item}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          CTA — Únete ahora
      ════════════════════════════════════════ */}
      <section className="bg-doctors-ink py-20 md:py-28" aria-labelledby="od-cta-title">
        <div className="container-onkimia max-w-3xl mx-auto text-center">
          <SectionHeader
            theme="dark"
            id="od-cta-title"
            eyebrow="ONKIMIA DOCTORS"
            eyebrowClassName="text-doctors-blue"
            title={t('cta.title')}
            titleClassName="lg:text-6xl"
            intro={t('cta.description')}
            introClassName="text-lg md:text-lg text-white/60 mb-10 max-w-xl mx-auto"
            className="mb-0 md:mb-0"
          />
          <a
            href={buildWhatsApp(waCommercial, t('cta.message'))}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-white text-doctors-ink font-medium px-9 py-4 rounded-xl hover:bg-white/90 transition-colors text-base"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-doctors-blue" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            {t('cta.button')}
          </a>
        </div>
      </section>

      {/* ─── JSON-LD ─── */}
      <MedicalBusinessLd
        name="Onkimia Doctors"
        description={t('about.description')}
        url={`${siteUrl}/${locale === 'es' ? '' : 'en/'}onkimia-doctors`}
      />
    </div>
    </>
  );
}
