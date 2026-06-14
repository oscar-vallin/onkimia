import { defineField, defineType } from 'sanity';
import { ActivityIcon } from '@sanity/icons';

export const serviciosPage = defineType({
  name: 'serviciosPage',
  title: 'Página Servicios',
  type: 'document',
  icon: ActivityIcon,
  fields: [
    defineField({
      name: 'enfoqueImage',
      title: 'Imagen "Nuestro Enfoque"',
      type: 'image',
      description: 'Imagen editorial de impacto después de las 3 tarjetas de enfoque. Recomendado: 16:7, JPG <300KB.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'clinicsSectionImage',
      title: 'Imagen sección Clínicas',
      type: 'image',
      description: 'Imagen decorativa entre Clínicas y Unidades Complementarias. Recomendado: 16:7, JPG <300KB.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'partnersImage',
      title: 'Imagen Socios Comerciales',
      type: 'image',
      description: 'Imagen decorativa en la sección de Socios Comerciales. Recomendado: 16:7, JPG <300KB.',
      options: { hotspot: true },
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Página Servicios', subtitle: 'Documento singleton' };
    },
  },
});
