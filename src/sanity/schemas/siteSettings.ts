import { defineField, defineType } from 'sanity';
import { CogIcon } from '@sanity/icons';
import { localizedString } from '../lib/localization';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Configuración del sitio',
  type: 'document',
  icon: CogIcon,
  groups: [
    { name: 'heroes', title: 'Imágenes Hero', default: true },
    { name: 'branding', title: 'Marca' },
    { name: 'sections', title: 'Secciones internas' },
    { name: 'contact', title: 'Contacto y social' },
  ],
  fields: [
    // ─── BRANDING ───────────────────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Nombre del sitio',
      type: 'string',
      group: 'branding',
      initialValue: 'Onkimia',
      validation: (Rule) => Rule.required(),
    }),
    localizedString({
      name: 'tagline',
      title: 'Tagline / Eslogan',
      description: 'Frase corta de marca (usada en metadata y hero)',
      required: true,
      // @ts-expect-error — localizedString wrapper doesn't pass through `group`
      group: 'branding',
    }),
    defineField({
      name: 'logo',
      title: 'Logo principal',
      type: 'image',
      group: 'branding',
      description: 'SVG preferentemente. Si es PNG, mínimo 2x retina.',
      options: { accept: 'image/svg+xml,image/png' },
    }),
    defineField({
      name: 'logoDark',
      title: 'Logo versión oscura',
      type: 'image',
      group: 'branding',
      description: 'Para fondos claros (header). Si no se sube, se usa el principal.',
      options: { accept: 'image/svg+xml,image/png' },
    }),

    // ─── HERO IMAGES ────────────────────────────────────────────────────────
    defineField({
      name: 'homeHeroImage',
      title: 'Hero — Home',
      type: 'image',
      group: 'heroes',
      description: 'Imagen principal del Home. También se usa como fallback en todas las páginas.',
      options: { hotspot: true },
      validation: (Rule) => Rule.required().error('La imagen del hero es necesaria'),
    }),
    defineField({
      name: 'homeHeroDescription',
      title: 'Descripción Hero del Home',
      type: 'object',
      group: 'heroes',
      description: 'Texto que aparece bajo el tagline en el hero del Home.',
      fields: [
        defineField({ name: 'es', title: 'Español', type: 'string' }),
        defineField({ name: 'en', title: 'English', type: 'string' }),
      ],
    }),
    defineField({
      name: 'aboutHeroImage',
      title: 'Hero — Nosotros',
      type: 'image',
      group: 'heroes',
      description: 'Imagen de la página /nosotros. Si está vacía, se usa la del Home.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'serviciosHeroImage',
      title: 'Hero — Servicios',
      type: 'image',
      group: 'heroes',
      description: 'Imagen de la página /servicios. Si está vacía, se usa la del Home.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'endosHeroImage',
      title: 'Hero — Endos',
      type: 'image',
      group: 'heroes',
      description: 'Imagen de la unidad Endos. Si está vacía, se usa la del Home.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'cuidareHeroImage',
      title: 'Hero — Cuidare',
      type: 'image',
      group: 'heroes',
      description: 'Imagen de la unidad Cuidare. Si está vacía, se usa la del Home.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'doctorsHeroImage',
      title: 'Hero — Onkimia Doctors',
      type: 'image',
      group: 'heroes',
      description: 'Imagen de la página de afiliación médica (B2B). Si está vacía, se usa la del Home.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'contactHeroImage',
      title: 'Hero — Contacto',
      type: 'image',
      group: 'heroes',
      description: 'Imagen de la página /contacto. Si está vacía, se usa la del Home.',
      options: { hotspot: true },
    }),

    // ─── SECTION IMAGES ─────────────────────────────────────────────────────
    defineField({
      name: 'processImage',
      title: 'Imagen del Proceso de Evaluación',
      type: 'image',
      group: 'sections',
      description: 'Imagen sticky de la sección "Una mirada completa a tu salud" en Home. Vertical 4:5, mín. 1200×1500px.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'proceduresBgImage',
      title: 'Fondo — Carrusel de Procedimientos (Home)',
      type: 'image',
      group: 'sections',
      description: 'Fondo oscuro del carrusel "Estudios y procedimientos". 1920×1080px, JPG oscuro.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'endosSafetyImage',
      title: 'Imagen "Seguridad y confianza" (Endos)',
      type: 'image',
      group: 'sections',
      description: 'Foto del consultorio o sala de procedimientos para la sección de confianza en /endos.',
      options: { hotspot: true },
    }),
    defineField({
      name: 'cuidareRadiologyImage',
      title: 'Fondo — Radiología Intervencionista (Cuidare)',
      type: 'image',
      group: 'sections',
      description: 'Imagen de fondo oscura para la sección de procedimientos guiados por ultrasonido en /cuidare.',
      options: { hotspot: true },
    }),

    // ─── CONTACT & SOCIAL ───────────────────────────────────────────────────
    defineField({
      name: 'socialMedia',
      title: 'Redes sociales',
      type: 'object',
      group: 'contact',
      fields: [
        defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
        defineField({ name: 'facebook', title: 'Facebook URL', type: 'url' }),
        defineField({ name: 'twitter', title: 'X (Twitter) URL', type: 'url' }),
      ],
    }),
    defineField({
      name: 'jobBoardEmail',
      title: 'Email Bolsa de Trabajo',
      type: 'string',
      group: 'contact',
      description: 'Email que recibe postulaciones (default: eortega@onkimia.com)',
      initialValue: 'eortega@onkimia.com',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'whatsappCommercial',
      title: 'WhatsApp Comercial (Onkimia Doctors)',
      type: 'string',
      group: 'contact',
      description: 'Número para "Únete ahora" en página de Onkimia Doctors. Solo dígitos.',
      validation: (Rule) =>
        Rule.regex(/^\d+$/, { name: 'whatsapp-digits' }).error('Solo dígitos, sin + ni espacios'),
    }),
    defineField({
      name: 'appDownloadUrl',
      title: 'URL de descarga App Onkimia',
      type: 'url',
      group: 'contact',
      description: 'Link a App Store, Play Store o landing de descarga. Si está vacío, la sección se oculta.',
      validation: (Rule) => Rule.uri({ scheme: ['http', 'https'] }),
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare({ title }) {
      return {
        title: title || 'Configuración del sitio',
        subtitle: 'Settings globales',
      };
    },
  },
});
