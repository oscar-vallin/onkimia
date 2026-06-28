import { defineField, defineType } from 'sanity';

export const onkimiaDocsSettings = defineType({
  name: 'onkimiaDocsSettings',
  title: 'Onkimia Doctors — Ajustes',
  type: 'document',
  fields: [
    // ─── Imágenes de sección ───
    defineField({
      name: 'whatIsImage',
      title: 'Imagen "¿Qué es Onkimia Doctors?"',
      description: 'Aparece junto a la descripción de la sección introductoria.',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'improvementsImage',
      title: 'Imagen "Mejoras al paciente"',
      description: 'Imagen decorativa o editorial para la sección de mejoras en la calidad de atención.',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'benefitsImage',
      title: 'Imagen "Beneficios para el médico"',
      description: 'Imagen decorativa para la sección de beneficios.',
      type: 'image',
      options: { hotspot: true },
    }),
    // ─── WhatsApp ───
    defineField({
      name: 'whatsappEndos',
      title: 'WhatsApp — Recorrido Endos',
      description: 'Número con código de país, ej. 523312345678. Se usa en el botón "Agenda Recorrido" de Endos.',
      type: 'string',
    }),
    defineField({
      name: 'whatsappCuidare',
      title: 'WhatsApp — Recorrido Cuidare',
      description: 'Número con código de país. Se usa en el botón "Agenda Recorrido" de Cuidare.',
      type: 'string',
    }),
  ],
  preview: {
    prepare: () => ({ title: 'Onkimia Doctors — Ajustes' }),
  },
});
