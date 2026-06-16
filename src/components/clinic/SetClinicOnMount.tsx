'use client';

import { useEffect } from 'react';
import { useClinic } from '@/lib/clinic-context';
import type { ClinicSlug } from '@/config/clinicConfig';

interface SetClinicOnMountProps {
  clinic: ClinicSlug;
}

/**
 * Sets the global clinic context on mount — used by clinic-specific landing
 * pages (e.g. /colima) so visiting that page automatically syncs the
 * Header's clinic selector and every useClinic()-aware component (Footer,
 * Contact page, WhatsApp routing) without the user manually switching.
 */
export function SetClinicOnMount({ clinic }: SetClinicOnMountProps) {
  const { setClinic } = useClinic();

  useEffect(() => {
    setClinic(clinic);
  }, [clinic, setClinic]);

  return null;
}
