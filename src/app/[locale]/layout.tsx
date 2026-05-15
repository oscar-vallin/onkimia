import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { Orbitron, Montserrat, Source_Code_Pro } from 'next/font/google';
import { routing } from '@/i18n/routing';
import { sanityFetch } from '@/sanity/lib/fetch';
import { CLINICS_QUERY, SITE_SETTINGS_QUERY } from '@/sanity/queries';
import { ClinicProvider } from '@/lib/clinic-context';
import { getClinicCookie } from '@/lib/cookies';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { MedicalOrganizationJsonLd } from '@/components/seo/JsonLd';
import type { Clinic, SiteSettings } from '@/sanity/types';
import './globals.css';

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '700', '900'],
  variable: '--font-display',
  display: 'swap',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

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
  const [settings, clinics, initialClinic] = await Promise.all([
    sanityFetch<SiteSettings>({
      query: SITE_SETTINGS_QUERY,
      tags: ['siteSettings'],
    }),
    sanityFetch<Clinic[]>({
      query: CLINICS_QUERY,
      tags: ['clinic'],
    }),
    getClinicCookie(),
  ]);

  return (
    <html
      lang={locale}
      className={`${orbitron.variable} ${montserrat.variable} ${sourceCodePro.variable}`}
      data-scroll-behavior="smooth"
    >
      <head>
        <MedicalOrganizationJsonLd settings={settings} clinics={clinics} />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col">
        <NextIntlClientProvider>
          <ClinicProvider initialClinic={initialClinic}>
            <Header settings={settings} clinics={clinics} />
            <main className="flex-1">{children}</main>
            <Footer settings={settings} clinics={clinics} locale={locale as 'es' | 'en'} />
            <WhatsAppButton settings={settings} clinics={clinics} />
          </ClinicProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}