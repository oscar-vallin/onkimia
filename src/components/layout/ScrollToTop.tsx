'use client';
import { useEffect, useRef } from 'react';
import { usePathname } from '@/i18n/navigation';

export const LOCALE_SCROLL_KEY = '__onkimia_locale_scroll';

export function ScrollToTop() {
  const pathname = usePathname();
  const prevPathname = useRef<string | null>(null);

  useEffect(() => {
    // Check for a saved scroll position from a locale switch
    const saved = sessionStorage.getItem(LOCALE_SCROLL_KEY);
    if (saved !== null) {
      sessionStorage.removeItem(LOCALE_SCROLL_KEY);
      // Double rAF ensures we run after Next.js finishes rendering
      requestAnimationFrame(() =>
        requestAnimationFrame(() =>
          window.scrollTo({ top: Number(saved), behavior: 'instant' })
        )
      );
      prevPathname.current = pathname;
      return;
    }

    // Real navigation — scroll to top (skip on first mount)
    if (prevPathname.current !== null && prevPathname.current !== pathname) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
    prevPathname.current = pathname;
  }, [pathname]);

  return null;
}
