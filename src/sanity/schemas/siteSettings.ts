import { defineField, defineType } from 'sanity';
import { CogIcon } from '@sanity/icons';
import { localizedString, localizedText } from '../lib/localization';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Configuración del sitio',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'heroes', title: 'Imágenes Hero', default: true },
    { name: 'branding', title: 'Marca' },
    { name: 'sections', title: 'Secciones internas' },
    { name: 'contact', title: 'Contacto y social' },
  ],
  fields: [
    // ─── BRANDING ───────────────────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Nombre del sitio',
      type: 'string',
      group: 'branding',
      initialValue: 'Onkimia',
      validation: (Rule) => Rule.required(),
    }),
    localizedString({
      name: 'tagline',
      title: 'Tagline / Eslogan',
      description: 'Frase corta de marca (usada en metadata y hero)',
      required: true,
      // @ts-expect-error — localizedString wrapper doesn't pass through `group`
      group: 'branding',
    }),
    defineField({
      name: 'logo',
      title: 'Logo principal',
      type: 'image',
      group: 'branding',
      description: 'SVG preferentemente. Si es PNG, mínimo 2x retina.',
      options: { accept: 'image/svg+xml,image/png' },
    }),
    defineField({
      name: 'logoDark',
      title: 'Logo versión oscura',
      type: 'image',
      group: 'branding',
      description: 'Para fondos claros (header). Si no se sube, se usa el principal.',
      options: { accept: 'image/svg+xml,image/png' },
    }),

    // ─── HERO IMAGES ────────────────────────────────────────────────────────
    defineField({
      name: 'homeHeroImage',
      title: 'Hero — Home',
      type: 'image',
      group: 'heroes',
      description: 'Imagen principal del Home. También se usa como fallback en todas las páginas.',
      options: { hotspot: true },
      validation: (Rule) => Rule.required().error('La imagen del hero es necesaria'),
    }),
    defineField({
      name: 'homeHeroDescription',
      title: 'Descripción Hero del Home',
      type: 'object',
      group: 'heroes',
      description: 'Texto que aparece bajo el tagline en el hero del Home.',
      fields: [
        defineField({ name: 'es', title: 'Español', type: 'string' }),
        defineField({ name: 'en', title: 'English', type: 'string' }),
      ],
    }),

    // ─── SECTION IMAGES ─────────────────────────────────────────────────────
    defineField({
      name: 'wellnessImage',
      title: 'Imagen de fondo — Sección Wellness',
      type: 'image',
      group: 'sections',
      description: 'Imagen a sangre completa detrás de la sección "Vive más sano, por más tiempo". Se muestra con overlay oscuro.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'wellbeingList',
      title: 'Lista de bienestar (Home)',
      type: 'array',
      group: 'sections',
      description: 'Servicios de bienestar integral mostrados en la sección oscura del Home. Arrastra para reordenar.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Ícono',
              type: 'string',
              options: {
                list: [
                  { title: 'Sparkles (relajación)', value: 'sparkles' },
                  { title: 'Zap (fisioterapia)',    value: 'zap' },
                  { title: 'Corazón (psicología)',  value: 'heart' },
                  { title: 'Bolsa (boutique)',      value: 'shopping-bag' },
                  { title: 'Gráfica (nutrición)',   value: 'bar-chart' },
                  { title: 'Bombilla (genómica)',   value: 'lightbulb' },
                  { title: 'ADN',                   value: 'dna' },
                  { title: 'Actividad',             value: 'activity' },
                ],
                layout: 'dropdown',
              },
              validation: (Rule) => Rule.required(),
            }),
            localizedString({ name: 'title', title: 'Título', required: true }),
            localizedText({ name: 'description', title: 'Descripción', rows: 3, required: true }),
          ],
          preview: {
            select: { title: 'title.es', subtitle: 'icon' },
            prepare({ title, subtitle }) {
              return { title: title || 'Servicio de bienestar', subtitle };
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(9),
    }),
    defineField({
      name: 'servicesList',
      title: 'Lista de servicios (Home)',
      type: 'array',
      group: 'sections',
      description: 'Servicios mostrados en la sección "Cuidarte es nuestra prioridad". Arrastra para reordenar.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Ícono',
              type: 'string',
              options: {
                list: [
                  { title: 'Corazón (heart)', value: 'heart' },
                  { title: 'Portapapeles (clipboard)', value: 'clipboard' },
                  { title: 'Sol (sun)', value: 'sun' },
                  { title: 'Búsqueda (search)', value: 'search' },
                  { title: 'Usuario (user)', value: 'user' },
                  { title: 'Actividad (activity)', value: 'activity' },
                  { title: 'Microscopio (microscope)', value: 'microscope' },
                  { title: 'Escudo (shield)', value: 'shield' },
                ],
                layout: 'dropdown',
              },
              validation: (Rule) => Rule.required(),
            }),
            localizedString({ name: 'title', title: 'Título', required: true }),
            localizedText({ name: 'description', title: 'Descripción', rows: 3, required: true }),
          ],
          preview: {
            select: { title: 'title.es', subtitle: 'icon' },
            prepare({ title, subtitle }) {
              return { title: title || 'Servicio', subtitle };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'studiesGallery',
      title: 'Galería — Estudios (Home)',
      type: 'array',
      group: 'sections',
      description: 'Imágenes flotantes de la sección "La evaluación de salud más completa". 5 imágenes cuadradas recomendadas.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: 'Imagen',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'alt',
              title: 'Texto alternativo',
              type: 'string',
              validation: (Rule) => Rule.required().error('Describe la imagen para lectores de pantalla'),
            }),
          ],
          preview: {
            select: { media: 'image', title: 'alt' },
            prepare({ media, title }) {
              return { title: title || 'Imagen estudio', media };
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(7),
    }),
    defineField({
      name: 'howItWorksSteps',
      title: 'Pasos — Cómo funciona (Home)',
      type: 'array',
      group: 'sections',
      description: 'Exactamente 3 imágenes, una por paso. El texto de cada paso se gestiona en i18n.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: 'Imagen del paso',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { media: 'image' },
            prepare({ media }) {
              return { title: 'Paso', media };
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(3),
    }),
    defineField({
      name: 'processImage',
      title: 'Imagen del Proceso de Evaluación',
      type: 'image',
      group: 'sections',
      description: 'Imagen sticky de la sección "Una mirada completa a tu salud" en Home. Vertical 4:5, mín. 1200×1500px.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'proceduresBgImage',
      title: 'Fondo — Carrusel de Procedimientos (Home)',
      type: 'image',
      group: 'sections',
      description: 'Fondo oscuro del carrusel "Estudios y procedimientos". 1920×1080px, JPG oscuro.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'cuidareRadiologyImage',
      title: 'Fondo — Radiología Intervencionista (Cuidare)',
      type: 'image',
      group: 'sections',
      description: 'Imagen de fondo oscura para la sección de procedimientos guiados por ultrasonido en /cuidare.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'appointmentCtaBgImage',
      title: 'Fondo — Sección Agenda tu Cita (Home)',
      type: 'image',
      group: 'sections',
      description: 'Imagen de fondo para la sección "Agenda tu Cita" del Home. Se muestra con overlay oscuro. 1920×1080px recomendado.',
      options: { hotspot: true },
    }),

    // ─── CONTACT & SOCIAL ───────────────────────────────────────────────────
    defineField({
      name: 'socialMedia',
      title: 'Redes sociales',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
        defineField({ name: 'facebook', title: 'Facebook URL', type: 'url' }),
        defineField({ name: 'twitter', title: 'X (Twitter) URL', type: 'url' }),
      ],
    }),
    defineField({
      name: 'jobBoardEmail',
      title: 'Email Bolsa de Trabajo',
      type: 'string',
      group: 'contact',
      description: 'Email que recibe postulaciones (default: eortega@onkimia.com)',
      initialValue: 'eortega@onkimia.com',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'whatsappCommercial',
      title: 'WhatsApp Comercial (Onkimia Doctors)',
      type: 'string',
      group: 'contact',
      description: 'Número para "Únete ahora" en página de Onkimia Doctors. Solo dígitos.',
      validation: (Rule) =>
        Rule.regex(/^\d+$/, { name: 'whatsapp-digits' }).error('Solo dígitos, sin + ni espacios'),
    }),
    defineField({
      name: 'appDownloadUrl',
      title: 'URL de descarga App Onkimia',
      type: 'url',
      group: 'contact',
      description: 'Link a App Store, Play Store o landing de descarga. Si está vacío, la sección se oculta.',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return {
        title: title || 'Configuración del sitio',
        subtitle: 'Settings globales',
      };
    },
  },
});
