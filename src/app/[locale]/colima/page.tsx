import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { PageTheme } from '@/components/layout/PageTheme';
import { SetClinicOnMount } from '@/components/clinic/SetClinicOnMount';
import { PageSections } from '@/components/sections/registry';
import { CLINIC_PAGE_SECTIONS } from '@/config/pageSections';
import { buildMetadata } from '@/lib/seo/metadata';
import { BreadcrumbListJsonLd } from '@/components/seo/JsonLd';
import { ROUTES } from '@/config/routes';
import type { Locale } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'colima' });
  return buildMetadata({
    title: t('hero.title').replace(/\*/g, ''),
    description: t('hero.description'),
    locale,
    pathname: '/colima',
  });
}

export default async function ColimaPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const sections = CLINIC_PAGE_SECTIONS.colima;
  // Pages without a hero need the dark header theme so the fixed
  // header doesn't float transparent over light content.
  const hasHero = sections.includes('hero');

  return (
    <>
      <BreadcrumbListJsonLd
        locale={locale}
        items={[
          { href: ROUTES.home, name: locale === 'en' ? 'Home' : 'Inicio' },
          { href: ROUTES.colima, name: 'Colima' },
        ]}
      />
      {!hasHero && <PageTheme headerTheme="dark" />}
      {/* Auto-syncs the global clinic context to 'colima' on load, so the
          Header selector, Footer, and Contact page all reflect this clinic
          without the user manually switching. */}
      <SetClinicOnMount clinic="colima" />

      <PageSections sections={sections} locale={locale} clinic="colima" />
    </>
  );
}
