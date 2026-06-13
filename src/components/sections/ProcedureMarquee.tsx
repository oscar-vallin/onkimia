'use client';
import { useEffect, useRef } from 'react';

interface ProcedureMarqueeProps {
  children: React.ReactNode;
}

export function ProcedureMarquee({ children }: ProcedureMarqueeProps) {
  const wrapRef = useRef<HTMLDivElement>(null);
  // Track pause conditions independently so any one can pause without the others resuming
  const pauseState = useRef({ outOfView: true, hovered: false, focused: false });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const track = el.querySelector('.marquee-track') as HTMLElement | null;
    if (!track) return;

    function sync() {
      if (!track) return;
      const { outOfView, hovered, focused } = pauseState.current;
      track.style.animationPlayState =
        outOfView || hovered || focused ? 'paused' : 'running';
    }

    // IntersectionObserver: pause when out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        pauseState.current.outOfView = !entry.isIntersecting;
        sync();
      },
      { threshold: 0.1 }
    );
    observer.observe(el);

    // Hover: pause on mouse over
    const onMouseEnter = () => { pauseState.current.hovered = true; sync(); };
    const onMouseLeave = () => { pauseState.current.hovered = false; sync(); };

    // Focus-within: pause when any child receives keyboard focus
    const onFocusIn = () => { pauseState.current.focused = true; sync(); };
    const onFocusOut = () => { pauseState.current.focused = false; sync(); };

    el.addEventListener('mouseenter', onMouseEnter);
    el.addEventListener('mouseleave', onMouseLeave);
    el.addEventListener('focusin', onFocusIn);
    el.addEventListener('focusout', onFocusOut);

    return () => {
      observer.disconnect();
      el.removeEventListener('mouseenter', onMouseEnter);
      el.removeEventListener('mouseleave', onMouseLeave);
      el.removeEventListener('focusin', onFocusIn);
      el.removeEventListener('focusout', onFocusOut);
    };
  }, []);

  return (
    <div ref={wrapRef} className="marquee-wrap">
      {children}
    </div>
  );
}
