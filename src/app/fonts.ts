// app/fonts.ts
// ─── Tipografía v4 (Fraunces + DM Sans) ───
// next/font auto-hospeda las fuentes: sin request a Google en runtime,
// sin FOUT/parpadeo, sin <link> bloqueante. Mejora directa de LCP.
//
// Cada peso×estilo es un woff2 preloadeado que compite con el hero en la
// ruta crítica y retrasa el swap (el h1 es el elemento LCP). Cargar solo
// lo que se usa: Fraunces 400 normal+italic (headings + énfasis del hero),
// DM Sans 400+500. Pesos no cargados (500-800 serif) se sintetizan.

import { Fraunces, DM_Sans } from 'next/font/google';

export const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
});

export const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
  variable: '--font-dm-sans',
});
