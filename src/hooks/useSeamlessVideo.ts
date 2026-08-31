'use client';

import { useEffect, useRef, useState } from 'react';
import type { ErrorData } from 'hls.js';

// hls.js only ships a declaration file for its main entry (dist/hls.d.ts);
// the `light` build we dynamically import below has no sibling .d.ts —
// src/types/hls-light.d.ts re-exports the main types for that subpath
// (accurate, not a guess: light is a strict runtime feature subset of the
// same `Hls` class). `typeof import('hls.js')` is a type-only query, erased
// at compile time — it does NOT pull the full 618 KB build into the bundle.
type HlsCtor = typeof import('hls.js').default;
type HlsInstance = InstanceType<HlsCtor>;

interface UseSeamlessVideoOptions {
  /** HLS manifest (.m3u8) — the primary path on every browser with either
   *  native HLS or MSE support (effectively everyone we target). */
  hlsSrc: string;
  /** Progressive MP4 (+faststart) — used only when neither native HLS nor
   *  MSE is available, or when hls.js hits a fatal, unrecoverable error. */
  fallbackSrc: string;
  /** Gate for prefers-reduced-motion / "preference not resolved yet". While
   *  false, nothing loads, decodes, or requests a single byte. */
  enabled: boolean;
}

/**
 * Plays the hero background video as a single continuous decode timeline —
 * one <video>, one MediaSource, one SourceBuffer, one decoder — instead of
 * juggling multiple independent files. See HeroVideoBackground.tsx for the
 * full "why" (the black-frame problem this replaces).
 *
 * Resolution order per browser, each strictly less work than the next:
 *  1. Native HLS (`canPlayType('application/vnd.apple.mpegurl')` — Safari,
 *     iOS) — the <video> element decodes the fMP4 HLS stream itself. No
 *     MSE, no JS demuxer, nothing to load. This is checked FIRST, not as a
 *     fallback bolted on after MSE — it's strictly cheaper when available.
 *  2. MSE via hls.js (dynamically imported — see below).
 *  3. Progressive MP4 (+faststart) — only when neither of the above exists,
 *     or hls.js reports a fatal error it can't recover from in place.
 */
export function useSeamlessVideo({ hlsSrc, fallbackSrc, enabled }: UseSeamlessVideoOptions) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const hlsRef = useRef<HlsInstance | null>(null);
  const [ready, setReady] = useState(false);

  // ─── Load + attach ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!enabled) return;
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    let rvfcHandle: number | null = null;

    const markReady = () => {
      if (!cancelled) setReady(true);
    };

    // requestVideoFrameCallback fires once the compositor has actually
    // painted a decoded frame on screen. `loadeddata` only means the
    // decoder HAS data buffered — using it to trigger the fade-in re-opens
    // the exact black-frame gap this migration exists to close: the fade
    // would start before anything real is visible. Firefox has no rVFC
    // support at the time of writing, hence the loadeddata fallback there.
    //
    // Feature-detected via typeof rather than `in` — lib.dom types
    // rVFC as a non-optional HTMLVideoElement member, so `'x' in video`
    // narrows the false branch to `never` (same pitfall as
    // `requestIdleCallback` elsewhere in this codebase).
    if (typeof video.requestVideoFrameCallback === 'function') {
      rvfcHandle = video.requestVideoFrameCallback(markReady);
    } else {
      video.addEventListener('loadeddata', markReady, { once: true });
    }

    const attach = async () => {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = hlsSrc;
        return;
      }

      if (typeof MediaSource === 'undefined') {
        // No MSE and no native HLS — nothing left but the plain file.
        video.src = fallbackSrc;
        return;
      }

      // Dynamic import: hls.js (even the light build, ~385 KB minified) is
      // dead weight for the native-HLS path above and for anyone who
      // hasn't scrolled to/rendered the hero yet. Keeping it out of the
      // initial bundle protects the LCP-critical first load. The `light`
      // build excludes alt-audio, subtitles, EME/DRM, CMCD and a few other
      // features this single silent background clip never uses.
      const { default: HlsCtor } = await import('hls.js/dist/hls.light.mjs');

      // The effect was torn down (unmount, or `enabled`/src changed) while
      // this import was still in flight — attaching now would leak an hls.js
      // instance onto a video element nobody owns anymore.
      if (cancelled) return;

      if (!HlsCtor.isSupported()) {
        video.src = fallbackSrc;
        return;
      }

      const hls = new HlsCtor({
        // The whole clip is ~21 fMP4 segments, ~157 MB combined. Keeping
        // the full back buffer means the loop back to segment 0 replays
        // from memory instead of re-requesting it over the network every
        // ~80s. Trade-off, stated plainly: this pins up to the full
        // decoded clip in memory for as long as the tab has this hero
        // mounted. Acceptable for a single always-on background video; not
        // a default to reach for on a page with several videos.
        backBufferLength: Infinity,
        // This is a single fixed-quality rendition — there is no ABR
        // ladder, so there's no "cap the level to the player's pixel size"
        // decision to make. Leaving the library default on here would just
        // add a resize-driven re-evaluation that can never change anything.
        capLevelToPlayerSize: false,
        enableWorker: true,
      });
      hlsRef.current = hls;

      hls.on(HlsCtor.Events.ERROR, (_event, data: ErrorData) => {
        if (!data.fatal) return; // hls.js already retries non-fatal errors internally
        switch (data.type) {
          case HlsCtor.ErrorTypes.NETWORK_ERROR:
            hls.startLoad();
            break;
          case HlsCtor.ErrorTypes.MEDIA_ERROR:
            hls.recoverMediaError();
            break;
          default:
            // Not recoverable in place (e.g. a MUX_ERROR or OTHER_ERROR) —
            // drop MSE entirely and hand the element back to the plain
            // progressive MP4 rather than leaving a dead player on screen.
            hls.destroy();
            hlsRef.current = null;
            video.src = fallbackSrc;
        }
      });

      hls.loadSource(hlsSrc);
      hls.attachMedia(video);
    };

    void attach();

    return () => {
      cancelled = true;
      if (rvfcHandle !== null && typeof video.cancelVideoFrameCallback === 'function') {
        video.cancelVideoFrameCallback(rvfcHandle);
      } else {
        video.removeEventListener('loadeddata', markReady);
      }
      hlsRef.current?.destroy();
      hlsRef.current = null;
    };
  }, [enabled, hlsSrc, fallbackSrc]);

  // ─── Autoplay + visibility-driven pause ────────────────────────────────
  useEffect(() => {
    if (!enabled) return;
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {
      // Autoplay blocked by the browser is a normal, expected outcome, not
      // an error to surface — the section's plain background color stays
      // visible and nothing else needs to happen.
    });

    const onVisibilityChange = () => {
      if (document.hidden) video.pause();
      else video.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    // Pausing off-screen playback saves CPU/battery on a page where the
    // hero has long since scrolled away — there's no visual cost since
    // nothing is being composited anyway.
    let observer: IntersectionObserver | undefined;
    if (typeof IntersectionObserver !== 'undefined') {
      observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      });
      observer.observe(video);
    }

    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChange);
      observer?.disconnect();
    };
  }, [enabled]);

  return { videoRef, ready };
}
