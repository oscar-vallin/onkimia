import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowRight } from 'lucide-react';
import type { SectionProps } from '@/components/sections/registry';

/** Closing contact CTA for clinic pages. */
export async function ClinicCtaSection({}: SectionProps) {
  const t = await getTranslations('clinicSections');

  return (
    <section className="bg-white py-16 md:py-20">
      <div className="container-onkimia text-center max-w-2xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-primary mb-4">
          {t('cta.title')}
        </h2>
        <p className="text-secondary text-lg leading-relaxed mb-8">
          {t('cta.description')}
        </p>
        <Link
          href="/contacto"
          className="inline-flex items-center gap-2 bg-primary hover:bg-primary/85 text-white font-medium px-8 py-4 rounded-full transition-all duration-300 ease-out hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/20"
        >
          {t('cta.button')}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
