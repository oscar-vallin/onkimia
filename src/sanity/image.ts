import { createImageUrlBuilder } from '@sanity/image-url';
import type { SanityImageSource } from '@sanity/image-url';
import { dataset, projectId } from './env';

const builder = createImageUrlBuilder({ projectId, dataset });

/**
 * Builder de URL para imágenes de Sanity.
 *
 * Uso:
 *   urlFor(image).width(800).height(600).url()
 *   urlFor(image).width(800).format('webp').url()
 */
export const urlFor = (source: SanityImageSource) => builder.image(source);