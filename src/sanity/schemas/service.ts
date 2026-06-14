import { defineField, defineType } from 'sanity';
import { ActivityIcon } from '@sanity/icons';
import { localizedString, localizedText } from '../lib/localization';

export const service = defineType({
  name: 'service',
  title: 'Servicio',
  type: 'document',
  icon: ActivityIcon,
  fields: [
    localizedString({
      name: 'name',
      title: 'Nombre del servicio',
      description: 'Ej: "Quimioterapia" / "Chemotherapy"',
      required: true,
    }),
    localizedText({
      name: 'description',
      title: 'Descripción',
      description: 'Breve descripción del servicio (visible en cards)',
      rows: 3,
    }),
    defineField({
      name: 'icon',
      title: 'Icono (Lucide)',
      description:
        'Nombre exacto del icono de lucide-react. Ej: "HeartPulse", "Stethoscope", "Activity". Ver https://lucide.dev/icons/',
      type: 'string',
      validation: (Rule) =>
        Rule.required().error('Selecciona un icono de Lucide'),
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      description:
        '"main" aparece en "Cuidarte es nuestra prioridad". "wellness" aparece en "Bienestar integral".',
      options: {
        list: [
          {
            title: 'Servicio principal (Cuidarte es nuestra prioridad)',
            value: 'main',
          },
          {
            title: 'Servicio complementario (Bienestar integral)',
            value: 'wellness',
          },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Orden de aparición',
      description: 'Menor número aparece primero.',
      type: 'number',
      initialValue: 100,
    }),
    defineField({
      name: 'isActive',
      title: '¿Activo?',
      type: 'boolean',
      description: 'Desactiva para ocultar sin eliminar.',
      initialValue: true,
    }),
    defineField({
      name: 'availableAt',
      title: 'Disponible en sedes',
      description:
        'Sedes donde se ofrece este servicio. Si está vacío, se asume disponible en todas.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'clinic' }] }],
    }),
  ],
  preview: {
    select: {
      title: 'name.es',
      category: 'category',
      icon: 'icon',
      isActive: 'isActive',
    },
    prepare({
      title,
      category,
      icon,
      isActive,
    }: {
      title?: string;
      category?: string;
      icon?: string;
      isActive?: boolean;
    }) {
      const categoryLabel = category === 'main' ? 'Principal' : 'Complementario';
      return {
        title: `${title ?? 'Sin nombre'}${!isActive ? ' (inactivo)' : ''}`,
        subtitle: `${categoryLabel} · Icon: ${icon ?? '—'}`,
      };
    },
  },
  orderings: [
    {
      title: 'Orden manual',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
  ],
});
