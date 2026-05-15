interface DecorativeBubblesProps {
  variant?: 'corner-top-right' | 'corner-bottom-left' | 'sides' | 'scattered';
  className?: string;
  opacity?: number;
}

export function DecorativeBubbles({
  variant = 'corner-top-right',
  className = '',
  opacity = 0.8,
}: DecorativeBubblesProps) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      aria-hidden="true"
      style={{ opacity }}
    >
      <svg
        viewBox="0 0 1200 800"
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full"
      >
        {variant === 'corner-top-right' && (
          <>
            <circle cx="1100" cy="80" r="60" fill="#3DB59F" opacity="0.3" />
            <circle cx="1180" cy="180" r="40" fill="#F39313" opacity="0.25" />
            <circle cx="1050" cy="200" r="30" fill="#36A9E7" opacity="0.4" />
            <circle cx="1150" cy="320" r="50" fill="#662483" opacity="0.2" />
          </>
        )}

        {variant === 'corner-bottom-left' && (
          <>
            <circle cx="80" cy="700" r="70" fill="#662483" opacity="0.25" />
            <circle cx="180" cy="650" r="35" fill="#F39313" opacity="0.3" />
            <circle cx="50" cy="600" r="45" fill="#3DB59F" opacity="0.2" />
          </>
        )}

        {variant === 'sides' && (
          <>
            <circle cx="60" cy="100" r="80" fill="#3DB59F" opacity="0.2" />
            <circle cx="100" cy="300" r="50" fill="#662483" opacity="0.25" />
            <circle cx="30" cy="500" r="40" fill="#F39313" opacity="0.3" />
            <circle cx="1150" cy="150" r="70" fill="#36A9E7" opacity="0.2" />
            <circle cx="1100" cy="400" r="45" fill="#F39313" opacity="0.25" />
            <circle cx="1180" cy="600" r="55" fill="#662483" opacity="0.2" />
          </>
        )}

        {variant === 'scattered' && (
          <>
            <circle cx="200" cy="100" r="40" fill="#3DB59F" opacity="0.2" />
            <circle cx="600" cy="80" r="30" fill="#F39313" opacity="0.25" />
            <circle cx="900" cy="120" r="50" fill="#662483" opacity="0.15" />
            <circle cx="1000" cy="400" r="60" fill="#36A9E7" opacity="0.2" />
            <circle cx="300" cy="500" r="35" fill="#F39313" opacity="0.25" />
            <circle cx="700" cy="650" r="45" fill="#3DB59F" opacity="0.2" />
            <circle cx="150" cy="700" r="50" fill="#662483" opacity="0.2" />
          </>
        )}
      </svg>
    </div>
  );
}
