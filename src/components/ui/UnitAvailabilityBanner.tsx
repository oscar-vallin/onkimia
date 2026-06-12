'use client';

import { useTranslations } from 'next-intl';
import { useClinic } from '@/lib/clinic-context';
import type { ClinicSlug } from '@/lib/clinic-context';

interface UnitAvailabilityBannerProps {
  availableIn: ClinicSlug[];
  messageKey: string;
}

export function UnitAvailabilityBanner({
  availableIn,
  messageKey,
}: UnitAvailabilityBannerProps) {
  const { clinic, isInitialized } = useClinic();
  const t = useTranslations();

  if (!isInitialized) return null;
  if (!clinic) return null;
  if (availableIn.includes(clinic)) return null;

  return (
    <div
      role="status"
      className="bg-teal/10 border-y border-teal/20 text-teal"
    >
      <div className="container-onkimia py-3 text-sm text-center">
        {t(messageKey)}
      </div>
    </div>
  );
}
