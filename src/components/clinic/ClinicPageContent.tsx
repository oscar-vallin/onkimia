'use client';

import { MapPin, Phone, Mail, MessageCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
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
      <section className="relative bg-brand-900 py-20 md:py-28 -mt-16 md:-mt-20 pt-32 md:pt-40 overflow-hidden">
        <DecorativeBubbles variant="sides" opacity={0.5} />
        <div className="relative container-onkimia text-center">
          <p
            className="text-sm md:text-base mb-4 tracking-widest uppercase"
            style={{ color: 'rgba(255,255,255,0.7)' }}
          >
            {clinic.isPrimary ? t('hero.primaryTagline') : t('hero.secondaryTagline')}
          </p>
          <h1
            className="text-4xl md:text-5xl lg:text-6xl mb-6"
            style={{ color: '#ffffff' }}
          >
            Onkimia {clinicName}
          </h1>
          {description && (
            <p
              className="text-lg md:text-xl max-w-3xl mx-auto text-pretty"
              style={{ color: 'rgba(255,255,255,0.85)' }}
            >
              {description}
            </p>
          )}
        </div>
      </section>

      {/* ─── INFO RÁPIDA ─── */}
      <section className="container-onkimia py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {clinic.address && (
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center mb-4">
                <MapPin className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-2">
                {t('info.addressLabel')}
              </h3>
              <p className="text-neutral-800">
                {clinic.address.street}
                <br />
                {clinic.address.city}, {clinic.address.state}
                {clinic.address.postalCode ? `, ${clinic.address.postalCode}` : ''}
              </p>
            </div>
          )}

          {primaryPhone && (
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center mb-4">
                <Phone className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-2">
                {t('info.phoneLabel')}
              </h3>
              <a
                href={`tel:${phoneForTel}`}
                className="text-neutral-800 hover:text-accent-600 transition-colors"
              >
                {primaryPhone}
              </a>
            </div>
          )}

          {(clinic.email || whatsappUrl) && (
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center mb-4">
                {clinic.email ? (
                  <Mail className="w-6 h-6" aria-hidden="true" />
                ) : (
                  <MessageCircle className="w-6 h-6" aria-hidden="true" />
                )}
              </div>
              {clinic.email ? (
                <>
                  <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-2">
                    {t('info.emailLabel')}
                  </h3>
                  <a
                    href={`mailto:${clinic.email}`}
                    className="text-neutral-800 hover:text-accent-600 transition-colors break-all"
                  >
                    {clinic.email}
                  </a>
                </>
              ) : (
                <>
                  <h3 className="text-sm font-medium text-neutral-500 uppercase tracking-wider mb-2">
                    WhatsApp
                  </h3>
                  <a
                    href={whatsappUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-800 hover:text-accent-600 transition-colors"
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
        <section className="bg-neutral-50 py-16 md:py-24">
          <div className="container-onkimia">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl mb-4">{t('services.title')}</h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                {t('services.subtitle', { clinic: clinicName })}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="bg-white border border-neutral-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
                >
                  <h3 className="text-lg font-medium mb-2">
                    {getLocalized(service.name, locale)}
                  </h3>
                  {service.description && (
                    <p className="text-sm text-neutral-600">
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
        <section className="bg-neutral-50 py-16 md:py-24">
          <div className="container-onkimia">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl mb-4">{t('doctors.title')}</h2>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                {t('doctors.subtitle', { clinic: clinicName })}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {doctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className="bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  {doctor.photo && (
                    <div className="relative aspect-[4/3] bg-neutral-100">
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
                    <h3 className="text-lg font-medium mb-1">{doctor.fullName}</h3>
                    {doctor.specialty && (
                      <p className="text-sm text-accent-600 font-medium">
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
        <div className="bg-brand-900 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
          <DecorativeBubbles variant="scattered" opacity={0.4} />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl mb-4" style={{ color: '#ffffff' }}>
              {t('cta.title')}
            </h2>
            <p className="mb-8 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.85)' }}>
              {t('cta.subtitle', { clinic: clinicName })}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-accent-500 hover:bg-accent-600 text-white font-medium px-8 py-3 rounded-lg transition-colors inline-flex items-center justify-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" aria-hidden="true" />
                  {t('cta.whatsapp')}
                </a>
              )}
              {primaryPhone && (
                <a
                  href={`tel:${phoneForTel}`}
                  className="bg-white text-brand-900 hover:bg-neutral-100 font-medium px-8 py-3 rounded-lg transition-colors inline-flex items-center justify-center gap-2"
                >
                  <Phone className="w-5 h-5" aria-hidden="true" />
                  {t('cta.call')}
                </a>
              )}
              <Link
                href="/contacto"
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
