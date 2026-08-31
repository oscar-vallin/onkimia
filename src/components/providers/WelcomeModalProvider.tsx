'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { hasVisited } from '@/lib/cookies-client';
import type { Locale } from '@/i18n/routing';

// Dynamic import without SSR — no impact on the initial bundle or LCP
const WelcomeModal = dynamic(
  () => import('@/components/ui/WelcomeModal').then((mod) => ({ default: mod.WelcomeModal })),
  { ssr: false }
);

interface WelcomeModalProviderProps {
  locale: Locale;
}

export function WelcomeModalProvider({ locale }: WelcomeModalProviderProps) {
  const [shouldShow, setShouldShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // Exclude Sanity Studio
    if (pathname.startsWith('/studio') || pathname.startsWith('/en/studio')) return;

    // Check the cookie client-side only, after mount
    if (hasVisited()) return;

    // Delay so it doesn't interrupt the initial LCP
    const timer = setTimeout(() => setShouldShow(true), 800);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!shouldShow) return null;

  return <WelcomeModal currentLocale={locale} />;
}
