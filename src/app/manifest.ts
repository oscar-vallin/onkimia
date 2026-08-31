import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Onkimia — Evolución Oncológica',
    short_name: 'Onkimia',
    description: 'Centro oncológico integral. Tratamiento, acompañamiento y bienestar para pacientes con cáncer en Guadalajara y Colima.',
    start_url: '/',
    display: 'standalone',
    // --color-ink from the v4 token system (globals.css)
    background_color: '#1a1a1f',
    theme_color: '#1a1a1f',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-256.png',
        sizes: '256x256',
        type: 'image/png',
      },
    ],
  };
}
