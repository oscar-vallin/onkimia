import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { sanityFetch } from '@/sanity/lib/fetch';
import { SITE_SETTINGS_QUERY } from '@/sanity/queries';
import { urlFor } from '@/sanity/image';
import { buildMetadata } from '@/lib/seo/metadata';
import type { SiteSettings } from '@/sanity/types';
import type { Locale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { Phone, MessageCircle, Mail, MapPin, ArrowRight } from 'lucide-react';
import { SetClinicOnMount } from '@/components/clinic/SetClinicOnMount';
import { PageHero } from '@/components/sections/PageHero';
import { clinicConfig } from '@/config/clinicConfig';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'colima' });
  return buildMetadata({
    title: t('hero.title').replace(/\*/g, ''),
    description: t('hero.description'),
    locale,
    pathname: '/colima',
  });
}

// TODO: service pills are hardcoded (same offering at both clinics today).
// Move to i18n once Colima's lineup diverges from Guadalajara's.
const SERVICE_PILLS = [
  'Oncología',
  'Endoscopía diagnóstica',
  'Cuidados paliativos',
  'Hematología',
  'Bienestar integral',
];

export default async function ColimaPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, settings] = await Promise.all([
    getTranslations('colima'),
    sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
  ]);

  const clinic = clinicConfig.colima;
  const heroImage = settings.cuidareHeroImage ?? settings.aboutHeroImage ?? settings.homeHeroImage;

  return (
    <>
      {/* Auto-syncs the global clinic context to 'colima' on load, so the
          Header selector, Footer, and Contact page all reflect this clinic
          without the user manually switching. */}
      <SetClinicOnMount clinic="colima" />

      {/* ─── HERO ─── */}
      <PageHero
        imageSrc={heroImage ? urlFor(heroImage).width(1920).quality(82).format('webp').url() : undefined}
        blurDataURL={heroImage?.asset?.metadata?.lqip ?? undefined}
        eyebrow={t('hero.eyebrow')}
        title={t('hero.title')}
        description={t('hero.description')}
        primaryCta={{ label: t('hero.cta'), href: '/contacto#contact-form' }}
      />

      {/* ─── CONTACT BLOCK ─── */}
      <section className="bg-cream py-20 md:py-28">
        <div className="container-onkimia">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

            {/* Left: headline */}
            <div>
              <p className="text-xs font-medium tracking-widest uppercase text-teal mb-4">
                {t('contact.eyebrow')}
              </p>
              <h2 className="font-serif text-4xl md:text-5xl text-ink leading-tight mb-6">
                {t('contact.title')}
              </h2>
              <p className="text-gray-warm text-lg leading-relaxed">
                {t('contact.description')}
              </p>

              <a
                href={clinic.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-8 text-teal hover:text-teal-soft font-medium transition-colors"
              >
                <MapPin className="w-4 h-4" aria-hidden="true" />
                {t('contact.viewMap')}
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>

            {/* Right: contact details */}
            <div className="space-y-6">
              {/* Address */}
              <div className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-line">
                <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-teal" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-medium tracking-wider uppercase text-gray-warm mb-1">
                    {t('contact.addressLabel')}
                  </p>
                  <p className="text-ink font-medium">{clinic.address}</p>
                </div>
              </div>

              {/* Phone */}
              <a
                href={clinic.phoneHref}
                className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-line hover:border-teal/40 hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-teal" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-medium tracking-wider uppercase text-gray-warm mb-1">
                    {t('contact.phoneLabel')}
                  </p>
                  <p className="text-ink font-medium group-hover:text-teal transition-colors">
                    {clinic.phone}
                  </p>
                </div>
              </a>

              {/* WhatsApp — Colima only */}
              {clinic.whatsappHref && (
                <a
                  href={clinic.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-line hover:border-teal/40 hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-5 h-5 text-teal" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-wider uppercase text-gray-warm mb-1">
                      WhatsApp
                    </p>
                    <p className="text-ink font-medium group-hover:text-teal transition-colors">
                      {clinic.whatsapp}
                    </p>
                  </div>
                </a>
              )}

              {/* Email */}
              <a
                href={`mailto:${clinic.email}`}
                className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-line hover:border-teal/40 hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-teal" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-medium tracking-wider uppercase text-gray-warm mb-1">
                    {t('contact.emailLabel')}
                  </p>
                  <p className="text-ink font-medium group-hover:text-teal transition-colors">
                    {clinic.email}
                  </p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SERVICES — brief mention ─── */}
      <section className="bg-ink py-16 md:py-20">
        <div className="container-onkimia text-center max-w-3xl mx-auto">
          <p className="text-xs font-medium tracking-widest uppercase text-teal-soft mb-4">
            {t('services.eyebrow')}
          </p>
          <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">
            {t('services.title')}
          </h2>
          <p className="text-white/70 text-lg leading-relaxed mb-4">
            {t('services.description')}
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8 mb-10">
            {SERVICE_PILLS.map((service) => (
              <span
                key={service}
                className="text-sm text-white/80 border border-white/[0.08] rounded-full px-4 py-2"
              >
                {service}
              </span>
            ))}
          </div>
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 bg-teal hover:bg-teal-soft text-white font-medium px-8 py-4 rounded-full transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal/30"
          >
            {t('services.cta')}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="bg-cream py-16 md:py-20">
        <div className="container-onkimia text-center max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl text-ink mb-4">
            {t('cta.title')}
          </h2>
          <p className="text-gray-warm text-lg leading-relaxed mb-8">
            {t('cta.description')}
          </p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 bg-teal hover:bg-teal-soft text-white font-medium px-8 py-4 rounded-full transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal/30"
          >
            {t('cta.button')}
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
