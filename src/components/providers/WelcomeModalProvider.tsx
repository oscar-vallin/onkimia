'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { hasVisited } from '@/lib/cookies-client';
import type { Locale } from '@/i18n/routing';

// Dynamic import sin SSR — no impacta bundle inicial ni LCP
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
    // Excluir Sanity Studio
    if (pathname.startsWith('/studio') || pathname.startsWith('/en/studio')) return;

    // Verificar cookie solo en cliente, después del mount
    if (hasVisited()) return;

    // Delay para no interrumpir LCP inicial
    const timer = setTimeout(() => setShouldShow(true), 800);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!shouldShow) return null;

  return <WelcomeModal currentLocale={locale} />;
}
