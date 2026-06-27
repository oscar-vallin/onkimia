import type { MetadataRoute } from 'next';
import { sanityFetch } from '@/sanity/lib/fetch';
import { ACTIVE_JOB_POSTINGS_QUERY } from '@/sanity/queries';
import type { JobPosting } from '@/sanity/types';

const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://onkimia.com').replace(/\/$/, '');

const STATIC_PAGES: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'];
  priority: number;
}> = [
  { path: '',                    changeFrequency: 'weekly',  priority: 1.0 },
  { path: '/nosotros',           changeFrequency: 'monthly', priority: 0.8 },
  { path: '/endos',              changeFrequency: 'monthly', priority: 0.9 },
  { path: '/cuidare',            changeFrequency: 'monthly', priority: 0.9 },
  { path: '/onkimia-doctors',    changeFrequency: 'monthly', priority: 0.7 },
  { path: '/servicios',          changeFrequency: 'monthly', priority: 0.8 },
  { path: '/contacto',           changeFrequency: 'yearly',  priority: 0.7 },
  { path: '/bolsa-de-trabajo',   changeFrequency: 'weekly',  priority: 0.6 },
  { path: '/colima',             changeFrequency: 'monthly', priority: 0.6 },
  { path: '/aviso-de-privacidad', changeFrequency: 'yearly', priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // es (default, no prefix): /ruta
  // en (with prefix):        /en/ruta
  const staticEntries: MetadataRoute.Sitemap = STATIC_PAGES.flatMap((page) => [
    {
      url: `${SITE_URL}${page.path || '/'}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority,
      alternates: {
        languages: {
          'es-MX': `${SITE_URL}${page.path || '/'}`,
          'en-US': `${SITE_URL}/en${page.path}`,
        },
      },
    },
    {
      url: `${SITE_URL}/en${page.path}`,
      lastModified: now,
      changeFrequency: page.changeFrequency,
      priority: page.priority * 0.9,
      alternates: {
        languages: {
          'es-MX': `${SITE_URL}${page.path || '/'}`,
          'en-US': `${SITE_URL}/en${page.path}`,
        },
      },
    },
  ]);

  // Actualiza lastModified de /bolsa-de-trabajo con la vacante más reciente
  let lastJobsUpdate = now;
  try {
    const jobs = await sanityFetch<JobPosting[]>({
      query: ACTIVE_JOB_POSTINGS_QUERY,
      tags: ['jobPosting'],
    });
    if (jobs.length > 0) {
      const mostRecent = jobs.reduce((latest, job) => {
        const d = new Date(job.publishedAt);
        return d > latest ? d : latest;
      }, new Date(0));
      lastJobsUpdate = mostRecent;
    }
  } catch (err) {
    console.error('[Sitemap] Error fetching job postings:', err);
  }

  return staticEntries.map((entry) =>
    entry.url.includes('/bolsa-de-trabajo')
      ? { ...entry, lastModified: lastJobsUpdate }
      : entry
  );
}
