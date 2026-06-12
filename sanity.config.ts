import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './src/sanity/schemas';
import { apiVersion, dataset, projectId } from './src/sanity/env';

const SINGLETON_TYPES = ['siteSettings', 'privacyPolicy', 'aboutPage'] as const;

export default defineConfig({
  name: 'onkimia',
  title: 'Onkimia CMS',
  projectId,
  dataset,
  basePath: '/studio',

  schema: {
    types: schemaTypes,
  },

  document: {
    // Remove singletons from the global "New document" button — they already
    // live at a fixed documentId in the structure, so creating a second one
    // would cause a conflict and trigger the "Read Only" lock.
    newDocumentOptions: (prev, { creationContext }) => {
      if (creationContext.type === 'global') {
        return prev.filter(
          (item) => !(SINGLETON_TYPES as readonly string[]).includes(item.templateId)
        );
      }
      return prev;
    },
    // For singleton document types, keep publish/edit but remove delete/duplicate
    // so editors can always save changes.
    actions: (prev, { schemaType }) => {
      if ((SINGLETON_TYPES as readonly string[]).includes(schemaType)) {
        return prev.filter(
          ({ action }) => action !== 'delete' && action !== 'duplicate'
        );
      }
      return prev;
    },
  },

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Contenido')
          .items([
            // Singleton: Site Settings
            S.listItem()
              .title('Configuración del sitio')
              .id('siteSettings')
              .child(
                S.document()
                  .schemaType('siteSettings')
                  .documentId('siteSettings')
                  .views([S.view.form()])
              ),
            S.divider(),
            // Clínicas (filtradas)
            S.listItem()
              .title('Clínicas')
              .schemaType('clinic')
              .child(S.documentTypeList('clinic').title('Clínicas')),
            S.listItem()
              .title('Doctores')
              .schemaType('doctor')
              .child(S.documentTypeList('doctor').title('Doctores')),
            S.listItem()
              .title('Servicios')
              .schemaType('service')
              .child(S.documentTypeList('service').title('Servicios')),
            S.listItem()
              .title('Aseguradoras')
              .schemaType('insurance')
              .child(S.documentTypeList('insurance').title('Aseguradoras')),
            S.divider(),
            S.listItem()
              .title('Procedimientos')
              .schemaType('procedure')
              .child(S.documentTypeList('procedure').title('Procedimientos')),
            S.listItem()
              .title('Vacantes')
              .schemaType('jobPosting')
              .child(S.documentTypeList('jobPosting').title('Vacantes')),
            S.divider(),
            // Singleton: Aviso de Privacidad
            S.listItem()
              .title('Aviso de Privacidad')
              .id('privacyPolicy')
              .child(
                S.document()
                  .schemaType('privacyPolicy')
                  .documentId('privacyPolicy')
                  .views([S.view.form()])
              ),
            // Singleton: Página Nosotros
            S.listItem()
              .title('Página Nosotros')
              .id('aboutPage')
              .child(
                S.document()
                  .schemaType('aboutPage')
                  .documentId('aboutPage')
                  .views([S.view.form()])
              ),
          ]),
    }),
    // Vision: probador de queries GROQ en dev
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});