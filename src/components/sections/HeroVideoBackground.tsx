'use client';

import { useEffect, useState } from 'react';
import { useSeamlessVideo } from '@/hooks/useSeamlessVideo';

interface HeroVideoBackgroundProps {
  /** HLS manifest (.m3u8) — see useSeamlessVideo.ts for the resolution order. */
  hlsSrc: string;
  /** Progressive MP4 (+faststart) fallback for browsers with neither native
   *  HLS nor MSE, or when hls.js hits an unrecoverable error. */
  fallbackSrc: string;
  className?: string;
}

/**
 * Muted looping background video — HLS fMP4 over MSE (hls.js) or native HLS
 * (Safari), with a progressive MP4 as the last-resort fallback. See
 * useSeamlessVideo.ts for the full playback mechanics and
 * scripts/build-hero-hls.sh for how the asset itself is produced.
 *
 * ARCHITECTURAL CONTEXT (2026-09, supersedes the double-buffered
 * segment-swapping approach): switching a <video>'s `src` between
 * independent MP4 files resets `readyState` to HAVE_NOTHING and destroys
 * the compositor layer on every boundary — a black frame every ~4-12s, no
 * matter how well the next file was preloaded. HLS fMP4 gives every
 * fragment a shared init segment appended to a single SourceBuffer, so the
 * decoder configures once and never sees a boundary — there's no transition
 * to smooth over because the transition doesn't exist. A real ABR ladder
 * (multiple bitrate renditions) was evaluated and rejected: this is a
 * single fixed-quality rendition on purpose, so hls.js's adaptive-bitrate
 * machinery is present but never has more than one level to choose from.
 *
 * No static fallback image behind this — removed per explicit client
 * request and deliberately NOT reintroduced with this migration. The
 * hero's own bg-primary color fills the gap until the video's first frame
 * is actually composited (see the rVFC-based `ready` signal in the hook).
 *
 * The one guardrail kept on purpose: prefers-reduced-motion. Not a
 * performance optimization — it's an accessibility requirement (WCAG
 * 2.2.2: some visitors get vestibular symptoms from autoplaying motion) —
 * so it stays regardless of how the video is delivered. The component
 * renders null on the very first render, before the media query has even
 * been read, specifically so the video element never mounts (and nothing
 * starts downloading) ahead of knowing the answer.
 */
export function HeroVideoBackground({ hlsSrc, fallbackSrc, className = '' }: HeroVideoBackgroundProps) {
  const hasSource = hlsSrc !== '' && fallbackSrc !== '';
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!hasSource) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setEnabled(true);
  }, [hasSource]);

  const { videoRef, ready } = useSeamlessVideo({ hlsSrc, fallbackSrc, enabled });

  if (!enabled) return null;

  return (
    <video
      ref={videoRef}
      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${ready ? 'opacity-100' : 'opacity-0'} ${className}`}
      muted
      loop
      playsInline
      preload="auto"
      disablePictureInPicture
      disableRemotePlayback
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
