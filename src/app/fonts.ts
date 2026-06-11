// app/fonts.ts
// ─── Fase 1 · Tipografía v3 (Fraunces + DM Sans) ───
// Reemplaza a Google Sans Flex + Montserrat.
// next/font auto-hospeda las fuentes: sin request a Google en runtime,
// sin FOUT/parpadeo, sin <link> bloqueante. Mejora directa de LCP.

import { Fraunces, DM_Sans } from 'next/font/google';

// Fraunces es fuente variable: incluye todos los pesos del rango.
// La maqueta usa: 400, 500 e itálica 400, con el eje óptico (opsz)
// que le da el carácter editorial en tamaños grandes.
export const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  axes: ['opsz'],
  variable: '--font-fraunces',
});

// DM Sans — pesos usados en la maqueta: 400, 500, 600.
export const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600'],
  variable: '--font-dm-sans',
});

// Made with Bob
