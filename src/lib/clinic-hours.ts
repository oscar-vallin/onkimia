import type { Locale } from '@/i18n/routing';

// Matches existing schema: days/opens/closes
export interface ClinicHourRange {
  days: string;
  opens: string;
  closes: string;
}

const DAY_LABELS_ES: Record<string, string> = {
  'Mo': 'Lunes',
  'Tu': 'Martes',
  'We': 'Miércoles',
  'Th': 'Jueves',
  'Fr': 'Viernes',
  'Sa': 'Sábado',
  'Su': 'Domingo',
  'Mo-Fr': 'Lunes a Viernes',
  'Mo-Sa': 'Lunes a Sábado',
  'Mo-Su': 'Lunes a Domingo',
};

const DAY_LABELS_EN: Record<string, string> = {
  'Mo': 'Monday',
  'Tu': 'Tuesday',
  'We': 'Wednesday',
  'Th': 'Thursday',
  'Fr': 'Friday',
  'Sa': 'Saturday',
  'Su': 'Sunday',
  'Mo-Fr': 'Monday to Friday',
  'Mo-Sa': 'Monday to Saturday',
  'Mo-Su': 'Every day',
};

export function formatDayLabel(days: string, locale: Locale): string {
  const labels = locale === 'en' ? DAY_LABELS_EN : DAY_LABELS_ES;
  return labels[days] || days;
}

export function formatHourRange(opens: string, closes: string): string {
  return `${opens} – ${closes}`;
}

/**
 * Convierte horarios al formato openingHours de schema.org.
 * Formato: "Mo-Fr 09:00-18:00"
 */
export function toSchemaOrgOpeningHours(hours: ClinicHourRange[]): string[] {
  return hours.map((h) => `${h.days} ${h.opens}-${h.closes}`);
}
