/**
 * Smart routing del botón WhatsApp.
 *
 * Reglas (Anexo Funcional Sección 2):
 *  - onkimia-doctors → whatsappCommercial (global, comercial B2B)
 *  - endos           → whatsappEndos de la sede (fallback whatsapp principal)
 *  - cuidare         → whatsappCuidare de la sede (fallback whatsapp principal)
 *  - otras secciones → whatsapp principal de la sede
 *
 * Fallback de sede: si no hay clínica seleccionada en cookie,
 * usa la marcada como isPrimary (Guadalajara).
 */

import type { Clinic, SiteSettings } from '@/sanity/types';

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
  clinic: Clinic | null;
  clinics: Clinic[];
  settings: SiteSettings;
}

export function getWhatsAppNumber({
  section,
  clinic,
  clinics,
  settings,
}: GetWhatsAppNumberOptions): string | null {
  // Onkimia Doctors siempre usa comercial global
  if (section === 'onkimia-doctors') {
    return settings.whatsappCommercial || null;
  }

  // Fallback: clínica seleccionada → principal → primera
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