'use client';

import { MessageCircle, Phone, Mail } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useClinic } from '@/lib/clinic-context';
import { getClinicConfig } from '@/config/clinicConfig';

/**
 * Contact methods list — follows the globally selected clinic (useClinic()),
 * so switching clinics in the Header updates phone/WhatsApp/email here
 * immediately, without a page reload. Visual treatment matches the divider
 * list previously hardcoded in contacto/page.tsx (kept identical on purpose).
 */
export function ContactInfo() {
  const { clinic } = useClinic();
  const config = getClinicConfig(clinic);
  const t = useTranslations('contact.section');

  return (
    <ul className="divide-y divide-line">
      {/* WhatsApp — only rendered when this clinic has one (Guadalajara: none) */}
      {config.whatsappHref && (
        <li className="py-5 first:pt-0">
          <a
            href={config.whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 group"
          >
            <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center flex-shrink-0 group-hover:bg-teal/20 transition-colors">
              <MessageCircle className="w-5 h-5 text-teal" aria-hidden="true" />
            </div>
            <div>
              <p className="font-medium text-ink text-sm group-hover:text-teal transition-colors">{t('whatsappLabel')}</p>
              <p className="text-gray-warm text-sm">{config.whatsapp}</p>
            </div>
          </a>
        </li>
      )}

      {/* Phone */}
      <li className="py-5 first:pt-0">
        <a
          href={config.phoneHref}
          className="flex items-center gap-4 group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center flex-shrink-0 group-hover:bg-teal/20 transition-colors">
            <Phone className="w-5 h-5 text-teal" aria-hidden="true" />
          </div>
          <div>
            <p className="font-medium text-ink text-sm group-hover:text-teal transition-colors">{t('phoneLabel')}</p>
            <p className="text-gray-warm text-sm">{config.phone}</p>
          </div>
        </a>
      </li>

      {/* Email */}
      <li className="py-5 last:pb-0">
        <a
          href={`mailto:${config.email}`}
          className="flex items-center gap-4 group"
        >
          <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center flex-shrink-0 group-hover:bg-teal/20 transition-colors">
            <Mail className="w-5 h-5 text-teal" aria-hidden="true" />
          </div>
          <div>
            <p className="font-medium text-ink text-sm group-hover:text-teal transition-colors">{t('emailLabel')}</p>
            <p className="text-gray-warm text-sm">{config.email}</p>
          </div>
        </a>
      </li>
    </ul>
  );
}
