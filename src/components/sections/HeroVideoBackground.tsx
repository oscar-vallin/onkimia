'use client';

import { useEffect, useRef, useState } from 'react';

export interface HeroVideoSource {
  src: string;
  type: string; // e.g. 'video/webm', 'video/mp4'
}

interface HeroVideoBackgroundProps {
  sources: HeroVideoSource[];
  /** Native <video poster> — optional. There's no static image behind this
   *  component anymore (removed per client request, see module doc), so
   *  leave this unset unless a caller has a specific frame it wants shown
   *  while the video buffers; it stays invisible either way until `ready`
   *  flips (see the opacity logic below). */
  poster?: string;
  className?: string;
}

/**
 * Muted looping background video layered over the hero's static poster image.
 *
 * MAX-QUALITY MODE — explicit client direction (2026-08-28): visual fidelity
 * is the priority for this video over Core Web Vitals / load time, no
 * connection-based gating or load-deferral. `sources` points at a ~70 MB
 * re-encode (H.264, 1920×1080, CRF 14 — near-lossless, visually verified
 * against the untouched original frame-by-frame) rather than the raw ~160 MB
 * source: GitHub hard-blocks any pushed file over 100 MB, so the raw file
 * cannot live in this repo at all. CRF 14 was chosen as the highest quality
 * that still leaves a real safety margin under that cap (~30 MB), not as an
 * arbitrary compromise — see the .gitignore history / PR discussion for the
 * size table across CRF values that justified it. Don't push this lower
 * (e.g. CRF 12, ~112 MB) without confirming the resulting file is under
 * 100 MB — it will block every future `git push` if not.
 *
 * No static fallback image anymore (removed per client request, 2026-08-28)
 * — the hero's own bg-primary color fills the gap before the video is ready
 * instead. This means the LCP element for this section is no longer an
 * image; expect the LCP metric itself to shift (likely to the h1, or to
 * nothing meaningful until the video paints) as a direct, accepted
 * consequence of that request layered on top of the max-quality mandate
 * above. Fades in (700ms) once the browser fires `playing`; with a file
 * this size that can take a while on anything but a fast connection, during
 * which the section is a flat color — that's expected, not a bug.
 *
 * The one guardrail kept on purpose: prefers-reduced-motion. That's not a
 * performance optimization, it's an accessibility requirement (WCAG 2.2.2 —
 * some visitors get vestibular symptoms from autoplaying motion) unrelated
 * to load time or file size, so it stays regardless of the quality mandate.
 */
export function HeroVideoBackground({ sources, poster, className = '' }: HeroVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  // Starts closed (no <source> rendered at all, not just "not autoplayed")
  // so the browser's native autoplay never gets a chance to start before
  // React can run the reduced-motion check below. The effect that opens
  // this runs synchronously on mount with no artificial delay — this is an
  // accessibility gate, not the removed bandwidth/idle-callback deferral.
  const [canPlay, setCanPlay] = useState(false);

  useEffect(() => {
    if (sources.length === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setCanPlay(true);
  }, [sources.length]);

  useEffect(() => {
    if (!canPlay) return;
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {
      // Autoplay blocked by the browser — the section's flat bg-primary
      // color stays visible (no static image fallback anymore). Acceptable
      // degrade, nothing to surface to the user.
    });
  }, [canPlay]);

  if (sources.length === 0 || !canPlay) return null;

  return (
    <video
      ref={videoRef}
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${ready ? 'opacity-100' : 'opacity-0'} ${className}`}
      muted
      loop
      playsInline
      autoPlay
      preload="auto"
      poster={poster}
      aria-hidden="true"
      onPlaying={() => setReady(true)}
    >
      {sources.map((s) => <source key={s.src} src={s.src} type={s.type} />)}
    </video>
  );
}
