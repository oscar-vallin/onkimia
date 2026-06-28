import { type SchemaTypeDefinition } from 'sanity';
import { siteSettings } from './siteSettings';
import { doctor } from './doctor';
import { testimonial } from './testimonial';
import { faq } from './faq';
import { service } from './service';
import { insurance } from './insurance';
import { jobPosting } from './jobPosting';
import { privacyPolicy } from './privacyPolicy';
import { aboutPage } from './aboutPage';
import { procedure } from './procedure';
import { serviciosPage } from './serviciosPage';
import { endosPage } from './endosPage';
import { socioComercial } from './socioComercial';

export const schemaTypes: SchemaTypeDefinition[] = [
  // Singletons
  siteSettings,
  privacyPolicy,
  aboutPage,
  serviciosPage,
  endosPage,
  // Document types
  doctor,
  testimonial,
  faq,
  service,
  insurance,
  jobPosting,
  procedure,
  socioComercial,
];
