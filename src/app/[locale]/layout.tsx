import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { hasLocale } from 'next-intl';
import { fraunces, dmSans, sourceCodePro } from '@/app/fonts';
import { routing } from '@/i18n/routing';
import { ClinicProvider } from '@/lib/clinic-context';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { WhatsAppButton } from '@/components/layout/WhatsAppButton';
import { MedicalOrganizationJsonLd } from '@/components/seo/JsonLd';
import { WelcomeModalProvider } from '@/components/providers/WelcomeModalProvider';
import { ScrollToTop } from '@/components/layout/ScrollToTop';
import { CLINICS } from '@/config/clinicConfig';
import type { Locale } from '@/i18n/routing';
import './globals.css';

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

  return (
    <html
      lang={locale}
      className={`${sourceCodePro.variable} ${fraunces.variable} ${dmSans.variable}`}
      data-scroll-behavior="smooth"
    >
      <head>
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <MedicalOrganizationJsonLd clinics={CLINICS} />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-medium"
        >
          Saltar al contenido principal
        </a>
        <NextIntlClientProvider>
          <ScrollToTop />
          <ClinicProvider>
            <Header />
            <main id="main-content" className="flex-1">{children}</main>
            <Footer locale={locale as 'es' | 'en'} />
            <WhatsAppButton />
            <WelcomeModalProvider locale={locale as Locale} />
          </ClinicProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
