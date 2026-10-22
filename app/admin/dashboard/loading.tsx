import Skeleton from "@/components/CustomSkeleton";

// Pendant la lecture des données du dashboard
export default function Loading() {
  return (
    <div className="max-w-[1300px] mx-auto px-4 py-6 sm:p-8 flex flex-col gap-6">
      <Skeleton height="40px" width="280px" animated />
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} height="104px" width="100%" className="rounded-xl" animated />
        ))}
      </div>
      <Skeleton height="480px" width="100%" className="rounded-xl" animated />
    </div>
  );
}
