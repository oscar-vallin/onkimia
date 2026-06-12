import { defineField, defineType } from 'sanity';
import { CogIcon } from '@sanity/icons';
import { localizedString } from '../lib/localization';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Configuración del sitio',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Nombre del sitio',
      type: 'string',
      initialValue: 'Onkimia',
      validation: (Rule) => Rule.required(),
    }),
    localizedString({
      name: 'tagline',
      title: 'Tagline / Eslogan',
      description: 'Frase corta de marca (usada en metadata y hero)',
      required: true,
    }),
    defineField({
      name: 'logo',
      title: 'Logo principal',
      type: 'image',
      description: 'SVG preferentemente. Si es PNG, mínimo 2x retina.',
      options: { accept: 'image/svg+xml,image/png' },
    }),
    defineField({
      name: 'logoDark',
      title: 'Logo versión oscura',
      type: 'image',
      description: 'Para fondos claros (header). Si no se sube, se usa el principal.',
      options: { accept: 'image/svg+xml,image/png' },
    }),
    defineField({
      name: 'aboutHeroImage',
      title: 'Imagen Hero de Nosotros',
      description:
        'Imagen principal de la página /nosotros. Si está vacía, se usa la del Home.',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'doctorsHeroImage',
      title: 'Imagen Hero de Onkimia Doctors',
      description: 'Imagen para la página de afiliación médica (B2B). Si está vacía, se usa la del Home.',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'cuidareHeroImage',
      title: 'Imagen Hero de Cuidare',
      description: 'Imagen de la unidad Cuidare. Si está vacía, se usa la del Home.',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'endosHeroImage',
      title: 'Imagen Hero de Endos',
      description: 'Imagen de la unidad Endos. Si está vacía, se usa la del Home.',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'endosSafetyImage',
      title: 'Imagen "Seguridad y confianza" de Endos',
      description: 'Foto del consultorio o sala de procedimientos. Opcional.',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'socialMedia',
      title: 'Redes sociales',
      type: 'object',
      fields: [
        defineField({
          name: 'instagram',
          title: 'Instagram URL',
          type: 'url',
        }),
        defineField({
          name: 'facebook',
          title: 'Facebook URL',
          type: 'url',
        }),
        defineField({
          name: 'twitter',
          title: 'X (Twitter) URL',
          type: 'url',
        }),
      ],
    }),
    defineField({
      name: 'jobBoardEmail',
      title: 'Email Bolsa de Trabajo',
      type: 'string',
      description: 'Email que recibe postulaciones (default: eortega@onkimia.com)',
      initialValue: 'eortega@onkimia.com',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'whatsappCommercial',
      title: 'WhatsApp Comercial (Onkimia Doctors)',
      description: 'Número para "Únete ahora" en página de Onkimia Doctors. Solo dígitos.',
      type: 'string',
      validation: (Rule) =>
        Rule.regex(/^\d+$/, { name: 'whatsapp-digits' }).error(
          'Solo dígitos, sin + ni espacios'
        ),
    }),
    defineField({
      name: 'appDownloadUrl',
      title: 'URL de descarga App Onkimia',
      description:
        'Link a App Store, Play Store o landing de descarga. Si está vacío, la sección se oculta.',
      type: 'url',
      validation: (Rule) =>
        Rule.uri({
          scheme: ['http', 'https'],
        }),
    }),
    defineField({
      name: 'homeHeroImage',
      title: 'Imagen Hero del Home',
      description: 'Imagen principal de fondo del Home. Recomendado: 2400×1600px, formato JPG/PNG, <500KB pre-optimizada.',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (Rule) =>
        Rule.required().error('La imagen del hero es necesaria'),
    }),
    localizedString({
      name: 'homeHeroDescription',
      title: 'Descripción Hero del Home',
      description: 'Texto descriptivo que aparece debajo del tagline en el hero del home.',
      required: false,
    }),
    defineField({
      name: 'processImage',
      title: 'Imagen del Proceso de Evaluación',
      description: 'Imagen sticky de la sección "Una mirada completa a tu salud". Recomendado: vertical 4:5, mínimo 1200×1500px, JPG optimizado <300KB.',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'proceduresBgImage',
      title: 'Imagen de fondo — Carrusel de Procedimientos',
      description: 'Fondo oscuro del carrusel "Estudios y procedimientos". Recomendado: 1920×1080px, JPG oscuro <200KB.',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
    prepare({ title }) {
      return {
        title: title || 'Configuración del sitio',
        subtitle: 'Settings globales',
      };
    },
  },
});