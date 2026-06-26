'use client';

import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { SanityImage as Image } from '@/components/ui/SanityImage';
import { Link } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';
import type { Clinic, Doctor, Service } from '@/sanity/types';
import { urlFor } from '@/sanity/image';
import { getLocalized } from '@/sanity/lib/localization';
import { GoogleMapsEmbed } from '@/components/ui/GoogleMapsEmbed';
import { ClinicHours } from '@/components/ui/ClinicHours';
import { DecorativeBubbles } from '@/components/ui/DecorativeBubbles';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

interface ClinicPageContentProps {
  clinic: Clinic;
  doctors: Doctor[];
  services: Service[];
  locale: Locale;
}

export function ClinicPageContent({
  clinic,
  doctors,
  services,
  locale,
}: ClinicPageContentProps) {
  const t = useTranslations('clinicPage');

  const clinicName = getLocalized(clinic.name, locale);
  const description = clinic.description ? clinic.description[locale] : null;

  const whatsappNumber = clinic.whatsapp ?? '';
  const whatsappUrl = whatsappNumber
    ? buildWhatsAppUrl(whatsappNumber, t('whatsapp.defaultMessage', { clinic: clinicName }))
    : null;

  const primaryPhone = clinic.phone ?? '';
  const phoneForTel = primaryPhone.replace(/\D/g, '');

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative bg-ink py-20 md:py-28 -mt-16 md:-mt-20 pt-32 md:pt-40 overflow-hidden">
        <DecorativeBubbles variant="sides" opacity={0.5} />
        <div className="relative container-onkimia text-center">
          <p className="text-sm md:text-base mb-4 tracking-widest uppercase text-white/70">
            {clinic.isPrimary ? t('hero.primaryTagline') : t('hero.secondaryTagline')}
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-6">
            Onkimia {clinicName}
          </h1>
          {description && (
            <p className="text-lg md:text-xl max-w-3xl mx-auto text-pretty text-white/85">
              {description}
            </p>
          )}
        </div>
      </section>

      {/* ─── INFO RÁPIDA ─── */}
      <section className="container-onkimia py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {clinic.address && (
            <div className="bg-white border border-line rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-teal/10 text-teal flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-medium text-gray-soft uppercase tracking-wider mb-2">
                {t('info.addressLabel')}
              </h3>
              <p className="text-ink">
                {clinic.address.street}
                <br />
                {clinic.address.city}, {clinic.address.state}
                {clinic.address.postalCode ? `, ${clinic.address.postalCode}` : ''}
              </p>
            </div>
          )}

          {primaryPhone && (
            <div className="bg-white border border-line rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-teal/10 text-teal flex items-center justify-center mb-4">
                <Phone className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-medium text-gray-soft uppercase tracking-wider mb-2">
                {t('info.phoneLabel')}
              </h3>
              <a
                href={`tel:${phoneForTel}`}
                className="text-ink hover:text-teal transition-colors"
              >
                {primaryPhone}
              </a>
            </div>
          )}

          {(clinic.email || whatsappUrl) && (
            <div className="bg-white border border-line rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-teal/10 text-teal flex items-center justify-center mb-4">
                {clinic.email ? (
                  <Mail className="w-6 h-6" aria-hidden="true" />
                ) : (
                  <MessageCircle className="w-6 h-6" aria-hidden="true" />
                )}
              </div>
              {clinic.email ? (
                <>
                  <h3 className="text-sm font-medium text-gray-soft uppercase tracking-wider mb-2">
                    {t('info.emailLabel')}
                  </h3>
                  <a
                    href={`mailto:${clinic.email}`}
                    className="text-ink hover:text-teal transition-colors break-all"
                  >
                    {clinic.email}
                  </a>
                </>
              ) : (
                <>
                  <h3 className="text-sm font-medium text-gray-soft uppercase tracking-wider mb-2">
                    WhatsApp
                  </h3>
                  <a
                    href={whatsappUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-ink hover:text-teal transition-colors"
                  >
                    {whatsappNumber}
                  </a>
                </>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ─── MAPA ─── */}
      {clinic.geo && (
        <section className="container-onkimia pb-16 md:pb-20">
          <div className="max-w-5xl mx-auto">
            <GoogleMapsEmbed
              lat={clinic.geo.lat}
              lng={clinic.geo.lng}
              title={t('map.title', { clinic: clinicName })}
            />
          </div>
        </section>
      )}

      {/* ─── HORARIOS ─── */}
      {clinic.hours && clinic.hours.length > 0 && (
        <section className="container-onkimia pb-16 md:pb-20">
          <div className="max-w-2xl mx-auto">
            <ClinicHours hours={clinic.hours} locale={locale} />
          </div>
        </section>
      )}

      {/* ─── SERVICIOS ─── */}
      {services.length > 0 && (
        <section className="bg-cream py-16 md:py-24">
          <div className="container-onkimia">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl mb-4">{t('services.title')}</h2>
              <p className="text-gray-warm max-w-2xl mx-auto">
                {t('services.subtitle', { clinic: clinicName })}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="bg-white border border-line rounded-2xl p-6 hover:shadow-md transition-shadow"
                >
                  <h3 className="font-serif text-lg mb-2">
                    {getLocalized(service.name, locale)}
                  </h3>
                  {service.description && (
                    <p className="text-sm text-gray-warm">
                      {getLocalized(service.description, locale)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── DOCTORES ─── */}
      {doctors.length > 0 && (
        <section className="bg-cream py-16 md:py-24">
          <div className="container-onkimia">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl md:text-4xl mb-4">{t('doctors.title')}</h2>
              <p className="text-gray-warm max-w-2xl mx-auto">
                {t('doctors.subtitle', { clinic: clinicName })}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {doctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className="bg-white border border-line rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  {doctor.photo && (
                    <div className="relative aspect-[4/3] bg-cream">
                      <Image
                        src={urlFor(doctor.photo).width(600).height(450).url()}
                        alt={doctor.fullName}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-serif text-lg mb-1">{doctor.fullName}</h3>
                    {doctor.specialty && (
                      <p className="text-sm text-teal font-medium">
                        {getLocalized(doctor.specialty, locale)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ─── CTA FINAL ─── */}
      <section className="container-onkimia py-16 md:py-24">
        <div className="bg-ink rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          <DecorativeBubbles variant="scattered" opacity={0.4} />
          <div className="relative">
            <h2 className="font-serif text-3xl md:text-4xl text-white mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-white/85 mb-8 max-w-xl mx-auto leading-relaxed">
              {t('cta.subtitle', { clinic: clinicName })}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-teal hover:bg-teal-soft text-white font-medium px-8 py-3 rounded-lg transition-colors inline-flex items-center justify-center gap-2"
                >
                   <svg
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-7 h-7"
                    aria-hidden="true"
                  >
                     <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  {t('cta.whatsapp')}
                </a>
              )}
              {primaryPhone && (
                <a
                  href={`tel:${phoneForTel}`}
                  className="bg-white text-ink hover:bg-cream font-medium px-8 py-3 rounded-lg transition-colors inline-flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" aria-hidden="true" />
                  {t('cta.call')}
                </a>
              )}
              <Link
                href="/contacto#contact-form"
                className="border-2 border-white/30 hover:border-white/60 text-white font-medium px-8 py-3 rounded-lg transition-colors inline-flex items-center justify-center"
              >
                {t('cta.contactForm')}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
