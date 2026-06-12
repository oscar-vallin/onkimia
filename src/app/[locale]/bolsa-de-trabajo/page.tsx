import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { sanityFetch } from '@/sanity/lib/fetch';
import { ACTIVE_JOB_POSTINGS_QUERY } from '@/sanity/queries';
import type { JobPosting } from '@/sanity/types';
import type { Locale } from '@/i18n/routing';
import { JobApplicationForm } from '@/components/forms/JobApplicationForm';
import { DecorativeBubbles } from '@/components/ui/DecorativeBubbles';
import { buildMetadata } from '@/lib/seo/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'jobBoard.metadata' });

  return buildMetadata({ title: t('title'), description: t('description'), locale, pathname: '/bolsa-de-trabajo' });
}

export default async function JobBoardPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [vacancies, t] = await Promise.all([
    sanityFetch<JobPosting[]>({
      query: ACTIVE_JOB_POSTINGS_QUERY,
      tags: ['jobPosting'],
    }),
    getTranslations('jobBoard'),
  ]);

  return (
    <>
      {/* ─── HERO ─── */}
      <section className="relative bg-ink py-20 md:py-28 -mt-16 md:-mt-20 pt-32 md:pt-40 overflow-hidden">
        <DecorativeBubbles variant="sides" opacity={0.6} />
        <div className="relative container-onkimia text-center">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-4">
            {t('hero.title')}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto text-pretty text-white/85">
            {t('hero.description')}
          </p>
        </div>
      </section>

      {/* ─── FORMULARIO ─── */}
      <section className="container-onkimia py-16 md:py-24">
        <div className="max-w-3xl mx-auto bg-white border border-line rounded-2xl p-6 md:p-10 shadow-sm">
          <h2 className="font-serif text-2xl md:text-3xl mb-2">{t('form.title')}</h2>
          <p className="text-gray-warm mb-8">{t('form.subtitle')}</p>
          <JobApplicationForm vacancies={vacancies} />
        </div>
      </section>
    </>
  );
}
