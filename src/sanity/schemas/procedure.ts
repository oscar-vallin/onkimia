import { defineField, defineType } from 'sanity';
import { ActivityIcon } from '@sanity/icons';
import { localizedString } from '../lib/localization';

export const procedure = defineType({
  name: 'procedure',
  title: 'Procedimiento',
  type: 'document',
  icon: ActivityIcon,
  fields: [
    defineField({
      name: 'order',
      title: 'Orden',
      type: 'number',
      description: 'Orden de aparición. Menor número = primero.',
      validation: (Rule) => Rule.required().integer().positive(),
    }),
    localizedString({
      name: 'name',
      title: 'Nombre',
      required: true,
    }),
    localizedString({
      name: 'shortDescription',
      title: 'Descripción corta',
      description: 'Frase de 12-18 palabras. Aparece en la tarjeta del carrusel del Home.',
      required: true,
    }),
    defineField({
      name: 'highlights',
      title: 'Puntos destacados',
      type: 'array',
      description: 'Lista de características o puntos clave. Aparecen como bullets en la página Endos.',
      of: [
        {
          type: 'object',
          fields: [
            localizedString({ name: 'text', title: 'Texto', required: true }),
          ],
          preview: {
            select: { title: 'text.es' },
          },
        },
      ],
    }),
    defineField({
      name: 'submark',
      title: 'Submarca',
      type: 'string',
      options: {
        list: [
          { title: 'Endos', value: 'Endos' },
          { title: 'Cuidare', value: 'Cuidare' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'Imagen de la tarjeta',
      type: 'image',
      description: 'Foto para la tarjeta del carrusel. Recomendado: 600×800px (3:4), JPG optimizado <150KB.',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    localizedString({
      name: 'duration',
      title: 'Duración',
      description: 'Opcional. Ej: "30 min", "45 min". Dejar vacío si no se conoce.',
      required: false,
    }),
  ],
  orderings: [
    {
      title: 'Orden de aparición',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
  preview: {
    select: {
      title: 'name.es',
      subtitle: 'submark',
      media: 'image',
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title || 'Sin nombre',
        subtitle: subtitle || '',
        media,
      };
    },
  },
});
