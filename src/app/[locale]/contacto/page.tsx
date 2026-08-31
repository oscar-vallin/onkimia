import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { getLocalized } from '@/lib/localization';
import { CLINICS, getMapsUrl } from '@/config/clinicConfig';
import type { Locale } from '@/i18n/routing';
import { MapPin } from 'lucide-react';
import { ContactForm } from '@/components/forms/ContactForm';
import { ContactInfo } from '@/components/sections/ContactInfo';
import { ClinicMap } from '@/components/sections/ClinicMap';
import { PageHero } from '@/components/sections/PageHero';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { buildMetadata } from '@/lib/seo/metadata';
import { HeroPreload } from '@/components/seo/HeroPreload';
import { BreadcrumbListJsonLd } from '@/components/seo/JsonLd';
import { ROUTES } from '@/config/routes';

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

  const [t, tNav] = await Promise.all([
    getTranslations('contact'),
    getTranslations({ locale, namespace: 'navigation' }),
  ]);

  const primaryClinic = CLINICS.find((c) => c.isPrimary) ?? CLINICS[0];

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
      <HeroPreload name="contact" />
      {/* ─── HERO ─── */}
      <PageHero
        imageSrc="/heros/contact-hero-desktop.webp"
        mobileImageSrc="/heros/contact-hero-mobile.webp"
        extraDim
        eyebrow={t('section.eyebrow')}
        title={t('hero.title')}
        description={t('hero.description')}
        solidLeftBand
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
              {/* h2: el h1 de esta página lo renderiza el PageHero ("Contacto") */}
              <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-ink leading-tight mb-7">
                {t('section.headlinePart1')}{' '}
                <em className="not-italic italic text-teal">{t('section.headlinePart2')}</em>
              </h2>
              <p className="text-gray-warm text-lg leading-relaxed max-w-md mb-12">
                {t('section.description')}
              </p>

              {/* Contact methods — follows the globally selected clinic
                  (useClinic()); switching CLINICS in the Header updates
                  this list immediately. See src/config/clinicConfig.ts. */}
              <ContactInfo />
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
      {CLINICS && CLINICS.length > 0 && (
        <section className="bg-white py-20 md:py-28">
          <div className="container-onkimia">
            <SectionHeader
              eyebrow={t('sedes.eyebrow')}
              eyebrowClassName="text-gray-warm"
              title={<>{t('sedes.headlinePart1')}{' '}<em className="not-italic italic text-teal">{t('sedes.headlinePart2')}</em></>}
              titleClassName="lg:text-6xl text-ink mb-0"
              className="mb-14 md:mb-14 max-w-none"
            />

            <div className={`grid gap-4 max-w-4xl mx-auto ${
              CLINICS.length === 1 ? 'grid-cols-1 max-w-md' :
              CLINICS.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
              'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
            }`}>
              {CLINICS.map((clinic) => {
                const name = getLocalized(clinic.name, locale);

                return (
                  <a
                    key={clinic._id}
                    href={getMapsUrl(clinic)}
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
      {/* Sigue la clínica seleccionada en el Header, igual que ContactInfo. */}
      <section className="bg-white pb-20 md:pb-28">
        <div className="container-onkimia">
          <ClinicMap title={t('map.title')} />
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BreadcrumbListJsonLd
        locale={locale}
        items={[
          { href: ROUTES.home, name: tNav('home') },
          { href: ROUTES.contact, name: tNav('contact') },
        ]}
      />
    </>
  );
}
