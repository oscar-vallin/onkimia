// app/fonts.ts
// ─── Tipografía v4 (Playfair Display + DM Sans) ───
// next/font auto-hospeda las fuentes: sin request a Google en runtime,
// sin FOUT/parpadeo, sin <link> bloqueante. Mejora directa de LCP.

import { Playfair_Display, DM_Sans, Source_Code_Pro } from 'next/font/google';

// Playfair Display — pesos 400–700, normal + italic.
// El diseño del hero usa italic para parte de los títulos.
export const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
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
