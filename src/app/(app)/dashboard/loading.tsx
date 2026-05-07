import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="mx-auto flex w-full max-w-[1300px] flex-col gap-5">
      <div className="space-y-2">
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-9 w-72" />
        <Skeleton className="h-4 w-80" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, idx) => (
          <Skeleton key={idx} className="h-28 rounded-2xl" />
        ))}
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <Skeleton className="h-[340px] rounded-2xl xl:col-span-7" />
        <Skeleton className="h-[340px] rounded-2xl xl:col-span-5" />
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <Skeleton className="h-[300px] rounded-2xl xl:col-span-5" />
        <Skeleton className="h-[300px] rounded-2xl xl:col-span-4" />
        <Skeleton className="h-[300px] rounded-2xl xl:col-span-3" />
      </div>
    </div>
  )
}
