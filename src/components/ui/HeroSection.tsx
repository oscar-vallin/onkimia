import Image from 'next/image';
import { urlFor } from '@/sanity/image';
import type { Image as SanityImage } from 'sanity';
import { DecorativeBubbles } from './DecorativeBubbles';

interface HeroSectionProps {
  image?: SanityImage;
  title: string;
  subtitle?: string;
  description?: string;
  align?: 'center' | 'left'; // Prop para alinear el texto
  height?: 'sm' | 'md' | 'lg'; // Prop para la altura, aunque su efecto se estandariza
  overlay?: 'light' | 'medium' | 'dark';
}

export function HeroSection({
  image,
  title,
  subtitle, 
  description,
  align = 'left', // Por defecto, el texto se alinea a la izquierda para las páginas internas
  height = 'lg', // Se mantiene 'lg' como valor por defecto, ya que es la altura estandarizada
  overlay = 'medium',
}: HeroSectionProps) {
  // Estandarización de altura: todas las variantes de 'height' ahora usan la misma altura mínima
  const heightClasses = {
    sm: 'min-h-[380px] md:min-h-[480px]',
    md: 'min-h-[420px] md:min-h-[520px]',
    lg: 'min-h-[440px] md:min-h-[550px]',
  };

  const overlayClasses = {
    light: 'bg-black/25',
    medium: 'bg-gradient-to-r from-brand-900/80 via-brand-900/60 to-transparent',
    dark: 'bg-gradient-to-r from-brand-900/90 via-brand-900/70 to-transparent',
  };

  const alignClasses = {
    center: 'items-center text-center',
    left: 'items-start text-left', // Se eliminó el padding explícito, 'container-onkimia' y 'px-4' lo gestionan
  };

  return (
    <section className={`relative w-full ${heightClasses[height]} overflow-hidden`}> {/* Removed negative margin */}
      {/* Background Image */}
      {image ? (
        <Image
          src={urlFor(image)
            .width(2400)
            .quality(85)
            .format('webp')
            .url()}
          alt={title}
          fill
          sizes="100vw"
          priority // M-07: Removed duplicate quality prop, as it's already applied in urlFor.
          className="object-cover"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-brand-900 to-brand-700" />
      )}

      {/* Overlay */}
      <div className={`absolute inset-0 ${overlayClasses[overlay]}`} aria-hidden="true" />

      {/* Burbujas decorativas */}
      <DecorativeBubbles variant="sides" opacity={0.6} />

      {/* Content */}
       <div className={`relative h-full container-onkimia flex flex-col justify-start ${alignClasses[align]} text-white pt-20 md:pt-28 lg:pt-30 px-4`}>
        <h1
          className="text-3xl md:text-5xl lg:text-6xl font-normal mb-4 md:mb-6 font-sans max-w-4xl text-balance"
          style={{ color: '#ffffff' }}
        >
          {title}
        </h1>

        {subtitle && (
          <span
            className="text-xl md:text-2xl max-w-3xl font-serif italic font-normal mb-4"
            style={{ color: '#ffffff' }}
          >
            {subtitle}
          </span>
        )}
        
        {description && (
         <p className="text-base md:text-lg text-white max-w-2xl leading-relaxed mt-24">
            {description}
          </p>
        )}
      </div>
    </section>
  );
}

// Made with Bob
