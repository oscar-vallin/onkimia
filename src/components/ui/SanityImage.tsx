'use client';

import Image, { type ImageProps } from 'next/image';
import { sanityLoader } from '@/lib/sanity/imageLoader';

type SanityImageProps = Omit<ImageProps, 'loader'>;

// placeholder and blurDataURL are discarded — the custom Sanity loader prevents
// next/image from determining cache state before showing the placeholder, which
// causes a gray flash on every client-side navigation even for cached images.
// "empty" (transparent) defers to the container's own background instead.
export function SanityImage({ placeholder: _placeholder, blurDataURL: _blurDataURL, ...props }: SanityImageProps) {
  return <Image {...props} placeholder="empty" blurDataURL={undefined} loader={sanityLoader} />;
}
