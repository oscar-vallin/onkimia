interface GoogleMapsEmbedProps {
  lat: number;
  lng: number;
  zoom?: number;
  title: string;
  className?: string;
}

/**
 * Google Maps embed con lazy loading.
 * No requiere API key para el modo embed básico.
 */
export function GoogleMapsEmbed({
  lat,
  lng,
  zoom = 15,
  title,
  className = '',
}: GoogleMapsEmbedProps) {
  const src = `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;

  return (
    <div
      className={`relative w-full aspect-[4/3] md:aspect-[16/9] rounded-xl overflow-hidden border border-neutral-200 ${className}`}
    >
      <iframe
        src={src}
        title={title}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="absolute inset-0 w-full h-full"
      />
    </div>
  );
}
