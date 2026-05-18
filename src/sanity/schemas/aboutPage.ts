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

    // ─── ONKIMIA AWARE ───
    localizedString({ name: 'awareTitle', title: 'Onkimia Aware — Título' }),
    localizedText({ name: 'awareDescription', title: 'Onkimia Aware — Descripción', rows: 4 }),

    // ─── TESTIMONIALES (cabecera) ───
    localizedString({ name: 'testimonialsTitle', title: 'Testimoniales — Título de la sección' }),
    localizedString({ name: 'testimonialsSubtitle', title: 'Testimoniales — Subtítulo' }),

    // ─── ¿TIENES DUDAS? ───
    localizedString({ name: 'doubtsTitleUnderlined', title: '¿Tienes dudas? — Texto subrayado' }),
    localizedString({ name: 'doubtsTitleSuffix', title: '¿Tienes dudas? — Texto final' }),
    localizedText({ name: 'doubtsDescription', title: '¿Tienes dudas? — Descripción', rows: 3 }),

    // ─── FAQ (cabecera) ───
    localizedString({ name: 'faqTitleUnderlined', title: 'FAQ — Texto subrayado del encabezado' }),
    localizedString({ name: 'faqTitleSuffix', title: 'FAQ — Texto final del encabezado' }),
  ],
  preview: {
    prepare() {
      return { title: 'Página Nosotros', subtitle: 'Documento singleton' };
    },
  },
});
