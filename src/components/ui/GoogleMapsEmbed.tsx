'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface GoogleMapsEmbedProps {
  lat: number;
  lng: number;
  zoom?: number;
  title: string;
  className?: string;
}

export function GoogleMapsEmbed({
  lat,
  lng,
  zoom = 15,
  title,
  className = '',
}: GoogleMapsEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const src = `https://maps.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-[4/3] md:aspect-[16/9] rounded-xl overflow-hidden border border-neutral-200 bg-neutral-100 ${className}`}
    >
      {/* Placeholder antes de entrar al viewport */}
      {!shouldLoad && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-10 h-10 text-neutral-300 mx-auto mb-2" aria-hidden="true" />
            <p className="text-sm text-neutral-400">Mapa</p>
          </div>
        </div>
      )}

      {/* Skeleton mientras el iframe carga */}
      {shouldLoad && !isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center animate-pulse z-10 bg-neutral-100">
          <div className="text-center">
            <MapPin className="w-10 h-10 text-neutral-300 mx-auto mb-2 animate-bounce" aria-hidden="true" />
            <p className="text-sm text-neutral-400">Cargando ubicación...</p>
          </div>
        </div>
      )}

      {shouldLoad && (
        <iframe
          src={src}
          title={title}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          onLoad={() => setIsLoaded(true)}
          className="absolute inset-0 w-full h-full"
        />
      )}
    </div>
  );
}
