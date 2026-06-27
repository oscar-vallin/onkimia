import type { SiteSettings, Clinic, Doctor } from '@/sanity/types';

interface MedicalOrganizationProps {
  settings: SiteSettings;
  clinics: Clinic[];
}

export function MedicalOrganizationJsonLd({ settings, clinics }: MedicalOrganizationProps) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    name: settings.title,
    url: 'https://onkimia.com',
    logo: 'https://onkimia.com/og-image.png',
    sameAs: [
      settings.socialMedia?.instagram,
      settings.socialMedia?.facebook,
    ].filter(Boolean),
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
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: doctor.fullName,
    medicalSpecialty: doctor.medicalSpecialties ?? [],
    worksFor: (doctor.clinics ?? []).map((c) => ({
      '@type': 'MedicalOrganization',
      name: c.name.es,
    })),
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
    medicalSpecialty: 'Oncologic',
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
