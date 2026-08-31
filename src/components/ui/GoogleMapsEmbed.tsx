'use client';

import { useEffect, useRef, useState } from 'react';
import { MapPin } from 'lucide-react';

interface GoogleMapsEmbedProps {
  /**
   * Consulta textual — nombre del negocio + dirección. Google la resuelve
   * contra la ficha real, así que "Ver mapa más grande" / "Abrir en Maps"
   * abre Onkimia con foto, reseñas y horario.
   *
   * Construir con getMapsQuery() de clinicConfig, nunca a mano, y NUNCA
   * pasar coordenadas aquí: Maps no las resuelve a una entidad, deja caer
   * un pin anónimo titulado con el propio par lat/lng.
   */
  query: string;
  /** Opcional — solo centra el encuadre (parámetro `ll`). No identifica el lugar. */
  lat?: number;
  lng?: number;
  zoom?: number;
  title: string;
  className?: string;
}

export function GoogleMapsEmbed({
  query,
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

  const params = new URLSearchParams({ q: query, z: String(zoom), output: 'embed' });
  // `ll` centra el mapa sin competir con `q` por identificar el lugar.
  if (lat != null && lng != null) params.set('ll', `${lat},${lng}`);
  const src = `https://maps.google.com/maps?${params}`;

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-[4/3] md:aspect-[16/9] rounded-2xl overflow-hidden border border-line bg-cream ${className}`}
    >
      {/* Placeholder antes de entrar al viewport */}
      {!shouldLoad && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <MapPin className="w-10 h-10 text-gray-soft mx-auto mb-2" aria-hidden="true" />
            <p className="text-sm text-gray-soft">Mapa</p>
          </div>
        </div>
      )}

      {/* Skeleton mientras el iframe carga */}
      {shouldLoad && !isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center animate-pulse z-10 bg-cream">
          <div className="text-center">
            <MapPin className="w-10 h-10 text-gray-soft mx-auto mb-2 animate-bounce" aria-hidden="true" />
            <p className="text-sm text-gray-soft">Cargando ubicación...</p>
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
