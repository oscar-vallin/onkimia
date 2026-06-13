'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

interface ProcedureMarqueeProps {
  children: React.ReactNode;
}

const BASE_SPEED = 80; // seconds — must match ProcedureCarousel animation duration

export function ProcedureMarquee({ children }: ProcedureMarqueeProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLElement | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Read once — never changes after mount
  const prefersReduced = useRef(
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );

  // All pause conditions in one ref so sync() always reads latest values
  const pauseState = useRef({ outOfView: true, userPaused: false, focused: false });

  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

  // Single source of truth for animationPlayState
  const sync = useCallback(() => {
    const track = trackRef.current;
    if (!track || prefersReduced.current) return;
    const { outOfView, userPaused, focused } = pauseState.current;
    track.style.animationPlayState =
      outOfView || userPaused || focused ? 'paused' : 'running';
  }, []);

  // Resolve track ref once on mount
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    trackRef.current = el.querySelector('.marquee-track') as HTMLElement | null;
    sync();
  }, [sync]);

  // IntersectionObserver — pause when out of viewport
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

  // Click — toggle user pause
  const handleClick = useCallback(() => {
    const next = !pauseState.current.userPaused;
    pauseState.current.userPaused = next;
    setIsPaused(next);
    sync();
  }, [sync]);

  // Touch — hold to freeze, release to resume (no snap-back)
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (prefersReduced.current) return;
    const deltaX = e.touches[0].clientX - touchStartX.current;
    const deltaY = e.touches[0].clientY - touchStartY.current;
    // Only freeze on horizontal swipes; let vertical scroll pass through
    if (Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      const track = trackRef.current;
      if (track) track.style.animationPlayState = 'paused';
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    // Resume only if the user hasn't clicked to pause
    if (!pauseState.current.userPaused) sync();
  }, [sync]);

  return (
    <div
      ref={wrapRef}
      className="marquee-wrap relative cursor-pointer select-none touch-pan-y"
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
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
