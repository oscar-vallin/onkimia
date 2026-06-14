import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { Source_Code_Pro } from 'next/font/google';
import { fraunces, dmSans } from '@/app/fonts';
import { routing } from '@/i18n/routing';
import { sanityFetch } from '@/sanity/lib/fetch';
import { CLINICS_QUERY, SITE_SETTINGS_QUERY, ONKIMIA_DOCS_SETTINGS_QUERY } from '@/sanity/queries';
import { ClinicProvider } from '@/lib/clinic-context';
import { getClinicCookie } from '@/lib/cookies';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { MedicalOrganizationJsonLd } from '@/components/seo/JsonLd';
import { WelcomeModalProvider } from '@/components/providers/WelcomeModalProvider';
import type { Clinic, SiteSettings, OnkimiaDocsSettings } from '@/sanity/types';
import type { Locale } from '@/i18n/routing';
import './globals.css';

const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});


export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: { default: t('defaultTitle'), template: '%s | Onkimia' },
    description: t('defaultDescription'),
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_SITE_URL ?? 'https://onkimia.com'
    ),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  // Fetch global data (cached con ISR)
  const [settings, clinics, odSettings, initialClinic] = await Promise.all([
    sanityFetch<SiteSettings>({
      query: SITE_SETTINGS_QUERY,
      tags: ['siteSettings'],
    }),
    sanityFetch<Clinic[]>({
      query: CLINICS_QUERY,
      tags: ['clinic'],
    }),
    sanityFetch<OnkimiaDocsSettings>({
      query: ONKIMIA_DOCS_SETTINGS_QUERY,
      tags: ['onkimiaDocsSettings'],
    }),
    getClinicCookie(),
  ]);

  return (
    <html
      lang={locale}
      className={`${sourceCodePro.variable} ${fraunces.variable} ${dmSans.variable}`}
      data-scroll-behavior="smooth"
    >
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <MedicalOrganizationJsonLd settings={settings} clinics={clinics} />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-cream">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-teal focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-medium"
        >
          Saltar al contenido principal
        </a>
        <NextIntlClientProvider>
          <ClinicProvider initialClinic={initialClinic}>
            <Header settings={settings} clinics={clinics} odSettings={odSettings} />
            <main id="main-content" className="flex-1">{children}</main>
            <Footer settings={settings} clinics={clinics} locale={locale as 'es' | 'en'} />
            <WhatsAppButton settings={settings} clinics={clinics} />
            <WelcomeModalProvider locale={locale as Locale} />
          </ClinicProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}