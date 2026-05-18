import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './src/sanity/schemas';
import { apiVersion, dataset, projectId } from './src/sanity/env';

export default defineConfig({
  name: 'onkimia',
  title: 'Onkimia CMS',
  projectId,
  dataset,
  basePath: '/studio',

  schema: {
    types: schemaTypes,
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
              ),
            // Singleton: Página Nosotros
            S.listItem()
              .title('Página Nosotros')
              .id('aboutPage')
              .child(
                S.document()
                  .schemaType('aboutPage')
                  .documentId('aboutPage')
              ),
          ]),
    }),
    // Vision: probador de queries GROQ en dev
    visionTool({ defaultApiVersion: apiVersion }),
  ],
});