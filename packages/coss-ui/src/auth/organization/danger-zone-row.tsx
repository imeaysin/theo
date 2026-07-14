import { Button } from "@workspace/ui/components/button"
import { Skeleton } from "@workspace/ui/components/skeleton"

export function DangerZoneRow({
  title,
  description,
  actionLabel,
  disabled,
  onAction,
}: {
  title: string
  description: string
  actionLabel: string
  disabled?: boolean
  onAction: () => void
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm leading-tight font-medium">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>

      <Button
        disabled={disabled}
        onClick={onAction}
        size="sm"
        type="button"
        variant="destructive"
      >
        {actionLabel}
      </Button>
    </div>
  )
}

export function DangerZoneRowSkeleton() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-56" />
      </div>
      <Skeleton className="h-8 w-32" />
    </div>
  )
}
