import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { sanityFetch } from '@/sanity/lib/fetch';
import { CLINICS_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/queries';
import { getLocalized } from '@/sanity/lib/localization';
import type { Clinic, SiteSettings } from '@/sanity/types';
import type { Locale } from '@/i18n/routing';
import { MapPin, MessageCircle, Phone, Mail } from 'lucide-react';
import { ContactForm } from '@/components/forms/ContactForm';
import { GoogleMapsEmbed } from '@/components/ui/GoogleMapsEmbed';
import { PageHero } from '@/components/sections/PageHero';
import { urlFor } from '@/sanity/image';
import { buildMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'contact.metadata' });
  return buildMetadata({ title: t('title'), description: t('description'), locale, pathname: '/contacto' });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [clinics, settings, t] = await Promise.all([
    sanityFetch<Clinic[]>({ query: CLINICS_QUERY, tags: ['clinic'] }),
    sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
    getTranslations('contact'),
  ]);

  const primaryClinic = clinics?.find((c) => c.isPrimary) ?? clinics?.[0];
  const waNumber = (settings.whatsappCommercial ?? '').replace(/\D/g, '');
  const waHref = waNumber
    ? `https://wa.me/${waNumber}?text=${encodeURIComponent(t('section.whatsappDesc'))}`
    : '#';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: t('metadata.title'),
    description: t('metadata.description'),
    ...(primaryClinic?.email && { email: primaryClinic.email }),
    ...(primaryClinic?.phone && { telephone: primaryClinic.phone }),
  };

  return (
    <>
      {/* ─── HERO ─── */}
      <PageHero
        imageSrc={(() => { const img = settings?.contactHeroImage ?? settings?.homeHeroImage; return img ? urlFor(img).width(1920).quality(82).format('webp').url() : undefined; })()}
        blurDataURL={(settings?.contactHeroImage ?? settings?.homeHeroImage)?.asset?.metadata?.lqip ?? undefined}
        extraDim
        eyebrow={t('section.eyebrow')}
        title={t('hero.title')}
        description={t('hero.description')}
      />

      {/* ════════════════════════════════════════
          CONTACT — form + info
      ════════════════════════════════════════ */}
      <section id="contact-form" className="bg-cream py-20 md:py-28">
        <div className="container-onkimia w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-start">

            {/* ─── Left: info ─── */}
            <div className="lg:pt-4">
              <p className="text-xs tracking-[0.25em] uppercase text-gray-warm font-medium mb-6">
                {t('section.eyebrow')}
              </p>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-ink leading-tight mb-7">
                {t('section.headlinePart1')}{' '}
                <em className="not-italic italic text-teal">{t('section.headlinePart2')}</em>
              </h1>
              <p className="text-gray-warm text-lg leading-relaxed max-w-md mb-12">
                {t('section.description')}
              </p>

              {/* Contact methods — divider list */}
              <ul className="divide-y divide-line">
                {/* WhatsApp */}
                <li className="py-5 first:pt-0">
                  <a
                    href={waHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-4 group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center flex-shrink-0 group-hover:bg-teal/20 transition-colors">
                      <MessageCircle className="w-5 h-5 text-teal" aria-hidden="true"/>
                    </div>
                    <div>
                      <p className="font-medium text-ink text-sm group-hover:text-teal transition-colors">{t('section.whatsappLabel')}</p>
                      <p className="text-gray-warm text-sm">{t('section.whatsappDesc')}</p>
                    </div>
                  </a>
                </li>

                {/* Phone */}
                {primaryClinic?.phone && (
                  <li className="py-5">
                    <a
                      href={`tel:${primaryClinic.phone.replace(/\s/g, '')}`}
                      className="flex items-center gap-4 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center flex-shrink-0 group-hover:bg-teal/20 transition-colors">
                        <Phone className="w-5 h-5 text-teal" aria-hidden="true"/>
                      </div>
                      <div>
                        <p className="font-medium text-ink text-sm group-hover:text-teal transition-colors">{t('section.phoneLabel')}</p>
                        <p className="text-gray-warm text-sm">{t('section.phoneDesc')}</p>
                      </div>
                    </a>
                  </li>
                )}

                {/* Email */}
                {primaryClinic?.email && (
                  <li className="py-5 last:pb-0">
                    <a
                      href={`mailto:${primaryClinic.email}`}
                      className="flex items-center gap-4 group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center flex-shrink-0 group-hover:bg-teal/20 transition-colors">
                        <Mail className="w-5 h-5 text-teal" aria-hidden="true"/>
                      </div>
                      <div>
                        <p className="font-medium text-ink text-sm group-hover:text-teal transition-colors">{t('section.emailLabel')}</p>
                        <p className="text-gray-warm text-sm">{t('section.emailDesc')}</p>
                      </div>
                    </a>
                  </li>
                )}
              </ul>
            </div>

            {/* ─── Right: form card ─── */}
            <div className="bg-white rounded-3xl shadow-sm border border-line/50 p-8 md:p-10">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SEDES
      ════════════════════════════════════════ */}
      {clinics && clinics.length > 0 && (
        <section className="bg-white py-20 md:py-28">
          <div className="container-onkimia">
            <div className="text-center mb-14">
              <p className="text-xs tracking-[0.25em] uppercase text-gray-warm font-medium mb-5">
                {t('sedes.eyebrow')}
              </p>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink leading-tight">
                {t('sedes.headlinePart1')}{' '}
                <em className="not-italic italic text-teal">{t('sedes.headlinePart2')}</em>
              </h2>
            </div>

            <div className={`grid gap-4 max-w-4xl mx-auto ${
              clinics.length === 1 ? 'grid-cols-1 max-w-md' :
              clinics.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
              'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}>
              {clinics.map((clinic) => {
                const name = getLocalized(clinic.name, locale);
                const mapsQuery = [
                  clinic.address.street,
                  clinic.address.neighborhood,
                  clinic.address.postalCode,
                  clinic.address.city,
                  clinic.address.state,
                  'México',
                ].filter(Boolean).join(', ');

                return (
                  <a
                    key={clinic._id}
                    href={`https://maps.google.com/?q=${encodeURIComponent(mapsQuery)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group border border-line rounded-2xl p-7 flex flex-col gap-5 hover:border-teal/30 hover:shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal"
                  >
                    {/* Icon */}
                    <div className="w-11 h-11 rounded-xl bg-teal/10 flex items-center justify-center flex-shrink-0 group-hover:bg-teal/20 transition-colors">
                      <MapPin className="w-5 h-5 text-teal" aria-hidden="true"/>
                    </div>

                    {/* Info */}
                    <div>
                      <h3 className="font-semibold text-ink text-lg mb-2 group-hover:text-teal transition-colors">{name}</h3>
                      <p className="text-gray-warm text-sm leading-relaxed">
                        {clinic.address.street}
                        {clinic.address.neighborhood ? `, ${clinic.address.neighborhood}` : ''}
                        {clinic.address.postalCode ? `, ${clinic.address.postalCode}` : ''}
                      </p>
                      <p className="text-gray-warm text-sm">
                        {clinic.address.city}, {clinic.address.state}
                      </p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ─── MAPA ─── */}
      {primaryClinic?.geo && (
        <section className="bg-white pb-20 md:pb-28">
          <div className="container-onkimia">
            <GoogleMapsEmbed
              lat={primaryClinic.geo.lat}
              lng={primaryClinic.geo.lng}
              title={t('map.title')}
            />
          </div>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
