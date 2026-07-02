import type { Doctor } from '@/sanity/types';
import type { StaticClinic } from '@/config/clinicConfig';
import { CLINICS } from '@/config/clinicConfig';

interface MedicalOrganizationProps {
  clinics: StaticClinic[];
}

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://onkimia.com').replace(/\/$/, '');

export function MedicalOrganizationJsonLd({ clinics }: MedicalOrganizationProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    name: 'Onkimia',
    url: SITE_URL,
    // Mismo wordmark que usa el Header (oscuro sobre transparente — se ve
    // bien en blanco, como pide Google). El archivo actual mide 200×67 px;
    // Google recomienda ≥112 px de alto: al tener un export más grande,
    // basta reemplazar el .webp sin tocar este código.
    logo: `${SITE_URL}/logos/onkimia-logo.webp`,
    sameAs: [
      'https://www.instagram.com/onkimia/',
      'https://www.facebook.com/people/Onkimia/100083572627923/',
    ],
    medicalSpecialty: 'Oncology',
    location: clinics.map((clinic) => ({
      '@type': 'MedicalClinic',
      name: clinic.name.es,
      telephone: clinic.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: [clinic.address.street, clinic.address.neighborhood]
          .filter(Boolean)
          .join(', '),
        addressLocality: clinic.address.city,
        addressRegion: clinic.address.state,
        postalCode: clinic.address.postalCode,
        addressCountry: clinic.address.country ?? 'MX',
      },
      ...(clinic.geo && {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: clinic.geo.lat,
          longitude: clinic.geo.lng,
        },
      }),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface PhysicianProps {
  doctor: Doctor;
}

export function PhysicianJsonLd({ doctor }: PhysicianProps) {
  const validSlugs = (doctor.clinics ?? []).filter((c): c is string => typeof c === 'string');
  const effectiveSlugs = validSlugs.length > 0 ? validSlugs : CLINICS.map((c) => c.slug);

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: doctor.fullName,
    medicalSpecialty: doctor.medicalSpecialties ?? [],
    worksFor: effectiveSlugs.map((slug) => {
      const clinic = CLINICS.find((c) => c.slug === slug);
      return { '@type': 'MedicalOrganization', name: clinic?.name.es ?? slug };
    }),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface MedicalBusinessLdProps {
  name: string;
  description: string;
  url: string;
}

export function MedicalBusinessLd({
  name,
  description,
  url,
}: MedicalBusinessLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name,
    description,
    url,
    medicalSpecialty: 'Oncology',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface MedicalProcedureLdProps {
  name: string;
  description?: string;
  bodyLocation?: string;
}

export function MedicalProcedureLd({
  name,
  description,
  bodyLocation,
}: MedicalProcedureLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'MedicalProcedure',
    name,
    ...(description && { description }),
    ...(bodyLocation && { bodyLocation }),
    procedureType: 'https://schema.org/DiagnosticProcedure',
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface FAQPageLdProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
}

export function FAQPageLd({ faqs }: FAQPageLdProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqPageJsonLd({ items }: { items: FaqItem[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
