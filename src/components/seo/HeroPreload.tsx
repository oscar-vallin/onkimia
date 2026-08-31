interface HeroPreloadProps {
  /** Basename under /public/heros/ — e.g. "services" for services-hero-{desktop,mobile}.webp */
  name: string;
}

// Preloads the art-directed hero pair PageHero.tsx renders via <picture>.
// The (min-width: 768px) / (max-width: 767px) split must mirror PageHero's
// own <source media="(min-width: 768px)"> exactly, or the browser preloads
// a variant the page never actually requests.
export function HeroPreload({ name }: HeroPreloadProps) {
  return (
    <>
      <link rel="preload" as="image" href={`/heros/${name}-hero-desktop.webp`} type="image/webp" media="(min-width: 768px)" fetchPriority="high" />
      <link rel="preload" as="image" href={`/heros/${name}-hero-mobile.webp`}  type="image/webp" media="(max-width: 767px)" fetchPriority="high" />
    </>
  );
}
