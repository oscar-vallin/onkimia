import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Onkimia — Evolución Oncológica',
    short_name: 'Onkimia',
    description: 'Centro oncológico integral. Tratamiento, acompañamiento y bienestar para pacientes con cáncer en Guadalajara y Colima.',
    start_url: '/',
    display: 'standalone',
    background_color: '#1E1739',
    theme_color: '#1E1739',
    icons: [
      {
        src: '/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}
