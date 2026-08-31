import type { Doctor } from '@/sanity/types';
import type { StaticClinic } from '@/config/clinicConfig';
import { CLINICS } from '@/config/clinicConfig';
import { HOME_SERVICES_ITEMS } from '@/content/home-content';
import { ROUTES } from '@/config/routes';

interface MedicalOrganizationProps {
  clinics: StaticClinic[];
}

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://onkimia.com').replace(/\/$/, '');

// Stable identifier other JSON-LD blocks (Physician.worksFor, future
// BreadcrumbList "home" crumbs, etc.) can reference via {"@id": ...} instead
// of duplicating the organization's fields inline.
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export function MedicalOrganizationJsonLd({ clinics }: MedicalOrganizationProps) {
  // Root-level telephone/address/location.url — the fields Perplexity/
  // ChatGPT/Gemini read first when citing a business, and previously only
  // existed nested inside each location[] entry. The primary clinic
  // (Guadalajara) stands in for the organization as a whole, same as its
  // static config already treats it as the default everywhere else.
  const primary = clinics.find((c) => c.isPrimary) ?? clinics[0];
  const primaryAddress = primary
    ? [primary.address.street, primary.address.neighborhood].filter(Boolean).join(', ')
    : undefined;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'MedicalOrganization',
    '@id': ORGANIZATION_ID,
    name: 'Onkimia',
    url: SITE_URL,
    description:
      'Onkimia es una clínica oncológica privada con sede en Guadalajara y Colima, México, que ofrece quimioterapia, cirugía oncológica, cuidados paliativos, detección temprana y atención médica especializada.',
    // Same wordmark the Header uses (dark on transparent — reads well on
    // white, which is what Google asks for). The current file is 200×67px;
    // Google recommends ≥112px tall — once a larger export exists, just
    // swap the .webp without touching this code.
    logo: `${SITE_URL}/logos/onkimia-logo.webp`,
    image: `${SITE_URL}/logos/onkimia-logo.webp`,
    sameAs: [
      'https://www.instagram.com/onkimia/',
      'https://www.facebook.com/people/Onkimia/100083572627923/',
    ],
    // schema.org's own enumerated term, not the bare English word — the
    // audit's suggested `MedicalSpecialty` enum value ('Oncologic') isn't
    // itself a resolvable term; the canonical form is this URL.
    medicalSpecialty: 'https://schema.org/Oncologic',
    areaServed: [
      { '@type': 'City', name: 'Guadalajara' },
      { '@type': 'City', name: 'Colima' },
    ],
    priceRange: '$$$',
    ...(primary && {
      telephone: primary.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: primaryAddress,
        addressLocality: primary.address.city,
        addressRegion: primary.address.state,
        postalCode: primary.address.postalCode,
        addressCountry: primary.address.country ?? 'MX',
      },
    }),
    // The 7 home-page services (src/content/home-content.ts) — same data
    // shown to visitors, not duplicated/invented for this schema.
    availableService: HOME_SERVICES_ITEMS.es.map((service) => ({
      '@type': 'MedicalTherapy',
      name: service.title,
      description: service.description,
    })),
    location: clinics.map((clinic) => ({
      '@type': 'MedicalClinic',
      name: clinic.name.es,
      url: `${SITE_URL}${clinic.slug === 'colima' ? ROUTES.colima : ROUTES.home}`,
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

// Site-wide WebSite entity — separate from MedicalOrganization per
// schema.org convention (a WebSite is the site itself, not the business
// operating it). No `potentialAction: SearchAction` — the site has no
// internal search endpoint to point it at.
export function WebSiteJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'Onkimia',
    url: SITE_URL,
    inLanguage: ['es-MX', 'en-US'],
    publisher: { '@id': ORGANIZATION_ID },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export interface BreadcrumbItem {
  /** Path relative to the locale root, e.g. ROUTES.endos ('/endos'). Home should pass ROUTES.home ('/'). */
  href: string;
  name: string;
}

interface BreadcrumbListJsonLdProps {
  items: BreadcrumbItem[];
  locale: 'es' | 'en';
}

// One per page, built from that page's own breadcrumb trail (usually just
// [Home, <this page>] — the site has no deeper hierarchy).
export function BreadcrumbListJsonLd({ items, locale }: BreadcrumbListJsonLdProps) {
  const localePrefix = locale === 'en' ? '/en' : '';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${localePrefix}${item.href === '/' ? '' : item.href}`,
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
