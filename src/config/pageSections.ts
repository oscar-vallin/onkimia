import type { SectionKey } from '@/components/sections/registry';
import type { ClinicSlug } from '@/config/clinicConfig';

/**
 * Page composition — which sections each page renders, in order.
 *
 * This is the ONLY file to touch when a clinic's page needs to change:
 *  - Reuse any home section by adding its key ('doctors', 'howItWorks', …).
 *  - 'clinicInfo' (address / phone / WhatsApp / email) is OPTIONAL per clinic:
 *    include it only where it makes sense — its data comes from clinicConfig.
 *  - Opening a new clinic = one entry here + its data in clinicConfig.
 */

export const HOME_SECTIONS: readonly SectionKey[] = [
  'hero',
  'howItWorks',
  'pillars',
  'studies',
  'services',
  'doctors',
  'wellness',
  'insurances',
  'appointment',
];

export const CLINIC_PAGE_SECTIONS: Record<ClinicSlug, readonly SectionKey[]> = {
  // Guadalajara is served by the home page — no dedicated page today.
  guadalajara: [],
  // Mirrors the home page, plus the clinic-specific contact block after the hero.
  // 'clinicServices' / 'clinicCta' remain available in the registry if a brief
  // variant is ever preferred over the full 'services' / 'appointment' sections.
  colima: [
    'hero',
    'howItWorks',
    'pillars',
    'studies',
    'services',
    'doctors',
    'wellness',
    'insurances',
    'appointment',
    'clinicInfo',
  ],
};
