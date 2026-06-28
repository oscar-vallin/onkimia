import type { StaticClinic } from '@/config/clinicConfig';
import { toSchemaOrgOpeningHours } from '@/lib/clinic-hours';
import { env } from '@/lib/env';

interface MedicalClinicJsonLdProps {
  clinic: StaticClinic;
  clinicName: string;
  url: string;
}

export function MedicalClinicJsonLd({ clinic, clinicName, url }: MedicalClinicJsonLdProps) {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'MedicalClinic',
    name: `Onkimia ${clinicName}`,
    url: `${siteUrl}${url}`,
    medicalSpecialty: 'Oncology',
  };

  if (clinic.address) {
    jsonLd.address = {
      '@type': 'PostalAddress',
      streetAddress: clinic.address.street,
      addressLocality: clinic.address.city,
      addressRegion: clinic.address.state,
      postalCode: clinic.address.postalCode,
      addressCountry: 'MX',
    };
  }

  if (clinic.geo) {
    jsonLd.geo = {
      '@type': 'GeoCoordinates',
      latitude: clinic.geo.lat,
      longitude: clinic.geo.lng,
    };
  }

  if (clinic.phone) {
    jsonLd.telephone = clinic.phone;
  }

  if (clinic.email) {
    jsonLd.email = clinic.email;
  }

  if (clinic.hours && clinic.hours.length > 0) {
    jsonLd.openingHours = toSchemaOrgOpeningHours(clinic.hours);
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
