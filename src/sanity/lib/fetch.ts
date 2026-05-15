import { client } from '../client';
import type { QueryParams } from 'next-sanity';

interface SanityFetchOptions {
  query: string;
  params?: QueryParams;
  tags?: string[];
  /** false (default): cache permanente, solo revalida con revalidateTag desde webhook.
   *  number: segundos antes de revalidación automática (NO recomendado por arquitectura). */
  revalidate?: number | false;
}

export async function sanityFetch<T>({
  query,
  params = {},
  tags = ['sanity'],
  revalidate = false,
}: SanityFetchOptions): Promise<T> {
  return client.fetch<T>(query, params, {
    next: {
      revalidate,
      tags,
    },
  });
}
