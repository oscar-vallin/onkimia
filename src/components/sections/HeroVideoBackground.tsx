'use client';

import { useEffect, useState } from 'react';
import { useSequentialVideoPlayback } from '@/hooks/useSequentialVideoPlayback';

interface HeroVideoBackgroundProps {
  /** Ordered list of segment URLs that together form one continuous clip —
   *  played back-to-back via double-buffered preloading, looping to the
   *  first after the last. A single-item array plays/loops that one file
   *  directly, same as before. */
  segments: string[];
  className?: string;
}

/**
 * Muted looping background video, chunked into sequential segments and
 * played via double-buffered preloading (see useSequentialVideoPlayback.ts
 * for the full mechanics) instead of one monolithic <video src>.
 *
 * ARCHITECTURAL CONTEXT (2026-08-30, supersedes the single-file approach):
 * the client wants uncompressed, maximum-fidelity footage without paying
 * for it as one atomic ~160 MB download. Real HLS (ffmpeg → .m3u8 + hls.js)
 * was evaluated and rejected: without multiple bitrate renditions — which
 * would mean re-encoding, explicitly out of bounds — it buys nothing over
 * plain progressive MP4 that this project doesn't already have (faststart,
 * Range support). What chunking DOES legitimately buy: the browser only
 * ever needs to fetch one ~13–25 MB segment before playback starts (instead
 * of committing to the full clip up front), and — as a load-bearing side
 * effect — every individual file stays comfortably under GitHub's 100 MB
 * per-file push limit at full, untouched bitrate. See
 * public/heros/segments/ and HeroSection.tsx for the actual file list.
 *
 * No static fallback image behind this (removed per prior client request) —
 * the hero's own bg-primary color fills the gap until the first segment is
 * actually playing.
 *
 * The one guardrail kept on purpose: prefers-reduced-motion. Not a
 * performance optimization — it's an accessibility requirement (WCAG
 * 2.2.2), unrelated to load time or file size, so it stays regardless of
 * the quality mandate above.
 */
export function HeroVideoBackground({ segments, className = '' }: HeroVideoBackgroundProps) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (segments.length === 0) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    setEnabled(true);
  }, [segments.length]);

  const { videoRefA, videoRefB, activeSlot, ready, onEndedA, onEndedB, onPlaying } =
    useSequentialVideoPlayback({ segments, enabled });

  if (segments.length === 0 || !enabled) return null;

  const base = `absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-out ${className}`;
  const visibleA = ready && activeSlot === 'A';
  const visibleB = ready && activeSlot === 'B';

  return (
    <>
      <video
        ref={videoRefA}
        className={`${base} ${visibleA ? 'opacity-100' : 'opacity-0'}`}
        muted
        playsInline
        aria-hidden="true"
        onEnded={onEndedA}
        onPlaying={onPlaying}
      />
      <video
        ref={videoRefB}
        className={`${base} ${visibleB ? 'opacity-100' : 'opacity-0'}`}
        muted
        playsInline
        aria-hidden="true"
        onEnded={onEndedB}
        onPlaying={onPlaying}
      />
    </>
  );
}
