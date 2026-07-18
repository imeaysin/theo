import { Skeleton } from "@workspace/ui-shadcn/components/skeleton"

export function PasskeySkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-4">
      <Skeleton className="size-10 rounded-md" />
      <div className="flex flex-col gap-1">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  )
}
