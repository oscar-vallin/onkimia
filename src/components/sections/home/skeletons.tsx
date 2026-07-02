export function DoctorsGridSkeleton() {
  return (
    <div className="bg-ink py-20 md:py-28 animate-pulse">
      <div className="container-onkimia">
        <div className="text-center mb-16">
          <div className="h-3 w-28 bg-white/10 rounded mx-auto mb-4" />
          <div className="h-10 w-80 bg-white/10 rounded mx-auto mb-3" />
          <div className="h-4 w-96 bg-white/10 rounded mx-auto" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl bg-white/5" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function InsurancesSkeleton() {
  return (
    <div className="bg-cream py-20 md:py-28 animate-pulse">
      <div className="container-onkimia">
        <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_2fr] gap-12 items-center">
          <div>
            <div className="h-24 w-20 bg-ink/10 rounded mb-4" />
            <div className="h-3 w-48 bg-ink/10 rounded" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="h-[90px] rounded-2xl bg-ink/10" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
