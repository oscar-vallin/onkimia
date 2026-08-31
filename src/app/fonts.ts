// app/fonts.ts
// ─── Typography v4 (Fraunces + DM Sans) ───
// next/font self-hosts the fonts: no request to Google at runtime,
// no FOUT/flicker, no render-blocking <link>. Direct improvement to LCP.
//
// Each weight×style is a preloaded woff2 that competes with the hero on the
// critical path and delays the swap (the h1 is the LCP element). Only load
// what's actually used: Fraunces 400 normal+italic (headings + hero
// emphasis), DM Sans 400+500. Unloaded weights (500-800 serif) get
// synthesized by the browser.

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
