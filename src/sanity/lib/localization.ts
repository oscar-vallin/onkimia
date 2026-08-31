import { defineField } from 'sanity';

export const localizedString = (config: {
  name: string;
  title: string;
  description?: string;
  required?: boolean;
}) =>
  defineField({
    name: config.name,
    title: config.title,
    description: config.description,
    type: 'object',
    fields: [
      defineField({
        name: 'es',
        title: 'Español',
        type: 'string',
        validation: config.required
          ? (Rule) => Rule.required()
          : undefined,
      }),
      defineField({
        name: 'en',
        title: 'English',
        type: 'string',
        validation: config.required
          ? (Rule) => Rule.required()
          : undefined,
      }),
    ],
    options: {
      collapsible: false,
      columns: 2, // Lado a lado para edición cómoda
    },
  });

/**
 * Helper para texto largo (textarea) localizado.
 */
export const localizedText = (config: {
  name: string;
  title: string;
  description?: string;
  rows?: number;
  required?: boolean;
}) =>
  defineField({
    name: config.name,
    title: config.title,
    description: config.description,
    type: 'object',
    fields: [
      defineField({
        name: 'es',
        title: 'Español',
        type: 'text',
        rows: config.rows ?? 4,
        validation: config.required
          ? (Rule) => Rule.required()
          : undefined,
      }),
      defineField({
        name: 'en',
        title: 'English',
        type: 'text',
        rows: config.rows ?? 4,
        validation: config.required
          ? (Rule) => Rule.required()
          : undefined,
      }),
    ],
    options: {
      collapsible: false,
      columns: 2,
    },
  });

/**
 * Helper para portable text (rich text) localizado.
 */
export const localizedPortableText = (config: {
  name: string;
  title: string;
  description?: string;
}) =>
  defineField({
    name: config.name,
    title: config.title,
    description: config.description,
    type: 'object',
    fields: [
      defineField({
        name: 'es',
        title: 'Español',
        type: 'array',
        of: [{ type: 'block' }],
      }),
      defineField({
        name: 'en',
        title: 'English',
        type: 'array',
        of: [{ type: 'block' }],
      }),
    ],
  });

// The runtime helpers (getLocalized, LocalizedString, LocalizedText,
// Locale) live in src/lib/localization.ts. This module imports the
// `sanity` package (full Studio) — only schemas should consume it.