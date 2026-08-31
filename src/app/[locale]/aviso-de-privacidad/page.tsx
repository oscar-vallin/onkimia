import { setRequestLocale, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { sanityFetch } from '@/sanity/lib/fetch';
import { PRIVACY_POLICY_QUERY } from '@/sanity/queries';
import { PortableTextContent } from '@/components/ui/PortableTextContent';
import type { Locale } from '@/i18n/routing';
import type { Metadata } from 'next';
import type { PrivacyPolicy } from '@/sanity/types';
import { buildMetadata } from '@/lib/seo/metadata';
import { BreadcrumbListJsonLd } from '@/components/seo/JsonLd';
import { ROUTES } from '@/config/routes';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return buildMetadata({
    title: locale === 'en' ? 'Privacy Notice' : 'Aviso de Privacidad',
    description:
      locale === 'en'
        ? 'Privacy Notice of Onkimia in accordance with LFPDPPP.'
        : 'Aviso de Privacidad de Onkimia en cumplimiento con la LFPDPPP.',
    locale: locale as Locale,
    pathname: '/aviso-de-privacidad',
    noIndex: true,
  });
}

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('privacy');

  const policy = await sanityFetch<PrivacyPolicy | null>({
    query: PRIVACY_POLICY_QUERY,
    tags: ['privacyPolicy'],
  });

  if (!policy) {
    notFound();
  }

  const title = locale === 'en' ? policy.title.en : policy.title.es;
  const introduction = locale === 'en' ? policy.introduction?.en : policy.introduction?.es;

  const formattedDate = new Date(policy.lastUpdated).toLocaleDateString(
    locale === 'en' ? 'en-US' : 'es-MX',
    { year: 'numeric', month: 'long', day: 'numeric' }
  );

  return (
    <main className="min-h-screen bg-white">
      <BreadcrumbListJsonLd
        locale={locale}
        items={[
          { href: ROUTES.home, name: locale === 'en' ? 'Home' : 'Inicio' },
          { href: ROUTES.privacy, name: title },
        ]}
      />
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-10 border-b border-line pb-8">
          <h1 className="font-serif text-3xl text-ink sm:text-4xl">{title}</h1>
          <p className="mt-3 text-sm text-gray-soft">{t('lastUpdated', { date: formattedDate })}</p>
          {introduction && (
            <p className="mt-6 leading-relaxed text-gray-warm">{introduction}</p>
          )}
        </header>

        <div className="space-y-10 text-gray-warm">
          {policy.content.map((section, index) => {
            const heading = locale === 'en' ? section.heading.en : section.heading.es;
            const body = locale === 'en' ? section.bodyEn : section.bodyEs;

            return (
              <section key={index}>
                <h2 className="mb-4 font-serif text-xl text-ink leading-tight">
                  {heading}
                </h2>
                <PortableTextContent value={body} />
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
