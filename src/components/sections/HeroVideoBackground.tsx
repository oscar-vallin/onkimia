'use client';

import { useEffect, useRef, useState } from 'react';

export interface HeroVideoSource {
  src: string;
  type: string; // e.g. 'video/webm', 'video/mp4'
}

interface HeroVideoBackgroundProps {
  sources: HeroVideoSource[];
  /** Same desktop hero image used by the <picture> behind this component —
   *  set as the native <video poster> so the frame the browser shows while
   *  buffering (once the element mounts) still matches the brand's hero
   *  shot. The caller's own <picture> underneath is what's actually visible
   *  before that, and remains the real LCP element either way. */
  poster?: string;
  className?: string;
}

/**
 * Muted looping background video layered over the hero's static poster image.
 *
 * MAX-QUALITY MODE — explicit client direction (2026-08-28): visual fidelity
 * is the absolute priority for this video, even at the cost of Core Web
 * Vitals / load time. `sources` today points at the client's raw, unedited
 * footage (~160 MB, untouched bitrate) — no re-encode, no defer, no
 * connection-based gating. Do not reintroduce compression, resolution
 * downscaling, or load-deferral here without going back to the client first;
 * this file previously served a visually-verified 5.8 MB re-encode of the
 * same footage and was deliberately reverted to the original at their
 * request. See git history for that version if this ever needs to be
 * revisited.
 *
 * The <picture>/<img> rendered by the caller (HeroHome) stays the LCP
 * element (fetchPriority="high", matching <link rel="preload">, responsive
 * art-direction a single <video poster> URL can't express) — this component
 * only paints on top of it. It fades in (700ms) once the browser fires
 * `playing`; with a file this size that can take a while on anything but a
 * fast connection, during which the poster is what's visible — that's
 * expected, not a bug, given the trade-off above.
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
      // Autoplay blocked by the browser — the static poster stays visible.
      // Acceptable degrade, nothing to surface to the user.
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
