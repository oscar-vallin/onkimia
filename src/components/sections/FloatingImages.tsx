'use client';

import { SanityImage as Image } from '@/components/ui/SanityImage';
import { motion, useReducedMotion } from 'framer-motion';

const FLOAT_CONFIG = [
  { rotate: -4, offsetY: -20 },
  { rotate:  3, offsetY:  24 },
  { rotate: -2, offsetY:  -8 },
  { rotate:  5, offsetY:  32 },
  { rotate: -3, offsetY: -16 },
] as const;

const PLACEHOLDER_GRADIENTS = [
  'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
  'linear-gradient(135deg, #ede9fe 0%, #c4b5fd 100%)',
  'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
  'linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%)',
  'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)',
];

export interface FloatingImagesProps {
  count: number;
  srcs: (string | null)[];
  alts: string[];
  lqips: (string | undefined)[];
}

export function FloatingImages({ count, srcs, alts, lqips }: FloatingImagesProps) {
  const reducedMotion = useReducedMotion();

  return (
    <>
      {/* Mobile: 2-col grid, no rotations */}
      <div className="grid grid-cols-2 gap-2 mb-12 md:hidden">
        {Array.from({ length: count }).map((_, i) => (
          <FloatImage
            key={i}
            src={srcs[i]}
            alt={alts[i]}
            placeholder={PLACEHOLDER_GRADIENTS[i]}
            className="w-full"
          />
        ))}
      </div>

      {/*
        Desktop: absolute-positioned with rotation + y-offset.
        Spread = 60 so images overlap ~27px per pair on a max-w-5xl container.
        Each image enters with a staggered fade+slide via framer whileInView.
      */}
      {/*
        Desktop collage: static outer div owns the absolute position + rotation
        so FM's y animation never clobbers those transforms.
        Overlap per pair: image width (200px) - step (15% of max-w-5xl ≈ 154px) ≈ 46px.
      */}
      <div className="hidden md:block relative h-[280px] mb-16 mx-auto max-w-5xl">
        {Array.from({ length: count }).map((_, i) => {
          const cfg     = FLOAT_CONFIG[i % FLOAT_CONFIG.length];
          const spread  = 60;
          const leftPct = (50 - spread / 2) + (i / (count - 1)) * spread; // 20%→80%

          return (
            <div
              key={i}
              className="absolute w-[180px] lg:w-[200px] aspect-square"
              style={{
                left: `${leftPct}%`,
                top: 0,
                zIndex: i === 2 ? 2 : 1,
                transform: `translateX(-50%) translateY(${cfg.offsetY}px) rotate(${cfg.rotate}deg)`,
              }}
            >
              <motion.div
                className="w-full h-full"
                initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                whileInView={reducedMotion ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: i * 0.07, ease: 'easeOut' }}
              >
                <FloatImage
                  src={srcs[i]}
                  alt={alts[i]}
                  placeholder={PLACEHOLDER_GRADIENTS[i]}
                  className="w-full h-full"
                />
              </motion.div>
            </div>
          );
        })}
      </div>
    </>
  );
}

interface FloatImageProps {
  src: string | null;
  alt: string;
  placeholder: string;
  className?: string;
}

function FloatImage({ src, alt, placeholder, className = '' }: FloatImageProps) {
  return (
    /*
      Hover translateY on the inner wrapper keeps the transform independent
      from the outer motion.div's rotation+position transform.
    */
    <div
      className={[
        'relative aspect-square rounded-2xl overflow-hidden shadow-md',
        'motion-reduce:transition-none',
        '[@media(hover:hover)]:transition-transform [@media(hover:hover)]:duration-300 [@media(hover:hover)]:ease-out',
        '[@media(hover:hover)]:hover:-translate-y-2 [@media(hover:hover)]:hover:shadow-xl',
        className,
      ].join(' ')}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 45vw, 200px"
          className="object-cover"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: placeholder }}
          aria-hidden="true"
        />
      )}
    </div>
  );
}
