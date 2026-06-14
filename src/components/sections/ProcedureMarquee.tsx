'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

interface ProcedureMarqueeProps {
  children: React.ReactNode;
}

const DURATION = 80; // must match the `marquee` keyframe duration in globals.css

export function ProcedureMarquee({ children }: ProcedureMarqueeProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const prefersReduced = useRef(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );

  const pauseState = useRef({ outOfView: true, userPaused: false, focused: false });

  // Drag state (mobile swipe)
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const dragBaseX = useRef(0);   // animation translateX at drag start (px)
  const dragLastX = useRef(0);   // last finger X (for momentum)
  const dragLastT = useRef(0);   // last event timestamp

  const sync = useCallback(() => {
    const track = trackRef.current;
    if (!track || prefersReduced.current) return;
    const { outOfView, userPaused, focused } = pauseState.current;
    track.style.animationPlayState =
      outOfView || userPaused || focused ? 'paused' : 'running';
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    trackRef.current = el.querySelector('.marquee-track') as HTMLElement | null;
    sync();
  }, [sync]);

  // IntersectionObserver
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        pauseState.current.outOfView = !entry.isIntersecting;
        sync();
      },
      { threshold: 0.1 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [sync]);

  // Focus-within pause — keyboard accessibility
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onFocusIn = () => { pauseState.current.focused = true; sync(); };
    const onFocusOut = () => { pauseState.current.focused = false; sync(); };
    el.addEventListener('focusin', onFocusIn);
    el.addEventListener('focusout', onFocusOut);
    return () => {
      el.removeEventListener('focusin', onFocusIn);
      el.removeEventListener('focusout', onFocusOut);
    };
  }, [sync]);

  // Non-passive touchmove listener so we can preventDefault on horizontal drags
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      const track = trackRef.current;
      if (!track || prefersReduced.current) return;

      const dx = e.touches[0].clientX - dragStartX.current;
      const dy = e.touches[0].clientY - dragStartY.current;

      // Only hijack horizontal swipes
      if (Math.abs(dx) < Math.abs(dy) * 1.2 && Math.abs(dx) < 8) return;

      e.preventDefault(); // blocks page scroll during horizontal drag

      dragLastX.current = e.touches[0].clientX;
      dragLastT.current = e.timeStamp;

      // Move track inline, bypassing the CSS animation
      track.style.transform = `translateX(${dragBaseX.current + dx}px)`;
    };

    el.addEventListener('touchmove', onTouchMove, { passive: false });
    return () => el.removeEventListener('touchmove', onTouchMove);
  }, []);

  // Read current animation translateX in pixels
  const getComputedX = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    const matrix = new DOMMatrix(getComputedStyle(track).transform);
    return matrix.m41;
  }, []);

  // Resume animation from a given pixel position using negative animation-delay
  const resumeFromX = useCallback((x: number) => {
    const track = trackRef.current;
    if (!track) return;
    const halfWidth = track.scrollWidth / 2;
    if (halfWidth === 0) { sync(); return; }

    // Normalize x into (-halfWidth, 0] to find loop position
    let normalized = x % halfWidth;
    if (normalized > 0) normalized -= halfWidth;

    const progress = -normalized / halfWidth;          // 0..1
    const delay = -(progress * DURATION);              // negative = seek forward

    track.style.transform = '';
    track.style.animationDelay = `${delay}s`;
    sync();
  }, [sync]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (prefersReduced.current) return;
    const track = trackRef.current;
    if (!track) return;

    dragStartX.current = e.touches[0].clientX;
    dragStartY.current = e.touches[0].clientY;
    dragLastX.current = e.touches[0].clientX;
    dragLastT.current = e.timeStamp;

    // Freeze animation and capture its current pixel position
    dragBaseX.current = getComputedX();
    track.style.animationPlayState = 'paused';
    isDragging.current = true;
  }, [getComputedX]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const track = trackRef.current;
    if (!track) { sync(); return; }

    const dx = e.changedTouches[0].clientX - dragStartX.current;

    // If barely moved (tap) — toggle user pause
    if (Math.abs(dx) < 6) {
      const next = !pauseState.current.userPaused;
      pauseState.current.userPaused = next;
      setIsPaused(next);
      track.style.transform = '';
      sync();
      return;
    }

    // Momentum: add velocity * 0.18 s of extra travel
    const dt = e.timeStamp - dragLastT.current;
    const velocity = dt > 0 ? (e.changedTouches[0].clientX - dragLastX.current) / dt : 0;
    const momentum = velocity * 180;

    const finalX = dragBaseX.current + dx + momentum;

    if (pauseState.current.userPaused) {
      // Stay paused at final position
      track.style.transform = `translateX(${finalX}px)`;
    } else {
      resumeFromX(finalX);
    }
  }, [sync, resumeFromX]);

  // Click (desktop) — toggle pause
  const handleClick = useCallback(() => {
    const next = !pauseState.current.userPaused;
    pauseState.current.userPaused = next;
    setIsPaused(next);
    sync();
  }, [sync]);

  return (
    <div
      ref={wrapRef}
      className="marquee-wrap relative cursor-pointer select-none touch-pan-y"
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label={
        isPaused
          ? 'Carrusel pausado — toca para reanudar'
          : 'Carrusel en movimiento — toca para pausar'
      }
    >
      {isPaused && (
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1.5 bg-ink/70 backdrop-blur-sm text-white/70 text-xs font-medium px-3 py-1.5 rounded-full pointer-events-none select-none">
          <span className="flex gap-0.5 w-2 h-3">
            <span className="w-0.5 h-full bg-current rounded-full" />
            <span className="w-0.5 h-full bg-current rounded-full" />
          </span>
          Pausado
        </div>
      )}
      {children}
    </div>
  );
}
