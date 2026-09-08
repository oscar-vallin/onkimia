import type { ReactNode } from 'react';

export const CLINIC_ICONS: Record<string, ReactNode> = {
  breast: (
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="currentColor" />
  ),
  lung: (
    <path d="M4 14c0 2.21 1.79 4 4 4v-4H4zm0-4v2h4V6c-2.21 0-4 1.79-4 4zm8-4v10c2.21 0 4-1.79 4-4V10c0-2.21-1.79-4-4-4zm0-2c-1.1 0-2 .9-2 2h4c0-1.1-.9-2-2-2z" fill="currentColor" />
  ),
  prostate: (
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" fill="none" stroke="currentColor" strokeWidth="1.5" />
  ),
  cns: (
    <path d="M9 2C6.24 2 4 4.24 4 7c0 1.86 1.02 3.47 2.53 4.33C5.6 12.18 5 13.53 5 15c0 3.31 2.69 6 6 6h1c3.31 0 6-2.69 6-6 0-1.47-.6-2.82-1.53-3.67C17.98 10.47 19 8.86 19 7c0-2.76-2.24-5-5-5h-1c-.6 0-1.18.11-1.73.29" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  ),
  headNeck: (
    <>
      <circle cx="12" cy="8" r="4" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 16c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v4H8v-4z" fill="none" stroke="currentColor" strokeWidth="1.5" />
    </>
  ),
  thoracic: (
    <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 4c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 10H8v-1c0-1.33 2.67-2 4-2s4 .67 4 2v1z" fill="currentColor" />
  ),
  hepatic: (
    <path d="M17 8C8 10 5.9 16.17 3.82 19.5 3.27 20.42 3.95 21 4.5 21c.5 0 .82-.34 1.22-.5C7 20 8.5 19.5 10 19.5c3 0 4.5 2 9 2V8c-1 0-1.5.5-2 1z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
  renal: (
    <path d="M12 3c-3.31 0-6 2.69-6 6 0 4.5 6 12 6 12s6-7.5 6-12c0-3.31-2.69-6-6-6zm0 8.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" fill="none" stroke="currentColor" strokeWidth="1.5" />
  ),
  gastric: (
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm0 1.5L19.5 8H14V3.5zM6 20V4h6v6h6v10H6z" fill="currentColor" />
  ),
  gynecological: (
    <path d="M12 2a7 7 0 110 14A7 7 0 0112 2zm0 10a3 3 0 100-6 3 3 0 000 6zm0 3v2m-2 2h4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  ),
  urinary: (
    <>
      <path d="M4.93 4.93A10 10 0 0119.07 19.07" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" fill="none" />
    </>
  ),
  digestive: (
    <path d="M17 7H7v10h10V7zm-5 7c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" fill="none" stroke="currentColor" strokeWidth="1.5" />
  ),
  skin: (
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  ),
};
