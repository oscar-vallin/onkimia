'use client';

import { GoogleMapsEmbed } from '@/components/ui/GoogleMapsEmbed';
import { useClinic } from '@/lib/clinic-context';
import { CLINICS, getMapsQuery } from '@/config/clinicConfig';

interface ClinicMapProps {
  /** Título accesible del iframe, ya traducido (viene del server). */
  title: string;
  className?: string;
}

/**
 * Mapa que sigue la clínica globalmente seleccionada, igual que ContactInfo
 * y el Footer. Antes la página de contacto lo fijaba a la sede primaria, así
 * que quien elegía Colima en el Header veía sus datos de contacto con un mapa
 * de Guadalajara debajo.
 *
 * En SSR y primera hidratación `clinic` es null por diseño (leer la cookie en
 * el servidor forzaría SSR dinámico en todo el sitio — ver clinic-context.tsx),
 * así que el primer render cae en la sede primaria y cambia tras hidratar.
 * Mismo comportamiento que ContactInfo, sin mismatch.
 */
export function ClinicMap({ title, className }: ClinicMapProps) {
  const { clinic } = useClinic();

  const selected =
    CLINICS.find((c) => c.slug === clinic) ??
    CLINICS.find((c) => c.isPrimary) ??
    CLINICS[0];

  if (!selected) return null;

  return (
    <GoogleMapsEmbed
      query={getMapsQuery(selected)}
      lat={selected.geo?.lat}
      lng={selected.geo?.lng}
      title={title}
      className={className}
    />
  );
}
