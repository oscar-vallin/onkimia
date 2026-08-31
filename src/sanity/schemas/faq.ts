import { defineField, defineType } from 'sanity';

export const faq = defineType({
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    defineField({
      name: 'question',
      title: 'Question',
      type: 'object',
      fields: [
        { name: 'es', title: 'Spanish', type: 'string' },
        { name: 'en', title: 'English', type: 'string' },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'answer',
      title: 'Answer',
      type: 'object',
      fields: [
        { name: 'es', title: 'Spanish', type: 'text' },
        { name: 'en', title: 'English', type: 'text' },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'doctor',
      title: 'Doctor',
      type: 'reference',
      to: [{ type: 'doctor' }],
      description: 'Doctor who answers this question',
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'General', value: 'general' },
          { title: 'Treatment', value: 'treatment' },
          { title: 'Prevention', value: 'prevention' },
          { title: 'Services', value: 'services' },
          { title: 'Insurance', value: 'insurance' },
        ],
      },
      initialValue: 'general',
    }),
    defineField({
      name: 'page',
      title: 'Display on Page',
      type: 'string',
      options: {
        list: [
          { title: 'About (Nosotros)', value: 'about' },
          { title: 'Services (Servicios)', value: 'services' },
          { title: 'Endos', value: 'endos' },
          { title: 'Cuidare', value: 'cuidare' },
          { title: 'All Pages', value: 'all' },
        ],
      },
      initialValue: 'about',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Lower numbers appear first',
      validation: (Rule) => Rule.min(0),
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'question.es',
      subtitle: 'category',
      doctor: 'doctor.fullName',
    },
    prepare({ title, subtitle, doctor }) {
      return {
        title: title || 'Untitled',
        subtitle: `${subtitle || 'general'} ${doctor ? `• ${doctor}` : ''}`,
      };
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Category',
      name: 'categoryAsc',
      by: [{ field: 'category', direction: 'asc' }],
    },
  ],
});
