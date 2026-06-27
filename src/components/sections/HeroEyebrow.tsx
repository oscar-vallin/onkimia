'use client';

import { useClinic } from '@/lib/clinic-context';

interface HeroEyebrowProps {
  /** Base label without the city suffix, e.g. "ONCOLOGÍA PREMIUM" */
  base: string;
  /** Default city shown when no clinic is selected, e.g. "CIUDAD DE MÉXICO" */
  defaultCity: string;
  /** City label shown when the user has selected Colima, e.g. "COLIMA" */
  colimaCity: string;
}

export function HeroEyebrow({ base, defaultCity, colimaCity }: HeroEyebrowProps) {
  const { clinic } = useClinic();
  const city = clinic === 'colima' ? colimaCity : defaultCity;

  return (
    <p suppressHydrationWarning className="text-[10px] md:text-xs font-sans font-medium tracking-[0.22em] uppercase text-white/65">
      <span suppressHydrationWarning>{base} · {city}</span>
    </p>
  );
}
