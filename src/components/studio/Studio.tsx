'use client';

/**
 * Wrapper aislado del NextStudio.
 * Se carga sólo en cliente vía dynamic import.
 */

import { NextStudio } from 'next-sanity/studio';
import config from '@/../sanity.config';

export default function Studio() {
  return <NextStudio config={config} />;
}