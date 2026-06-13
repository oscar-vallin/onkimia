'use client';
import { useEffect, useRef } from 'react';

interface ProcedureMarqueeProps {
  children: React.ReactNode;
}

export function ProcedureMarquee({ children }: ProcedureMarqueeProps) {
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    const track = el.querySelector('.marquee-track') as HTMLElement | null;
    if (!track) return;

    track.style.animationPlayState = 'paused';

    const observer = new IntersectionObserver(
      ([entry]) => {
        track.style.animationPlayState = entry.isIntersecting ? 'running' : 'paused';
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="marquee-wrap">
      {children}
    </div>
  );
}
