import { defineField, defineType } from 'sanity';
import { CreditCardIcon } from '@sanity/icons';

export const insurance = defineType({
  name: 'insurance',
  title: 'Aseguradora',
  type: 'document',
  icon: CreditCardIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Nombre',
      description:
        'Nombre de la aseguradora. Ej: "AXA", "GNP", "MAPFRE". No se traduce (es marca).',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      description:
        'Logo oficial de la aseguradora. SVG preferentemente. Fondo transparente.',
      type: 'image',
      options: {
        accept: 'image/svg+xml,image/png',
      },
      validation: (Rule) =>
        Rule.required().error('El logo es obligatorio para la grilla visual'),
    }),
    defineField({
      name: 'website',
      title: 'Sitio web (opcional)',
      description:
        'URL oficial de la aseguradora. Si se llena, el logo se vuelve link.',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'order',
      title: 'Orden de aparición',
      type: 'number',
      initialValue: 100,
    }),
    defineField({
      name: 'isActive',
      title: '¿Activa?',
      type: 'boolean',
      description: 'Desactiva para ocultar de la grilla sin eliminar.',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      media: 'logo',
      isActive: 'isActive',
    },
    prepare(selection) {
      const { title, media, isActive } = selection as {
        title?: string;
        media?: string;
        isActive?: boolean;
      };
      return {
        title: `${title ?? 'Sin nombre'}${!isActive ? ' (inactiva)' : ''}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Orden manual',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Nombre A-Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }],
    },
  ],
});
