'use client';

import { useEffect } from 'react';

interface PageThemeProps {
  headerTheme: 'dark' | 'light';
}

export function PageTheme({ headerTheme }: PageThemeProps) {
  useEffect(() => {
    document.body.setAttribute('data-header-theme', headerTheme);
    return () => document.body.removeAttribute('data-header-theme');
  }, [headerTheme]);
  return null;
}
