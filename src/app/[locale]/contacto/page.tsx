import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { sanityFetch } from '@/sanity/lib/fetch';
import { PRIMARY_CLINIC_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/queries';
import { getLocalized } from '@/sanity/lib/localization';
import type { Clinic, SiteSettings } from '@/sanity/types';
import type { Locale } from '@/i18n/routing';
import { MapPin, Phone, Mail } from 'lucide-react';
import { ContactForm } from '@/components/forms/ContactForm';
import { GoogleMapsEmbed } from '@/components/ui/GoogleMapsEmbed';
import { HeroSection } from '@/components/ui/HeroSection';
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

  const [clinic, settings, t] = await Promise.all([
    sanityFetch<Clinic | null>({
      query: PRIMARY_CLINIC_QUERY,
      tags: ['clinic'],
    }),
    sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, tags: ['siteSettings'] }),
    getTranslations('contact'),
  ]);

  const heroImage = settings?.homeHeroImage; // Using homeHeroImage as a fallback for now. TODO: Add contactHeroImage to siteSettings schema.

  const clinicName = clinic ? getLocalized(clinic.name, locale) : 'Onkimia';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: t('metadata.title'),
    description: t('metadata.description'),
    ...(clinic?.email && { email: clinic.email }),
    ...(clinic?.phone && { telephone: clinic.phone }),
    ...(clinic?.address && {
      address: {
        '@type': 'PostalAddress',
        streetAddress: [clinic.address.street, clinic.address.neighborhood]
          .filter(Boolean)
          .join(', '),
        addressLocality: clinic.address.city,
        addressRegion: clinic.address.state,
        ...(clinic.address.postalCode && { postalCode: clinic.address.postalCode }),
        addressCountry: clinic.address.country ?? 'MX',
      },
    }),
  };

  return (
    <>
      <HeroSection
        image={heroImage}
        title={t('hero.title')}
        description={t('hero.description')}
        align="left"
      />

      {/* ─── INFO + FORM ─── */}
      <section className="container-onkimia py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 max-w-6xl mx-auto">
          <div className="lg:col-span-2 space-y-8">
            <div>
              <h2 className="font-serif text-3xl md:text-4xl mb-6">{t('info.title')}</h2>
              <p className="text-gray-warm mb-8">{clinicName}</p>
            </div>

            {clinic?.address && (() => {
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
                  href={`https://maps.google.com/?q=${encodeURIComponent(mapsQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex gap-4 group rounded-xl p-3 -m-3 hover:bg-cream transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-teal/10 text-teal flex items-center justify-center group-hover:bg-teal/20 transition-colors">
                    <MapPin className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-soft uppercase tracking-wider mb-1">
                      {t('info.addressLabel')}
                    </h3>
                    <p className="text-ink group-hover:text-teal transition-colors">
                      {clinic.address.street}
                      {clinic.address.neighborhood ? `, ${clinic.address.neighborhood}` : ''}
                      <br />
                      {clinic.address.city}, {clinic.address.state}
                      {clinic.address.postalCode ? `, ${clinic.address.postalCode}` : ''}
                    </p>
                  </div>
                </a>
              );
            })()}

            {clinic?.phone && (
              <a
                href={`tel:${clinic.phone.replace(/\s/g, '')}`}
                className="flex gap-4 group rounded-xl p-3 -m-3 hover:bg-cream transition-colors"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-teal/10 text-teal flex items-center justify-center group-hover:bg-teal/20 transition-colors">
                  <Phone className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-soft uppercase tracking-wider mb-1">
                    {t('info.phoneLabel')}
                  </h3>
                  <p className="text-ink group-hover:text-teal transition-colors">
                    {clinic.phone}
                  </p>
                </div>
              </a>
            )}

            {clinic?.email && (
              <a
                href={`mailto:${clinic.email}`}
                className="flex gap-4 group rounded-xl p-3 -m-3 hover:bg-cream transition-colors"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-teal/10 text-teal flex items-center justify-center group-hover:bg-teal/20 transition-colors">
                  <Mail className="w-5 h-5" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-soft uppercase tracking-wider mb-1">
                    {t('info.emailLabel')}
                  </h3>
                  <p className="text-ink group-hover:text-teal transition-colors break-all">
                    {clinic.email}
                  </p>
                </div>
              </a>
            )}
          </div>

          <div className="lg:col-span-3 bg-white border border-line rounded-2xl p-6 md:p-8 shadow-sm">
            <h2 className="font-serif text-3xl md:text-4xl mb-2">{t('form.title')}</h2>
            <p className="text-gray-warm mb-8">{t('form.subtitle')}</p>
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ─── MAPA ─── */}
      {clinic?.geo && (
        <section className="container-onkimia pb-16 md:pb-24">
          <div className="max-w-6xl mx-auto">
            <GoogleMapsEmbed
              lat={clinic.geo.lat}
              lng={clinic.geo.lng}
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
