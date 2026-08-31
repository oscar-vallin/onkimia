import { Suspense } from 'react';
import type { Locale } from '@/i18n/routing';
import type { ClinicSlug } from '@/config/clinicConfig';

import { HeroSection } from '@/components/sections/home/HeroSection';
import { HowItWorksSection } from '@/components/sections/home/HowItWorksSection';
import { PillarsSection } from '@/components/sections/home/PillarsSection';
import { StudiesSection } from '@/components/sections/home/StudiesSection';
import { ServicesSection } from '@/components/sections/home/ServicesSection';
import { WellnessSection } from '@/components/sections/home/WellnessSection';
import { AppointmentCtaSection } from '@/components/sections/home/AppointmentCtaSection';
import { DoctorsSection } from '@/components/sections/home/DoctorsSection';
import { InsurancesSection } from '@/components/sections/home/InsurancesSection';
import { DoctorsGridSkeleton, InsurancesSkeleton } from '@/components/sections/home/skeletons';
import { ClinicInfoSection } from '@/components/sections/clinic/ClinicInfoSection';
import { ClinicServicesSection } from '@/components/sections/clinic/ClinicServicesSection';
import { ClinicCtaSection } from '@/components/sections/clinic/ClinicCtaSection';

/**
 * Uniform props every section receives from the renderer.
 * Sections use what they need and ignore the rest.
 */
export interface SectionProps {
  locale: Locale;
  /** Set on clinic pages — sections like clinicInfo read their data from clinicConfig[clinic]. */
  clinic?: ClinicSlug;
  /** True for the first section of the page (e.g. to compensate the fixed header when there is no hero). */
  first?: boolean;
}

/* Streamed sections keep their own Suspense boundary so the rest of the page
   flushes immediately regardless of where they are placed. */
function DoctorsStreamed({ locale }: SectionProps) {
  return (
    <Suspense fallback={<DoctorsGridSkeleton />}>
      <DoctorsSection locale={locale} />
    </Suspense>
  );
}

function InsurancesStreamed({}: SectionProps) {
  return (
    <Suspense fallback={<InsurancesSkeleton />}>
      <InsurancesSection />
    </Suspense>
  );
}

/**
 * Section registry — the single extension point for page composition.
 *
 * Open/Closed: to add a new section, create its component and add ONE entry
 * here; existing pages are untouched. To compose a page, list keys in
 * src/config/pageSections.ts — no page code changes needed.
 */
export const SECTION_REGISTRY = {
  hero:           HeroSection,
  howItWorks:     HowItWorksSection,
  pillars:        PillarsSection,
  studies:        StudiesSection,
  services:       ServicesSection,
  doctors:        DoctorsStreamed,
  wellness:       WellnessSection,
  insurances:     InsurancesStreamed,
  appointment:    AppointmentCtaSection,
  clinicInfo:     ClinicInfoSection,
  clinicServices: ClinicServicesSection,
  clinicCta:      ClinicCtaSection,
} as const;

export type SectionKey = keyof typeof SECTION_REGISTRY;

interface PageSectionsProps {
  sections: readonly SectionKey[];
  locale: Locale;
  clinic?: ClinicSlug;
}

/** Renders an ordered list of registered sections. */
export function PageSections({ sections, locale, clinic }: PageSectionsProps) {
  return (
    <>
      {sections.map((key, i) => {
        const Section = SECTION_REGISTRY[key];
        return <Section key={key} locale={locale} clinic={clinic} first={i === 0} />;
      })}
    </>
  );
}
