import type { ReactNode } from 'react';

// Icons for the three text-only category tabs in ServicesClinicsAndUnits
// (specialties / treatments / support). Order matches the corresponding
// `*List` arrays in messages/{en,es}.json — index-aligned, not name-keyed,
// since those lists are plain translated string arrays.

export const SPECIALTY_ICONS: ReactNode[] = [
  // Oncología médica — microscopio
  <>
    <path d="M9 21h6" />
    <path d="M12 21v-3.5" />
    <path d="M6.5 17.5h11a1 1 0 001-1 4.5 4.5 0 00-4.5-4.5h-4a4.5 4.5 0 00-4.5 4.5 1 1 0 001 1z" />
    <circle cx="12.5" cy="6.5" r="2.25" />
    <path d="M11 8.3L8.5 10.8" />
    <path d="M15 10.5h2.5" />
  </>,
  // Oncología quirúrgica — bisturí
  <>
    <path d="M4 20L14 10" />
    <path d="M14 10l2.5-2.5a2 2 0 000-2.83l-.17-.17a2 2 0 00-2.83 0L11 7" />
    <circle cx="6" cy="18" r="1.5" />
  </>,
  // Medicina interna — estetoscopio
  <>
    <path d="M6 3v6a4 4 0 008 0V3" />
    <path d="M10 13v2a5 5 0 005 5 5 5 0 005-5v-1.5" />
    <circle cx="20" cy="8.5" r="1.75" />
  </>,
  // Hematología — gota
  <path key="hematologia" d="M12 3s6 7.2 6 11.5A6 6 0 016 14.5C6 10.2 12 3 12 3z" />,
  // Radiología — escáner
  <>
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M8 8h8M8 12h8M8 16h5" />
  </>,
  // Otorrinolaringología — oído
  <path key="orl" d="M8 13a4 4 0 108 0c0-3-2-4-2-7a4 4 0 10-8 0c0 1.5.7 2.2 1.5 3M12 13a2 2 0 002-2" />,
  // Ginecología — símbolo venus
  <>
    <circle cx="12" cy="9" r="5" />
    <path d="M12 14v7M9 18h6" />
  </>,
  // Geriatría — persona con bastón
  <>
    <circle cx="9" cy="5" r="2" />
    <path d="M9 8v6l-2 7M9 14l3 1 3 7M12 15l3-2" />
    <path d="M19 8v9" />
  </>,
  // Urología — vejiga / gota con ondas
  <>
    <path d="M12 4s4 4.8 4 8a4 4 0 01-8 0c0-3.2 4-8 4-8z" />
    <path d="M5 20c1-1 2-1 3 0s2 1 3 0 2-1 3 0 2 1 3 0 2-1 3 0" />
  </>,
  // Nefrología — riñón
  <path key="nefrologia" d="M9 3C6 3 4 6 4 10c0 5 3 11 6 11 2 0 2-2 3-2s1 2 3 2c1.5 0 3-3 3-7 0-3-1-5-3-5-1.5 0-2 1-3.5 1S10 3 9 3z" />,
  // Endocrinología — glándula tiroides (mariposa)
  <>
    <path d="M12 10c-1.5-2.5-4-3-5.5-1.5S5 12.5 8 14c1.5.8 3 .5 4-1" />
    <path d="M12 10c1.5-2.5 4-3 5.5-1.5S19 12.5 16 14c-1.5.8-3 .5-4-1" />
    <path d="M12 10v3" />
  </>,
  // Obesidad y metabolismo — báscula
  <>
    <rect x="4" y="15" width="16" height="6" rx="1.5" />
    <path d="M12 15V6" />
    <path d="M8 9l4-3 4 3" />
  </>,
  // Gastroenterología — estómago
  <path key="gastroenterologia" d="M8 4c0 2-2 2-2 5 0 4 2 4 2 7a4 4 0 008 0c0-2 3-3 3-7 0-2-1-4-3-4-1 0-1 1-2 1s-1-2-3-2-2 2-3 2-1-2 0-2" />,
  // Neumología — pulmones
  <>
    <path d="M12 4v6" />
    <path d="M12 10c-1-2-3-3-4.5-2S5 11 5 14c0 2.5 1 6 2.5 6S9 17 9 14v-1c0-1.5 1-2 3-2" />
    <path d="M12 10c1-2 3-3 4.5-2S19 11 19 14c0 2.5-1 6-2.5 6S15 17 15 14v-1c0-1.5-1-2-3-2" />
  </>,
  // Dermatología — capas de piel
  <path key="dermatologia" d="M12 3L3 8l9 5 9-5-9-5zM3 12l9 5 9-5M3 16l9 5 9-5" />,
  // Algología y medicina del dolor — rayo de dolor
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M13 7l-4 6h3l-1 4 4-6h-3l1-4z" />
  </>,
];

export const TREATMENT_ICONS: ReactNode[] = [
  // Consulta de especialidad — portapapeles
  <>
    <rect x="6" y="4" width="12" height="17" rx="2" />
    <path d="M9 4V3a1 1 0 011-1h4a1 1 0 011 1v1" />
    <path d="M9 12l2 2 4-4" />
  </>,
  // Quimioterapia — bolsa de suero
  <>
    <path d="M8 3h8l1 6a5 5 0 01-10 0l1-6z" />
    <path d="M12 14v7" />
    <path d="M9 9h6" />
  </>,
  // Radioterapia — diana
  <>
    <circle cx="12" cy="12" r="9" />
    <circle cx="12" cy="12" r="5" />
    <circle cx="12" cy="12" r="1" fill="currentColor" />
  </>,
  // Inmunoterapia — escudo
  <path key="inmunoterapia" d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />,
  // Cirugía — tijeras
  <>
    <circle cx="6" cy="6" r="2" />
    <circle cx="6" cy="18" r="2" />
    <path d="M7.5 7.5L20 20M7.5 16.5L20 4" />
  </>,
];

export const SUPPORT_ICONS: ReactNode[] = [
  // Psicología — cabeza con engranaje
  <>
    <path d="M9 21v-2a5 5 0 015-5c2.8 0 5-2 5-5a5 5 0 00-9.8-1.5C7 8 5 9 5 11.5 5 13 6 14 6 15v1" />
    <circle cx="14" cy="9" r="1" fill="currentColor" />
  </>,
  // Nutrición — manzana
  <>
    <path d="M12 8c-3 0-5 2.5-5 6a7 7 0 007 7c1 0 1.5-.5 2-.5s1 .5 2 .5a7 7 0 007-7c0-3.5-2-6-5-6-1.3 0-2 .5-3 .5s-1.7-.5-3-.5z" />
    <path d="M12 8c0-2 1-3.5 3-4" />
  </>,
  // Fisioterapia — mancuerna
  <>
    <path d="M6 9v6M18 9v6" />
    <rect x="3" y="8" width="3" height="8" rx="1" />
    <rect x="18" y="8" width="3" height="8" rx="1" />
    <path d="M6 12h12" />
  </>,
  // Reiki — mano con destellos
  <>
    <path d="M6 13V7a1.5 1.5 0 013 0v4M9 11V5a1.5 1.5 0 013 0v6M12 11V6a1.5 1.5 0 013 0v6" />
    <path d="M15 12V8a1.5 1.5 0 013 0v6c0 3.5-2 7-6 7s-6-2-6.5-5L5 13.5A1.4 1.4 0 017 12" />
  </>,
  // Grupo de apoyo — personas
  <>
    <circle cx="9" cy="8" r="2.5" />
    <circle cx="16" cy="9" r="2" />
    <path d="M4 20v-1.5A4.5 4.5 0 018.5 14h1A4.5 4.5 0 0114 18.5V20" />
    <path d="M15 14.5a3.5 3.5 0 013.5 3.5V20" />
  </>,
];
