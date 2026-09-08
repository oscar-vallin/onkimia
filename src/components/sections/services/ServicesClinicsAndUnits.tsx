'use client';

import { useState, type ReactNode } from 'react';
import type { SanityImageWithLQIP } from '@/sanity/types';
import { SanityImage as Image } from '@/components/ui/SanityImage';
import { urlFor } from '@/sanity/image';
import { ServicePillBadge } from '@/components/ui/ServicePillBadge';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { ServiceUnitCard } from '@/components/ui/ServiceUnitCard';
import { SPECIALTY_ICONS, TREATMENT_ICONS, SUPPORT_ICONS } from '@/data/serviceIcons';

export interface ClinicItem {
  slug: string;
  name: string;
  icon: ReactNode;
}

export interface ComplementaryUnit {
  name: string;
  description: string;
  link: string;
}

type TabId = 'specialties' | 'units' | 'treatments' | 'support';

interface ServicesClinicsAndUnitsProps {
  clinics: ClinicItem[];
  clinicsEyebrow: string;
  clinicsTitle: string;
  clinicsDescription: string;
  clinicsStat?: string;
  clinicsSectionImage?: SanityImageWithLQIP;
  clinicsImageAlt: string;
  tabLabels: Record<TabId, string>;
  specialties: string[];
  treatments: string[];
  support: string[];
  complementaryUnits: ComplementaryUnit[];
  complementaryEyebrow: string;
  complementaryTitle: string;
  complementaryDescription: string;
  complementaryUnitLabel: string;
  complementaryLinkLabel: string;
  complementaryStat: string;
}

export function ServicesClinicsAndUnits({
  clinics,
  clinicsEyebrow,
  clinicsTitle,
  clinicsDescription,
  clinicsStat,
  clinicsSectionImage,
  clinicsImageAlt,
  tabLabels,
  specialties,
  treatments,
  support,
  complementaryUnits,
  complementaryEyebrow,
  complementaryTitle,
  complementaryDescription,
  complementaryUnitLabel,
  complementaryLinkLabel,
  complementaryStat,
}: ServicesClinicsAndUnitsProps) {
  const [activeTab, setActiveTab] = useState<TabId>('specialties');

  const pillItems: Record<TabId, ClinicItem[]> = {
    specialties: specialties.map((name, i) => ({ slug: `specialty-${i}`, name, icon: SPECIALTY_ICONS[i] })),
    units: clinics,
    treatments: treatments.map((name, i) => ({ slug: `treatment-${i}`, name, icon: TREATMENT_ICONS[i] })),
    support: support.map((name, i) => ({ slug: `support-${i}`, name, icon: SUPPORT_ICONS[i] })),
  };

  return (
    <>
      {/* Clinics specialty grid */}
      <section className="bg-gray-50 py-20 md:py-28">
        <div className="container-onkimia">
          <SectionHeader
            eyebrow={clinicsEyebrow}
            title={clinicsTitle}
            titleClassName="lg:text-6xl mb-6"
            intro={clinicsDescription}
            introClassName="text-lg md:text-lg max-w-2xl mx-auto mb-0"
            className="max-w-none md:mb-18"
          >
            {clinicsStat && (
              <div className="flex items-center justify-center gap-2 mt-5">
                <span className="w-2 h-2 rounded-full bg-secondary/30 flex-shrink-0" aria-hidden="true" />
                <span className="text-sm text-secondary">{clinicsStat}</span>
              </div>
            )}
          </SectionHeader>

          {/* Category toggle */}
          <div className="flex flex-wrap justify-center gap-3 mb-10 md:mb-14">
            {(Object.keys(tabLabels) as TabId[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setActiveTab(id)}
                aria-pressed={activeTab === id}
                className={`cursor-pointer rounded-full px-6 py-3 text-sm font-medium transition-colors border ${
                  activeTab === id
                    ? 'bg-primary text-white border-primary'
                    : 'bg-white text-secondary border-black/[0.08] hover:border-primary/30 hover:text-primary'
                }`}
              >
                {tabLabels[id]}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {pillItems[activeTab].map(({ slug, name, icon }) => (
              <ServicePillBadge key={slug} name={name} icon={icon} />
            ))}
          </div>
        </div>
      </section>

      {/* Image break between clinics and complementary units */}
      {clinicsSectionImage?.asset && (
        <div className="bg-gray-50 pb-20 md:pb-28">
          <div className="container-onkimia">
            <div className="relative w-full aspect-[16/6] rounded-3xl overflow-hidden">
              <Image
                src={urlFor(clinicsSectionImage).width(1920).height(720).format('webp').quality(85).url()}
                alt={clinicsImageAlt}
                fill
                sizes="(max-width: 1440px) 100vw, 1440px"
                className="object-cover"
                placeholder={clinicsSectionImage?.asset?.metadata?.lqip ? 'blur' : 'empty'}
                blurDataURL={clinicsSectionImage?.asset?.metadata?.lqip ?? undefined}
              />
            </div>
          </div>
        </div>
      )}

      {/* Complementary units */}
      <section className="bg-primary py-20 md:py-28">
        <div className="container-onkimia">
          <p className="text-xs tracking-[0.25em] uppercase text-white/50 font-medium mb-5">
            {complementaryEyebrow}
          </p>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-4">
                {complementaryTitle}
              </h2>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white/30 flex-shrink-0" aria-hidden="true" />
                <span className="text-white/50 text-sm">{complementaryStat}</span>
              </div>
            </div>
            <p className="text-white/60 text-base leading-relaxed max-w-md md:text-right">
              {complementaryDescription}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {complementaryUnits.map((unit) => (
              <ServiceUnitCard
                key={unit.name}
                name={unit.name}
                description={unit.description}
                href={unit.link}
                unitLabel={complementaryUnitLabel}
                linkLabel={complementaryLinkLabel}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
