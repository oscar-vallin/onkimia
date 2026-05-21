export function DoctorCardSkeleton() {
  return (
    <div
      className="bg-white rounded-xl overflow-hidden border border-neutral-200 animate-pulse"
      aria-hidden="true"
    >
      {/* aspect-[3/4] — mirrors the doctor photo container */}
      <div className="aspect-[3/4] bg-neutral-200" />
      <div className="p-4">
        <div className="h-5 bg-neutral-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-neutral-200 rounded w-1/2" />
      </div>
    </div>
  );
}
