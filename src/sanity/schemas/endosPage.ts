import { defineField, defineType } from 'sanity';
import { ActivityIcon } from '@sanity/icons';

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
  ],
  preview: {
    prepare() {
      return { title: 'Página Endos', subtitle: 'Documento singleton' };
    },
  },
});
