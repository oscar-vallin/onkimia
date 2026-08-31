import { createClient } from '@sanity/client';
import { apiVersion, dataset, projectId, token } from './env';

/**
 * Cliente público (lectura, contenido publicado).
 * Usa CDN para mejor performance.
 */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true, // Cache CDN agresivo. ISR maneja la frescura.
  perspective: 'published',
});

/**
 * Cliente con token (para previews y drafts).
 * Sin CDN para obtener contenido fresco.
 */
export const draftClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  perspective: 'previewDrafts',
  token,
});