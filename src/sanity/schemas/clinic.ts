import { defineField, defineType } from 'sanity';
import { HomeIcon } from '@sanity/icons';
import { localizedString, localizedText } from '../lib/localization';

export const clinic = defineType({
  name: 'clinic',
  title: 'Clínica',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'slug',
      title: 'Identificador (slug)',
      type: 'string',
      description: 'Usado en URLs y código. Solo lowercase, sin espacios. Ejemplos: "guadalajara", "colima"',
      validation: (Rule) =>
        Rule.required()
          .lowercase()
          .regex(/^[a-z-]+$/, {
            name: 'slug',
            invert: false,
          })
          .error('Solo letras minúsculas y guiones'),
    }),
    localizedString({
      name: 'name',
      title: 'Nombre de la clínica',
      description: 'Ej: "Onkimia Guadalajara"',
      required: true,
    }),
    localizedText({
      name: 'shortDescription',
      title: 'Descripción corta',
      description: 'Para meta tags y previews (máx 160 caracteres recomendado)',
      rows: 3,
    }),
    defineField({
      name: 'address',
      title: 'Dirección',
      type: 'object',
      fields: [
        defineField({
          name: 'street',
          title: 'Calle y número',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'neighborhood',
          title: 'Colonia',
          type: 'string',
        }),
        defineField({
          name: 'city',
          title: 'Ciudad',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'state',
          title: 'Estado',
          type: 'string',
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: 'postalCode',
          title: 'Código postal',
          type: 'string',
        }),
        defineField({
          name: 'country',
          title: 'País',
          type: 'string',
          initialValue: 'México',
        }),
      ],
    }),
    defineField({
      name: 'geo',
      title: 'Coordenadas geográficas',
      description: 'Para Schema.org MedicalClinic y Google Maps',
      type: 'object',
      fields: [
        defineField({
          name: 'lat',
          title: 'Latitud',
          type: 'number',
          validation: (Rule) => Rule.min(-90).max(90),
        }),
        defineField({
          name: 'lng',
          title: 'Longitud',
          type: 'number',
          validation: (Rule) => Rule.min(-180).max(180),
        }),
      ],
    }),
    defineField({
      name: 'phone',
      title: 'Teléfono',
      type: 'string',
      description: 'Formato internacional: +52XXXXXXXXXX',
    }),
    defineField({
      name: 'whatsapp',
      title: 'WhatsApp principal',
      type: 'string',
      description: 'Número sin espacios ni símbolos. Ej: 5213312345678',
      validation: (Rule) =>
        Rule.regex(/^\d+$/, { name: 'whatsapp-digits' }).error(
          'Solo dígitos, sin + ni espacios'
        ),
    }),
    defineField({
      name: 'whatsappEndos',
      title: 'WhatsApp Endos (opcional)',
      type: 'string',
      description: 'Si esta sede tiene unidad Endos, número específico. Si no, usa el principal.',
    }),
    defineField({
      name: 'whatsappCuidare',
      title: 'WhatsApp Cuidare (opcional)',
      type: 'string',
      description: 'Si esta sede tiene unidad Cuidare, número específico.',
    }),
    defineField({
      name: 'email',
      title: 'Email de contacto',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'hours',
      title: 'Horario de atención',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({
              name: 'days',
              title: 'Días',
              type: 'string',
              options: {
                list: [
                  { title: 'Lunes a Viernes', value: 'Mo-Fr' },
                  { title: 'Sábado', value: 'Sa' },
                  { title: 'Domingo', value: 'Su' },
                  { title: 'Lunes a Sábado', value: 'Mo-Sa' },
                  { title: 'Todos los días', value: 'Mo-Su' },
                ],
              },
            }),
            defineField({
              name: 'opens',
              title: 'Apertura',
              type: 'string',
              description: 'Formato 24h: 08:00',
            }),
            defineField({
              name: 'closes',
              title: 'Cierre',
              type: 'string',
              description: 'Formato 24h: 18:00',
            }),
          ],
          preview: {
            select: { days: 'days', opens: 'opens', closes: 'closes' },
            prepare({ days, opens, closes }) {
              return { title: `${days}: ${opens} - ${closes}` };
            },
          },
        },
      ],
    }),
    defineField({
      name: 'description',
      title: 'Descripción de la sede',
      description: 'Texto breve para el hero. Visible solo en página de sede.',
      type: 'object',
      fields: [
        { name: 'es', title: 'Español', type: 'text', rows: 3 },
        { name: 'en', title: 'English', type: 'text', rows: 3 },
      ],
    }),
    defineField({
      name: 'heroImage',
      title: 'Imagen Hero',
      type: 'image',
      description: 'Imagen principal de la página de esta clínica (mín 1920x1080)',
      options: { hotspot: true },
    }),
    defineField({
      name: 'isPrimary',
      title: '¿Es sede principal?',
      type: 'boolean',
      description: 'Marca esta opción para Guadalajara (sede default).',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'name.es',
      city: 'address.city',
      isPrimary: 'isPrimary',
      media: 'heroImage',
    },
    prepare({ title, city, isPrimary, media }) {
      return {
        title: title || 'Sin nombre',
        subtitle: `${city || '?'}${isPrimary ? ' · Sede principal' : ''}`,
        media,
      };
    },
  },
});