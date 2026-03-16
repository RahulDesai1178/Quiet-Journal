import { Skeleton } from "@/components/ui/skeleton";

export default function ProtectedLoading() {
  return (
    <div className="space-y-6">
      <div className="soft-panel rounded-[2rem] p-6">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="mt-4 h-12 w-3/4" />
        <Skeleton className="mt-3 h-4 w-1/2" />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="soft-panel rounded-[2rem] p-5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-4 h-10 w-20" />
            <Skeleton className="mt-3 h-4 w-32" />
          </div>
        ))}
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="soft-panel rounded-[2rem] p-5">
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-5/6" />
            <Skeleton className="mt-6 h-4 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}
