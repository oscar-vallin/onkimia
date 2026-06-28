import { defineField, defineType } from 'sanity';

export const socioComercial = defineType({
  name: 'socioComercial',
  title: 'Socios Comerciales',
  type: 'document',
  orderings: [
    {
      title: 'Orden de aparición',
      name: 'ordenAsc',
      by: [{ field: 'orden', direction: 'asc' }],
    },
  ],
  fields: [
    defineField({
      name: 'nombre',
      title: 'Nombre',
      type: 'string',
      validation: (Rule) => Rule.required().error('El nombre del socio es obligatorio'),
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      options: { hotspot: false },
      validation: (Rule) => Rule.required().error('El logo es obligatorio'),
      fields: [
        defineField({
          name: 'alt',
          title: 'Texto alternativo',
          type: 'string',
          description: 'Se usa el nombre del socio si se deja vacío',
        }),
      ],
    }),
    defineField({
      name: 'url',
      title: 'URL del sitio web',
      type: 'url',
      description: 'Opcional — hace el logo clickeable',
    }),
    defineField({
      name: 'orden',
      title: 'Orden de aparición',
      type: 'number',
      description: 'Número menor aparece primero',
    }),
  ],
});
