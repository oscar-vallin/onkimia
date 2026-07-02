import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import { clinicConfig, type ClinicSlug } from '@/config/clinicConfig';
import type { SectionProps } from '@/components/sections/registry';

// TODO: service pills are hardcoded (same offering at both clinics today).
// Move to i18n once a clinic's lineup diverges from Guadalajara's.
const SERVICE_PILLS = [
  'Oncología',
  'Endoscopía diagnóstica',
  'Cuidados paliativos',
  'Hematología',
  'Bienestar integral',
];

/** Brief services mention with pills + link to /servicios. */
export async function ClinicServicesSection({ clinic = 'guadalajara' }: SectionProps) {
  const t = await getTranslations('clinicSections');
  const data = clinicConfig[clinic as ClinicSlug] ?? clinicConfig.guadalajara;

  return (
    <section className="bg-primary py-16 md:py-20">
      <div className="container-onkimia text-center max-w-3xl mx-auto">
        <p className="text-xs font-medium tracking-widest uppercase text-white/50 mb-4">
          {t('services.eyebrow')}
        </p>
        <h2 className="font-serif text-3xl md:text-4xl text-white mb-6">
          {t('services.title')}
        </h2>
        <p className="text-white/70 text-lg leading-relaxed mb-4">
          {t('services.description', { city: data.city })}
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-8 mb-10">
          {SERVICE_PILLS.map((service) => (
            <span
              key={service}
              className="text-sm text-white/80 border border-white/[0.08] rounded-full px-4 py-2"
            >
              {service}
            </span>
          ))}
        </div>
        <Link
          href="/servicios"
          className="inline-flex items-center gap-2 bg-white text-primary hover:bg-white/90 font-medium px-8 py-4 rounded-full transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
        >
          {t('services.cta')}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
