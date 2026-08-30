'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

interface UseSequentialVideoPlaybackOptions {
  /** Ordered list of segment URLs to play back-to-back, looping to the
   *  first once the last one ends. */
  segments: string[];
  /** Gate for prefers-reduced-motion / "not ready yet" — when false, nothing
   *  loads or plays. */
  enabled: boolean;
}

export type VideoSlot = 'A' | 'B';

/**
 * Double-buffered sequential playback across N pre-cut MP4 segments that
 * together form one continuous clip (see HeroVideoBackground.tsx for why
 * this exists instead of a single monolithic file or real HLS).
 *
 * Two <video> elements ("slots") take turns being the visible/active one.
 * While slot A plays segment N, slot B is silently preloading segment N+1
 * in the background (`preload="auto"` + `.load()`, not visible, not
 * playing). The instant A's `ended` event fires, B — already loaded — is
 * told to `.play()` and swaps to visible, and A immediately starts
 * preloading segment N+2. This repeats indefinitely, wrapping back to
 * segment 0 after the last one.
 *
 * Known limitation, stated plainly rather than glossed over: each segment
 * gets its full playback duration to preload the next one. On a
 * sufficiently slow connection, a segment could still finish playing before
 * the next one has fully buffered, causing a brief stall at that boundary.
 * A guaranteed-gapless result under any network condition would require
 * real adaptive bitrate streaming (multiple encoded renditions), which is
 * explicitly out of scope per the no-recompression constraint this was
 * built against.
 */
export function useSequentialVideoPlayback({ segments, enabled }: UseSequentialVideoPlaybackOptions) {
  const videoRefA = useRef<HTMLVideoElement>(null);
  const videoRefB = useRef<HTMLVideoElement>(null);
  const [activeSlot, setActiveSlot] = useState<VideoSlot>('A');
  const [ready, setReady] = useState(false);
  // Index of the segment currently loaded into the ACTIVE slot — not React
  // state on purpose: it only ever needs to be read inside the `ended`
  // handler, and making it state would trigger a re-render (and a stale
  // closure risk) on every segment boundary for no benefit.
  const activeIndexRef = useRef(0);

  const nextIndex = useCallback((i: number) => (i + 1) % segments.length, [segments.length]);

  const preloadInto = useCallback((el: HTMLVideoElement | null, index: number) => {
    if (!el) return;
    el.src = segments[index];
    el.preload = 'auto';
    el.load();
  }, [segments]);

  // Kick off: segment 0 into slot A (play immediately), segment 1 preloaded
  // into slot B in the background.
  useEffect(() => {
    if (!enabled || segments.length === 0) return;
    activeIndexRef.current = 0;
    setActiveSlot('A');
    preloadInto(videoRefA.current, 0);
    videoRefA.current?.play().catch(() => {
      // Autoplay blocked — same acceptable degrade as before: the flat
      // bg-primary color stays visible, nothing to surface to the user.
    });
    if (segments.length > 1) {
      preloadInto(videoRefB.current, 1);
    }
  }, [enabled, segments, preloadInto]);

  const handleEnded = useCallback((endedSlot: VideoSlot) => {
    if (segments.length <= 1) {
      // Single segment — nothing to hand off to, just loop it in place.
      const el = endedSlot === 'A' ? videoRefA.current : videoRefB.current;
      el?.play().catch(() => {});
      return;
    }

    const incomingSlot: VideoSlot = endedSlot === 'A' ? 'B' : 'A';
    const incomingEl = incomingSlot === 'A' ? videoRefA.current : videoRefB.current;
    const outgoingEl = endedSlot === 'A' ? videoRefA.current : videoRefB.current;

    const upcomingIndex = nextIndex(activeIndexRef.current);
    activeIndexRef.current = upcomingIndex;
    setActiveSlot(incomingSlot);
    incomingEl?.play().catch(() => {});

    // The outgoing slot is now idle — put it to work preloading the
    // segment after the one that just became active.
    preloadInto(outgoingEl, nextIndex(upcomingIndex));
  }, [segments.length, nextIndex, preloadInto]);

  return {
    videoRefA,
    videoRefB,
    activeSlot,
    ready,
    onEndedA: useCallback(() => handleEnded('A'), [handleEnded]),
    onEndedB: useCallback(() => handleEnded('B'), [handleEnded]),
    onPlaying: useCallback(() => setReady(true), []),
  };
}
