/**
 * Smart routing for the WhatsApp button.
 *
 * Rules (Functional Annex, Section 2):
 *  - onkimia-doctors → whatsappCommercial (global, B2B commercial)
 *  - endos           → location's whatsappEndos (falls back to the main whatsapp)
 *  - cuidare         → location's whatsappCuidare (falls back to the main whatsapp)
 *  - other sections  → location's main whatsapp
 *
 * Location fallback: if no clinic is selected in the cookie,
 * use the one flagged as isPrimary (Guadalajara).
 */

import type { StaticClinic } from '@/config/clinicConfig';
import { WHATSAPP_DOCTORS } from '@/config/whatsappNumbers';

export type Section =
  | 'home'
  | 'about'
  | 'services'
  | 'endos'
  | 'cuidare'
  | 'onkimia-doctors'
  | 'contact'
  | 'jobs'
  | 'clinic-page';

interface GetWhatsAppNumberOptions {
  section: Section;
  clinic: StaticClinic | null;
  clinics: StaticClinic[];
}

export function getWhatsAppNumber({
  section,
  clinic,
  clinics,
}: GetWhatsAppNumberOptions): string | null {
  // Onkimia Doctors always uses the global commercial number
  if (section === 'onkimia-doctors') {
    return WHATSAPP_DOCTORS;
  }

  // Fallback: selected clinic → primary → first
  const effectiveClinic =
    clinic || clinics.find((c) => c.isPrimary) || clinics[0] || null;

  if (!effectiveClinic) return null;

  switch (section) {
    case 'endos':
      return effectiveClinic.whatsappEndos || effectiveClinic.whatsapp || null;
    case 'cuidare':
      return effectiveClinic.whatsappCuidare || effectiveClinic.whatsapp || null;
    default:
      return effectiveClinic.whatsapp || null;
  }
}

export function buildWhatsAppUrl(number: string, message?: string): string {
  const base = `https://wa.me/${number}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}