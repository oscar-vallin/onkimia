export function DoctorCardSkeleton() {
  return (
    <div
      className="bg-white rounded-xl overflow-hidden border border-line animate-pulse"
      aria-hidden="true"
    >
      {/* aspect-[3/4] — mirrors the doctor photo container */}
      <div className="aspect-[3/4] bg-cream-2" />
      <div className="p-4">
        <div className="h-5 bg-cream-2 rounded w-3/4 mb-2" />
        <div className="h-4 bg-cream-2 rounded w-1/2" />
      </div>
    </div>
  );
}
