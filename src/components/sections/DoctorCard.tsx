import Image from 'next/image';
import { urlFor } from '@/sanity/image';
import { getLocalized, type Locale } from '@/sanity/lib/localization';
import type { Doctor } from '@/sanity/types';

interface DoctorCardProps {
  doctor: Doctor;
  locale: Locale;
  viewProfileLabel: string;
}

export function DoctorCard({ doctor, locale }: DoctorCardProps) {
  console.log(doctor)
  const hasPhoto = !!doctor.photo?.asset;
  const hasLqip = !!doctor.photo?.asset?.metadata?.lqip;
  const photoSrc = hasPhoto
    ? urlFor(doctor.photo).width(600).height(800).format('webp').quality(85).url()
    : undefined;

  return (
    <article className="group relative rounded-2xl">
      {/* Photo container — portrait 3:4 ratio */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-ink-2">

        {/* Photo */}
        {photoSrc && (
          <Image
            src={photoSrc}
            alt={doctor.fullName}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            loading="lazy"
            placeholder={hasLqip ? 'blur' : 'empty'}
            blurDataURL={hasLqip ? doctor.photo.asset?.metadata?.lqip : undefined}
            className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />

        {/* Name + specialty — anchored to bottom, always visible */}
        <div className="absolute bottom-0 left-0 right-0 p-5 mb-8">
          <h3 className="font-serif text-xl text-white leading-tight mb-1">
            {doctor.fullName}
          </h3>
          <p className="text-mx text-teal-soft">
            {getLocalized(doctor.specialty, locale)}
          </p>
        </div>

      </div>
    </article>
  );
}
