import { DoctorCardSkeleton } from '@/components/ui/DoctorCardSkeleton';

export default function Loading() {
  return (
    <>
      {/* Hero placeholder */}
      <div className="relative w-full min-h-[440px] md:min-h-[550px] bg-brand-900 animate-pulse" />

      {/* Doctor grid skeleton */}
      <section className="bg-neutral-50 py-16 md:py-24">
        <div className="container-onkimia">
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {Array.from({ length: 4 }).map((_, i) => (
              <DoctorCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
