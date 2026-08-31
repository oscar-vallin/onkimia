import { defineField, defineType } from 'sanity';
import { ActivityIcon } from '@sanity/icons';
import { localizedString, localizedText } from '../lib/localization';

export const endosPage = defineType({
  name: 'endosPage',
  title: 'Página Endos',
  type: 'document',
  icon: ActivityIcon,
  fields: [
    defineField({
      name: 'safetyImage',
      title: 'Imagen "Seguridad y confianza"',
      type: 'image',
      description: 'Foto del consultorio o sala de procedimientos para la sección de confianza. Vertical 4:5, JPG <250KB.',
      options: { hotspot: true },
    }),

    // ─── FAQ ─────────────────────────────────────────────────────────────────
    defineField({
      name: 'faqItems',
      title: 'Preguntas Frecuentes',
      type: 'array',
      description: 'Preguntas y respuestas que aparecen en la sección "Preguntas frecuentes" de la página Endos. Arrastra para reordenar.',
      of: [
        {
          type: 'object',
          name: 'faqItem',
          fields: [
            localizedString({ name: 'question', title: 'Pregunta', required: true }),
            localizedText({ name: 'answer', title: 'Respuesta', rows: 4, required: true }),
          ],
          preview: {
            select: { title: 'question.es' },
            prepare({ title }: { title?: string }) {
              return { title: title || 'Sin pregunta' };
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(12),
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Página Endos', subtitle: 'Documento singleton' };
    },
  },
});
