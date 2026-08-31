import Image, { type ImageProps } from 'next/image';

// The loader is configured globally via next.config.ts `images.loaderFile`
// (src/lib/sanity/imageLoader.ts) — this component no longer needs to pass
// a loader function as a prop, which is what forced the 'use client'
// boundary before (a function prop crosses the server/client serialization
// boundary). Every call site (PageHero, Wellness, DoctorCard,
// ConveniosEditorial, ...) can now render on the server.
type SanityImageProps = ImageProps;

// placeholder and blurDataURL are discarded — the custom Sanity loader prevents
// next/image from determining cache state before showing the placeholder, which
// causes a gray flash on every client-side navigation even for cached images.
// "empty" (transparent) defers to the container's own background instead.
export function SanityImage({ placeholder: _placeholder, blurDataURL: _blurDataURL, ...props }: SanityImageProps) {
  return <Image {...props} placeholder="empty" blurDataURL={undefined} />;
}
