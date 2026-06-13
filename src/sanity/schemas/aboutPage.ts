import { defineField, defineType } from 'sanity';
import { UsersIcon } from '@sanity/icons';
import { localizedString, localizedText } from '../lib/localization';

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'Página Nosotros',
  type: 'document',
  icon: UsersIcon,
  fields: [
    // ─── HERO ───
    localizedString({ name: 'heroTitle', title: 'Hero — Título' }),
    localizedText({ name: 'heroDescription', title: 'Hero — Descripción', rows: 3 }),

    // ─── MÁS QUE MEDICINA ───
    localizedString({ name: 'moreTitleLine1', title: 'Más que medicina — Encabezado línea 1' }),
    localizedString({ name: 'moreTitleUnderlined', title: 'Más que medicina — Texto subrayado' }),
    localizedString({ name: 'moreTitleSuffix', title: 'Más que medicina — Texto final' }),
    localizedText({ name: 'moreDescription', title: 'Más que medicina — Descripción', rows: 4 }),
    defineField({
      name: 'differentialServices',
      title: 'Servicios diferenciales',
      description: 'Amenidades y diferenciales (valet, hospitality, app, etc.)',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'differentialService',
          fields: [
            localizedString({ name: 'title', title: 'Nombre del servicio' }),
            defineField({
              name: 'link',
              title: 'Enlace (opcional)',
              type: 'url',
            }),
            localizedString({ name: 'linkText', title: 'Texto del enlace (opcional)' }),
          ],
          preview: {
            select: { title: 'title.es' },
          },
        },
      ],
    }),

    // ─── CUERPO, MENTE Y CUIDADO INTEGRAL ───
    localizedString({ name: 'bodyMindTitlePrefix', title: 'Cuerpo y mente — Prefijo del encabezado' }),
    localizedString({ name: 'bodyMindTitleUnderlined', title: 'Cuerpo y mente — Texto subrayado' }),
    localizedString({ name: 'bodyMindTitleSuffix', title: 'Cuerpo y mente — Sufijo del encabezado' }),
    localizedText({ name: 'bodyMindDescription', title: 'Cuerpo y mente — Descripción', rows: 4 }),

    // ─── GRUPO DE APOYO ───
    localizedString({ name: 'supportGroupTitle', title: 'Grupo de apoyo — Título' }),
    localizedText({ name: 'supportGroupDescription', title: 'Grupo de apoyo — Descripción', rows: 4 }),
    defineField({
      name: 'supportGroupImage',
      title: 'Grupo de apoyo — Imagen',
      type: 'image',
      description: 'Foto para la tarjeta "Grupo de apoyo". Recomendado: 16:9 o 3:2, JPG <200KB.',
      options: { hotspot: true },
    }),

    // ─── ONKIMIA AWARE ───
    localizedString({ name: 'awareTitle', title: 'Onkimia Aware — Título' }),
    localizedText({ name: 'awareDescription', title: 'Onkimia Aware — Descripción', rows: 4 }),
    defineField({
      name: 'awareImage',
      title: 'Onkimia Aware — Imagen',
      type: 'image',
      description: 'Foto para la tarjeta "Onkimia Aware". Recomendado: 16:9 o 3:2, JPG <200KB.',
      options: { hotspot: true },
    }),

    // ─── ENFOQUE 360° ───
    defineField({
      name: 'enfoque360Image',
      title: 'Enfoque 360° — Imagen de la clínica',
      type: 'image',
      description: 'Foto de la clínica o pasillo. Recomendado: vertical 3:4 o cuadrada, JPG <250KB.',
      options: { hotspot: true },
    }),

    // ─── TESTIMONIALES (cabecera) ───
    localizedString({ name: 'testimonialsTitle', title: 'Testimoniales — Título de la sección' }),
    localizedString({ name: 'testimonialsSubtitle', title: 'Testimoniales — Subtítulo' }),
    defineField({
      name: 'reikyImage',
      title: 'Imagen de Reiki / Proceso',
      type: 'image',
      description: 'Imagen decorativa junto a la sección de testimoniales. Recomendado: vertical 4:5, JPG <200KB.',
      options: { hotspot: true },
    }),

    // ─── ¿TIENES DUDAS? ───
    localizedString({ name: 'doubtsTitleUnderlined', title: '¿Tienes dudas? — Texto subrayado' }),
    localizedString({ name: 'doubtsTitleSuffix', title: '¿Tienes dudas? — Texto final' }),
    localizedText({ name: 'doubtsDescription', title: '¿Tienes dudas? — Descripción', rows: 3 }),

    // ─── FAQ (preguntas + respuestas + foto de doctor, todo desde Sanity) ───
    localizedString({ name: 'faqTitleUnderlined', title: 'FAQ — Texto subrayado del encabezado' }),
    localizedString({ name: 'faqTitleSuffix', title: 'FAQ — Texto final del encabezado' }),
    defineField({
      name: 'faqItems',
      title: 'Preguntas frecuentes',
      type: 'array',
      description: 'Hasta 6 preguntas respondidas por doctores. Editables desde el CMS.',
      validation: (Rule) => Rule.max(6),
      of: [
        {
          type: 'object',
          name: 'faqItem',
          fields: [
            localizedString({ name: 'question', title: 'Pregunta', required: true }),
            localizedText({ name: 'answer', title: 'Respuesta', rows: 5, required: true }),
            defineField({
              name: 'doctor',
              title: 'Doctor que responde',
              type: 'reference',
              to: [{ type: 'doctor' }],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'question.es',
              subtitle: 'doctor.fullName',
            },
            prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
              return {
                title: title || 'Sin pregunta',
                subtitle: subtitle ? `Dr. ${subtitle}` : 'Sin doctor asignado',
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Página Nosotros', subtitle: 'Documento singleton' };
    },
  },
});
