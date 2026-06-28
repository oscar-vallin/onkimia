import { defineField, defineType } from 'sanity';
import { CogIcon } from '@sanity/icons';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Configuración del sitio',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'sections', title: 'Secciones internas', default: true },
  ],
  fields: [
    // ─── SECTION IMAGES ─────────────────────────────────────────────────────
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
  ],
  preview: {
    prepare() {
      return {
        title: 'Configuración del sitio',
        subtitle: 'Settings globales',
      };
    },
  },
});
