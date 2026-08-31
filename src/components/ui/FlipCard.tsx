'use client';

import { useState } from 'react';
import Image from 'next/image';
import { RotateCw } from 'lucide-react';

interface FlipCardProps {
  image: string;
  title: string;
  description: string;
  flipHint: string;
}

export function FlipCard({ image, title, description, flipHint }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="group [perspective:1200px] h-64"
      // Desktop: hover triggers the flip. Mobile has no real hover, so this
      // is a no-op there and onClick below takes over.
    >
      <div
        role="button"
        tabIndex={0}
        aria-pressed={flipped}
        aria-label={`${title} — ${flipHint}`}
        onClick={() => setFlipped((f) => !f)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setFlipped((f) => !f);
          }
        }}
        className={`relative w-full h-full [transform-style:preserve-3d] transition-transform duration-500 ease-out cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-endos-mint-500 focus-visible:ring-offset-2 rounded-2xl group-hover:[transform:rotateY(180deg)] ${
          flipped ? '[transform:rotateY(180deg)]' : ''
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 [backface-visibility:hidden] rounded-2xl overflow-hidden">
          <Image
            src={image}
            alt=""
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 40%, rgba(0,0,0,0.75) 100%)' }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-6">
            <h3 className="font-serif text-xl text-white leading-snug mb-2">{title}</h3>
            <span className="inline-flex items-center gap-1.5 text-[11px] tracking-[0.12em] uppercase text-white/80">
              <RotateCw className="w-3 h-3 animate-[spin_3s_linear_infinite]" aria-hidden="true" />
              {flipHint}
            </span>
          </div>
        </div>

        {/* Back */}
        <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-endos-teal-900 rounded-2xl p-7 flex flex-col justify-center">
          <p className="text-sm text-white/95 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
