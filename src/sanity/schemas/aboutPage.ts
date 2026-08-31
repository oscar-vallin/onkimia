import { defineField, defineType } from 'sanity';
import { UsersIcon } from '@sanity/icons';
import { localizedString, localizedText } from '../lib/localization';

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'Página Nosotros',
  type: 'document',
  icon: UsersIcon,
  fields: [
    // ─── SECTION IMAGES ─────────────────────────────────────────────────────
    defineField({
      name: 'enfoque360Image',
      title: 'Imagen "Cuerpo, mente y cuidado integral"',
      type: 'image',
      description: 'Foto de la clínica o pasillo. Vertical 3:4 o cuadrada, JPG <250KB.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'supportGroupImage',
      title: 'Imagen — Grupo de Apoyo',
      type: 'image',
      description: 'Foto para la tarjeta "Grupo de apoyo". 16:9 o 3:2, JPG <200KB.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'awareImage',
      title: 'Imagen — Onkimia Aware',
      type: 'image',
      description: 'Foto para la tarjeta "Onkimia Aware". 16:9 o 3:2, JPG <200KB.',
      options: { hotspot: true },
    }),

    // ─── TESTIMONIALS ───────────────────────────────────────────────────────
    localizedString({ name: 'testimonialsTitle', title: 'Testimoniales — Título de la sección' }),
    localizedString({ name: 'testimonialsSubtitle', title: 'Testimoniales — Subtítulo' }),
    defineField({
      name: 'reikyImage',
      title: 'Testimoniales — Imagen lateral',
      type: 'image',
      description: 'Imagen decorativa junto al carrusel de testimoniales. Vertical 4:5, JPG <200KB.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'aboutTestimonials',
      title: 'Testimoniales — Entradas del carrusel',
      type: 'array',
      description: 'Testimoniales que aparecen en el carrusel de la sección "Historias que inspiran". Arrastra para reordenar.',
      of: [
        {
          type: 'object',
          name: 'aboutTestimonialItem',
          fields: [
            defineField({
              name: 'photo',
              title: 'Foto del paciente',
              type: 'image',
              description: 'Retrato cuadrado, mín. 200×200px.',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'name',
              title: 'Nombre',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            localizedString({ name: 'role', title: 'Rol / Descripción corta', description: 'Ej: "Paciente — Linfoma en remisión"' }),
            localizedString({ name: 'testimonial', title: 'Texto del testimonio', required: true }),
          ],
          preview: {
            select: { title: 'name', subtitle: 'role.es', media: 'photo' },
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            prepare({ title, subtitle, media }: { title?: string; subtitle?: string; media?: any }) {
              return { title: title || 'Sin nombre', subtitle: subtitle || '', media };
            },
          },
        },
      ],
      validation: (Rule) => Rule.max(10),
    }),

    // ─── FAQ WITH DOCTORS ────────────────────────────────────────────────────
    defineField({
      name: 'faqItems',
      title: 'Preguntas frecuentes',
      type: 'array',
      description: 'Hasta 6 preguntas respondidas por doctores.',
      validation: (Rule) => Rule.max(6),
      of: [
        {
          type: 'object',
          name: 'faqItem',
          fields: [
            localizedString({ name: 'question', title: 'Pregunta', required: true }),
            localizedText({ name: 'answer', title: 'Respuesta', rows: 5, required: true }),
            defineField({
              name: 'doctor',
              title: 'Doctor que responde',
              type: 'reference',
              to: [{ type: 'doctor' }],
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {
              title: 'question.es',
              subtitle: 'doctor.fullName',
            },
            prepare({ title, subtitle }: { title?: string; subtitle?: string }) {
              return {
                title: title || 'Sin pregunta',
                subtitle: subtitle ? `Dr. ${subtitle}` : 'Sin doctor asignado',
              };
            },
          },
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Página Nosotros', subtitle: 'Documento singleton' };
    },
  },
});
