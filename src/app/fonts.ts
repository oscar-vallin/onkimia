// app/fonts.ts
// ─── Tipografía v4 (Fraunces + DM Sans) ───
// next/font auto-hospeda las fuentes: sin request a Google en runtime,
// sin FOUT/parpadeo, sin <link> bloqueante. Mejora directa de LCP.

import { Fraunces, DM_Sans, Source_Code_Pro } from 'next/font/google';

// Fraunces — 400 + 500, normal + italic.
// Instancias estáticas (no variable axis) → woff2 más ligero, mejor LCP.
// El h1 del hero usa italic para el énfasis (* ... *).
export const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-fraunces',
});

// DM Sans — pesos usados en la maqueta: 300, 400, 500.
export const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500'],
  variable: '--font-dm-sans',
});

export const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  preload: false,
});
