'use client';

import { useEffect, useRef, useState } from 'react';

export interface HeroVideoSource {
  src: string;
  type: string; // e.g. 'video/webm', 'video/mp4'
}

interface HeroVideoBackgroundProps {
  sources: HeroVideoSource[];
  /** Same desktop hero image used by the <picture> behind this component —
   *  passed to the native <video poster> as defense-in-depth, not as the
   *  primary LCP path (see HeroVideoBackground module doc). */
  poster?: string;
  className?: string;
}

/**
 * Muted looping background video layered over the hero's static poster image.
 *
 * The <picture>/<img> rendered by the caller (HeroHome) is — and must stay —
 * the actual LCP element: it already has fetchPriority="high", a matching
 * <link rel="preload">, and responsive art-direction (mobile portrait crop vs
 * desktop DPR-aware srcset) that a single native <video poster> URL cannot
 * express. This component never touches that; it only paints on top of it,
 * once conditions are favorable, then fades in.
 *
 * Loaded via next/dynamic({ ssr: false }) from HeroHome — same pattern as
 * WelcomeModalProvider — so it never renders on the server and never
 * competes with the critical HTML/image/font requests during first paint.
 *
 * Guardrails, in order:
 *  - Renders null outright if no `sources` are supplied — shipping this with
 *    an empty array is a complete no-op.
 *  - Skips the video for prefers-reduced-motion (static image only).
 *  - Skips it on confirmed constrained connections (Save-Data, 2G/3G) —
 *    `navigator.connection` is Chromium-only, so this only ever *removes*
 *    the video for visitors it can positively identify as constrained; it
 *    never blocks anyone else.
 *  - Defers the actual fetch to requestIdleCallback (rAF/setTimeout
 *    fallback for Safari), i.e. after the LCP paint window, not in parallel
 *    with it.
 *  - Only fades in (700ms) once the browser fires `playing` — if it never
 *    loads, errors, or autoplay is blocked, the poster stays and nothing
 *    visibly breaks.
 */
export function HeroVideoBackground({ sources, poster, className = '' }: HeroVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    if (sources.length === 0) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    type NavigatorConnection = { saveData?: boolean; effectiveType?: string };
    const connection = (navigator as Navigator & { connection?: NavigatorConnection }).connection;
    if (connection?.saveData) return;
    if (connection?.effectiveType && ['slow-2g', '2g', '3g'].includes(connection.effectiveType)) return;

    // requestIdleCallback is typed as non-optional in lib.dom (it's absent
    // only in Safari at runtime), so we feature-detect via optional chaining
    // rather than `in`/typeof narrowing on `window` itself.
    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(() => setShouldLoad(true));
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => setShouldLoad(true), 200);
    return () => window.clearTimeout(id);
  }, [sources.length]);

  useEffect(() => {
    if (!shouldLoad) return;
    const video = videoRef.current;
    if (!video) return;
    video.load();
    video.play().catch(() => {
      // Autoplay blocked — the static poster stays visible. Acceptable
      // degrade, nothing to surface to the user.
    });
  }, [shouldLoad]);

  if (sources.length === 0) return null;

  return (
    <video
      ref={videoRef}
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${ready ? 'opacity-100' : 'opacity-0'} ${className}`}
      muted
      loop
      playsInline
      autoPlay
      preload={shouldLoad ? 'auto' : 'none'}
      poster={poster}
      aria-hidden="true"
      onPlaying={() => setReady(true)}
    >
      {shouldLoad && sources.map((s) => <source key={s.src} src={s.src} type={s.type} />)}
    </video>
  );
}
