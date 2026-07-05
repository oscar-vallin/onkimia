import { getTranslations } from 'next-intl/server';
import { Phone, MessageCircle, Mail, MapPin, ArrowRight } from 'lucide-react';
import { clinicConfig, type ClinicSlug } from '@/config/clinicConfig';
import { parseEmphasis } from '@/lib/parseEmphasis';
import type { SectionProps } from '@/components/sections/registry';

/**
 * Location details block: address, phone, WhatsApp (if any), email.
 * Fully driven by clinicConfig — reusable for every current and future clinic.
 * Optional per clinic: include the 'clinicInfo' key in its section list or not.
 */
export async function ClinicInfoSection({ clinic = 'guadalajara', first }: SectionProps) {
  const t = await getTranslations('clinicSections');
  const data = clinicConfig[clinic as ClinicSlug] ?? clinicConfig.guadalajara;
  const city = data.city;

  // Solo dueña del h1 cuando abre la página (sin hero antes); a mitad de
  // página el h1 ya lo puso el hero y aquí debe ser h2 (un h1 por página).
  const Heading = first ? 'h1' : 'h2';

  return (
    <section className={`bg-white py-20 md:py-28 ${first ? 'mt-18' : ''}`}>
      <div className="container-onkimia">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">

          {/* Left: headline */}
          <div>
            <p className="text-xs font-medium tracking-widest uppercase text-primary/50 mb-4">
              {t('contact.eyebrow')}
            </p>
            <Heading className="font-serif text-4xl md:text-5xl text-primary leading-tight mb-6">
              {parseEmphasis(t('contact.title', { city }))}
            </Heading>
            <p className="text-secondary text-lg leading-relaxed">
              {t('contact.description', { city })}
            </p>

            <a
              href={data.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-8 text-primary hover:text-primary/70 font-medium transition-colors"
            >
              <MapPin className="w-4 h-4" aria-hidden="true" />
              {t('contact.viewMap')}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </a>
          </div>

          {/* Right: contact details */}
          <div className="space-y-6">
            {/* Address */}
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-black/[0.07]">
              <div className="w-10 h-10 rounded-xl bg-primary/[0.07] flex items-center justify-center flex-shrink-0">
                <MapPin className="w-5 h-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-medium tracking-wider uppercase text-secondary mb-1">
                  {t('contact.addressLabel')}
                </p>
                <p className="text-primary font-medium">{data.address}</p>
              </div>
            </div>

            {/* Phone */}
            <a
              href={data.phoneHref}
              className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-black/[0.07] hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/[0.07] flex items-center justify-center flex-shrink-0">
                <Phone className="w-5 h-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-medium tracking-wider uppercase text-secondary mb-1">
                  {t('contact.phoneLabel')}
                </p>
                <p className="text-primary font-medium group-hover:text-primary/70 transition-colors">
                  {data.phone}
                </p>
              </div>
            </a>

            {/* WhatsApp — only clinics that have one */}
            {data.whatsappHref && (
              <a
                href={data.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-black/[0.07] hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/[0.07] flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="w-5 h-5 text-primary" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs font-medium tracking-wider uppercase text-secondary mb-1">
                    WhatsApp
                  </p>
                  <p className="text-primary font-medium group-hover:text-primary/70 transition-colors">
                    {data.whatsapp}
                  </p>
                </div>
              </a>
            )}

            {/* Email */}
            <a
              href={`mailto:${data.email}`}
              className="flex items-start gap-4 p-6 rounded-2xl bg-white border border-black/[0.07] hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300 group"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/[0.07] flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-primary" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs font-medium tracking-wider uppercase text-secondary mb-1">
                  {t('contact.emailLabel')}
                </p>
                <p className="text-primary font-medium group-hover:text-primary/70 transition-colors">
                  {data.email}
                </p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
