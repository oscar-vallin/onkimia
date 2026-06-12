'use client';

import { Clock } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { Locale } from '@/i18n/routing';
import { formatDayLabel, formatHourRange } from '@/lib/clinic-hours';
import type { ClinicHours as ClinicHoursType } from '@/sanity/types';

interface ClinicHoursProps {
  hours: ClinicHoursType[];
  locale: Locale;
}

export function ClinicHours({ hours, locale }: ClinicHoursProps) {
  const t = useTranslations('clinicPage.hours');

  if (!hours || hours.length === 0) return null;

  return (
    <div className="bg-white border border-line rounded-2xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-teal/10 text-teal flex items-center justify-center">
          <Clock className="w-5 h-5" aria-hidden="true" />
        </div>
        <h2 className="text-xl md:text-2xl">{t('title')}</h2>
      </div>

      <ul className="space-y-3">
        {hours.map((hour, idx) => (
          <li
            key={`${hour.days}-${idx}`}
            className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-3 border-b border-line last:border-0 last:pb-0"
          >
            <span className="text-ink font-medium">
              {formatDayLabel(hour.days, locale)}
            </span>
            <span className="text-gray-warm font-mono text-sm">
              {formatHourRange(hour.opens, hour.closes)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
