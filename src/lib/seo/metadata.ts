import type { Metadata } from 'next';
import type { Locale } from '@/i18n/routing';
import { env } from '@/lib/env';

interface BuildMetadataParams {
  title: string;
  description: string;
  locale: Locale;
  pathname: string;
  ogImage?: string;
  noIndex?: boolean;
}

/**
 * Construye metadata SEO completa para una página.
 *
 * pathname: ruta sin locale prefix (ej: '/contacto', '/bolsa-de-trabajo')
 *           Para home, usar '' (string vacío)
 */
export function buildMetadata({
  title,
  description,
  locale,
  pathname,
  ogImage,
  noIndex = false,
}: BuildMetadataParams): Metadata {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');

  // Canonical: ES sin prefijo (/), EN con /en.
  // pathname vacío ('') = home → fuerza '/' para consistencia con alternates.languages['es-MX'].
  const canonicalPath = locale === 'es' ? (pathname || '/') : `/en${pathname || ''}`;
  const canonicalUrl = `${siteUrl}${canonicalPath}`;

  const esPath = pathname || '/';
  const enPath = `/en${pathname || ''}` || '/en';

  const ogImageUrl = ogImage
    ? `${siteUrl}${ogImage}`
    : `${siteUrl}/opengraph-image`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: canonicalUrl,
      languages: {
        'es-MX': `${siteUrl}${esPath}`,
        'en-US': `${siteUrl}${enPath}`,
        'x-default': `${siteUrl}${esPath}`,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'Onkimia',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: locale === 'es' ? 'es_MX' : 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
  };
}
