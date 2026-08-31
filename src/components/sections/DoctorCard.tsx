import { SanityImage as Image } from '@/components/ui/SanityImage';
import { urlFor } from '@/sanity/image';
import { getLocalized, type Locale } from '@/lib/localization';
import type { Doctor } from '@/sanity/types';

interface DoctorCardProps {
  doctor: Doctor;
  locale: Locale;
}

export function DoctorCard({ doctor, locale }: DoctorCardProps) {
  const hasPhoto = !!doctor.photo?.asset;
  const photoSrc  = hasPhoto
    ? urlFor(doctor.photo).width(600).height(520).format('webp').quality(85).url()
    : undefined;

  const specialty = getLocalized(doctor.specialty, locale);
  const bio       = doctor.bio ? getLocalized(doctor.bio, locale) : undefined;
  const chips     = doctor.medicalSpecialties ?? [];

  return (
    <article className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm border border-black/[0.06] transition-all duration-300 ease-out hover:-translate-y-[6px] hover:shadow-[0_20px_50px_rgba(0,0,0,0.12)]">

      {/* Photo — fixed height, grayscale on desktop (pointer: fine), full colour on touch + hover */}
      <div className="relative h-[350px] overflow-hidden bg-gray-100 shrink-0">
        {photoSrc ? (
          <Image
            src={photoSrc}
            alt={doctor.fullName}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            loading="lazy"
            className={[
              'object-cover object-top',
              // Desktop (hover-capable devices): start greyscale, reveal on group-hover
              // Touch devices: full colour by default (no @media hover:hover equivalent in Tailwind,
              // so we use the [@media(hover:hover)] variant to scope grayscale to pointer devices)
              '[@media(hover:hover)]:grayscale-[20%]',
              '[@media(hover:hover)]:group-hover:grayscale-0',
              'transition-[filter,transform] duration-500 ease-out',
              'group-hover:scale-[1.03]',
            ].join(' ')}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200" aria-hidden="true" />
        )}
      </div>

      {/* Text block */}
      <div className="flex flex-col flex-1 p-6">
        <h3 className="font-serif text-xl text-primary leading-snug tracking-[-0.01em] mb-1">
          {doctor.fullName}
        </h3>
        <p className="font-sans text-sm font-medium text-secondary mb-3">
          {specialty}
        </p>

        {bio && (
          <p className="font-sans text-sm text-secondary leading-relaxed mb-4 line-clamp-3">
            {bio}
          </p>
        )}

        {/* Divider */}
        {chips.length > 0 && (
          <div className="border-t border-black/[0.07] pt-4 mt-auto">
            <div className="flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="font-sans text-xs text-secondary bg-gray-100 rounded-full px-3 py-1"
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

    </article>
  );
}
