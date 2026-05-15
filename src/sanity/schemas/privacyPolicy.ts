import { defineField, defineType } from 'sanity';
import { DocumentIcon } from '@sanity/icons';

const portableTextOf = [
  {
    type: 'block',
    styles: [
      { title: 'Normal', value: 'normal' },
      { title: 'Heading 3', value: 'h3' },
    ],
    lists: [
      { title: 'Bullet', value: 'bullet' },
      { title: 'Numbered', value: 'number' },
    ],
    marks: {
      decorators: [
        { title: 'Strong', value: 'strong' },
        { title: 'Emphasis', value: 'em' },
      ],
      annotations: [
        {
          type: 'object',
          name: 'link',
          fields: [{ name: 'href', type: 'url', title: 'URL' }],
        },
      ],
    },
  },
];

export const privacyPolicy = defineType({
  name: 'privacyPolicy',
  title: 'Aviso de Privacidad',
  type: 'document',
  icon: DocumentIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Título',
      type: 'object',
      fields: [
        { name: 'es', title: 'Español', type: 'string', initialValue: 'Aviso de Privacidad' },
        { name: 'en', title: 'English', type: 'string', initialValue: 'Privacy Notice' },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'lastUpdated',
      title: 'Última actualización',
      description: 'Fecha de la última modificación. LFPDPPP exige que sea visible.',
      type: 'date',
      validation: (Rule) => Rule.required(),
      initialValue: () => new Date().toISOString().split('T')[0],
    }),
    defineField({
      name: 'introduction',
      title: 'Introducción',
      description: 'Párrafo introductorio antes de las secciones.',
      type: 'object',
      fields: [
        { name: 'es', title: 'Español', type: 'text', rows: 4 },
        { name: 'en', title: 'English', type: 'text', rows: 4 },
      ],
    }),
    defineField({
      name: 'content',
      title: 'Contenido (secciones)',
      description: 'Secciones del aviso de privacidad (LFPDPPP — 9 secciones mínimas).',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'section',
          fields: [
            {
              name: 'heading',
              title: 'Título de la sección',
              type: 'object',
              fields: [
                { name: 'es', title: 'Español', type: 'string' },
                { name: 'en', title: 'English', type: 'string' },
              ],
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'bodyEs',
              title: 'Contenido (ES)',
              type: 'array',
              of: portableTextOf,
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'bodyEn',
              title: 'Contenido (EN)',
              type: 'array',
              of: portableTextOf,
              validation: (Rule) => Rule.required(),
            },
          ],
          preview: {
            select: { title: 'heading.es' },
          },
        },
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Aviso de Privacidad', subtitle: 'Documento singleton' };
    },
  },
});
