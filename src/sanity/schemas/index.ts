import { type SchemaTypeDefinition } from 'sanity';
import { siteSettings } from './siteSettings';
import { clinic } from './clinic';
import { doctor } from './doctor';
import { testimonial } from './testimonial';
import { faq } from './faq';
import { service } from './service';
import { insurance } from './insurance';
import { jobPosting } from './jobPosting';
import { privacyPolicy } from './privacyPolicy';
import { aboutPage } from './aboutPage';
import { procedure } from './procedure';
import { onkimiaDocsSettings } from './onkimiaDocsSettings';

export const schemaTypes: SchemaTypeDefinition[] = [
  // Singletons
  siteSettings,
  privacyPolicy,
  aboutPage,
  onkimiaDocsSettings,
  // Document types
  clinic,
  doctor,
  testimonial,
  faq,
  service,
  insurance,
  jobPosting,
  procedure,
];
