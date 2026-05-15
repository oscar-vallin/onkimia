import { defineField, defineType } from 'sanity';
import { CaseIcon } from '@sanity/icons';
import { localizedString, localizedText } from '../lib/localization';

export const AREAS = [
  'cuentas-por-pagar',
  'facturacion',
  'tesoreria',
  'boutique',
  'cobranza',
  'cotizaciones',
  'desarrollo-organizacional',
  'servicios-generales',
  'mercadotecnia',
  'tecnologias-de-la-informacion',
  'enlace-con-aseguradoras',
  'direccion-operativa',
  'atencion-al-paciente',
  'atencion-medica',
  'enfermeria',
  'administracion',
  'sanidad-y-regulacion',
] as const;

export type AreaSlug = (typeof AREAS)[number];

export const jobPosting = defineType({
  name: 'jobPosting',
  title: 'Vacante',
  type: 'document',
  icon: CaseIcon,
  fields: [
    localizedString({
      name: 'title',
      title: 'Título de la vacante',
      description: 'Ej: "Contador Senior" / "Senior Accountant"',
      required: true,
    }),
    localizedText({
      name: 'description',
      title: 'Descripción del puesto',
      description: 'Responsabilidades, requisitos, etc.',
      rows: 6,
    }),
    defineField({
      name: 'city',
      title: 'Ciudad',
      type: 'string',
      options: {
        list: [
          { title: 'Guadalajara', value: 'guadalajara' },
          { title: 'Colima', value: 'colima' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'area',
      title: 'Área',
      type: 'string',
      options: {
        list: [
          { title: 'Cuentas por pagar', value: 'cuentas-por-pagar' },
          { title: 'Facturación', value: 'facturacion' },
          { title: 'Tesorería', value: 'tesoreria' },
          { title: 'Boutique', value: 'boutique' },
          { title: 'Cobranza', value: 'cobranza' },
          { title: 'Cotizaciones', value: 'cotizaciones' },
          { title: 'Desarrollo Organizacional', value: 'desarrollo-organizacional' },
          { title: 'Servicios Generales', value: 'servicios-generales' },
          { title: 'Mercadotecnia', value: 'mercadotecnia' },
          { title: 'Tecnologías de la Información', value: 'tecnologias-de-la-informacion' },
          { title: 'Enlace con Aseguradoras', value: 'enlace-con-aseguradoras' },
          { title: 'Dirección Operativa', value: 'direccion-operativa' },
          { title: 'Atención al Paciente', value: 'atencion-al-paciente' },
          { title: 'Atención Médica', value: 'atencion-medica' },
          { title: 'Enfermería', value: 'enfermeria' },
          { title: 'Administración', value: 'administracion' },
          { title: 'Sanidad y Regulación', value: 'sanidad-y-regulacion' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isActive',
      title: '¿Activa?',
      description: 'Desactivar para ocultar de la página sin eliminar.',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'publishedAt',
      title: 'Fecha de publicación',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'closingDate',
      title: 'Fecha de cierre (opcional)',
      description: 'Si está vacía, la vacante no expira automáticamente.',
      type: 'datetime',
    }),
    defineField({
      name: 'odooRef',
      title: 'Referencia Odoo (futuro)',
      description: 'ID en Odoo HR cuando se conecte. NO llenar manualmente.',
      type: 'string',
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: 'title.es',
      city: 'city',
      area: 'area',
      isActive: 'isActive',
    },
    prepare({
      title,
      city,
      area,
      isActive,
    }: {
      title?: string;
      city?: string;
      area?: string;
      isActive?: boolean;
    }) {
      const cityLabel = city === 'guadalajara' ? 'GDL' : 'Colima';
      return {
        title: `${title || 'Sin título'}${!isActive ? ' (inactiva)' : ''}`,
        subtitle: `${cityLabel} · ${area || 'sin área'}`,
      };
    },
  },
  orderings: [
    {
      title: 'Más recientes primero',
      name: 'publishedDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
});
