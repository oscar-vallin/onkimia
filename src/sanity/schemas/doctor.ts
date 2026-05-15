import { defineField, defineType } from 'sanity';
import { UserIcon } from '@sanity/icons';
import { localizedString, localizedText } from '../lib/localization';

export const doctor = defineType({
  name: 'doctor',
  title: 'Doctor / Especialista',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'fullName',
      title: 'Nombre completo',
      type: 'string',
      description: 'Ej: "Dr. Miguel Ángel Fuentes"',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug (URL)',
      type: 'slug',
      options: {
        source: 'fullName',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'photo',
      title: 'Foto',
      type: 'image',
      description: 'Retrato profesional, fondo neutro. Mín 800x800.',
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),
    localizedString({
      name: 'specialty',
      title: 'Especialidad principal',
      description: 'Ej: "Oncología Médica" / "Medical Oncology"',
      required: true,
    }),
    defineField({
      name: 'medicalSpecialties',
      title: 'Especialidades (Schema.org)',
      description: 'Para JSON-LD MedicalSpecialty. Selecciona las que aplican.',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Oncology', value: 'Oncologic' },
          { title: 'Surgery', value: 'Surgical' },
          { title: 'Radiology', value: 'Radiography' },
          { title: 'Gastroenterology', value: 'Gastroenterologic' },
          { title: 'Pathology', value: 'Pathology' },
          { title: 'Palliative Care', value: 'PalliativeCare' },
          { title: 'Internal Medicine', value: 'InternalMedicine' },
        ],
      },
    }),
    localizedText({
      name: 'bio',
      title: 'Biografía',
      description: 'Trayectoria profesional, formación, certificaciones.',
      rows: 6,
    }),
    defineField({
      name: 'clinics',
      title: 'Sedes donde atiende',
      description: 'Selecciona en qué clínicas trabaja este doctor.',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'clinic' }] }],
      validation: (Rule) => Rule.min(1).error('Debe atender en al menos una sede'),
    }),
    defineField({
      name: 'credentials',
      title: 'Credenciales',
      description: 'Lista de certificaciones, asociaciones, etc.',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'order',
      title: 'Orden de aparición',
      description: 'Menor número aparece primero. Útil para destacar líderes.',
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
  ],
  preview: {
    select: {
      title: 'fullName',
      specialty: 'specialty.es',
      media: 'photo',
      isActive: 'isActive',
    },
    prepare({ title, specialty, media, isActive }) {
      return {
        title: `${title}${!isActive ? ' (inactivo)' : ''}`,
        subtitle: specialty,
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
      by: [{ field: 'fullName', direction: 'asc' }],
    },
  ],
});