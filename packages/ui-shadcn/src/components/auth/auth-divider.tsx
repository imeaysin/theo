import { Separator } from "@workspace/ui-shadcn/components/separator"

export function AuthDivider() {
  return (
    <div className="relative flex items-center gap-3">
      <Separator className="flex-1" />
      <span className="shrink-0 text-sm text-muted-foreground">or</span>
      <Separator className="flex-1" />
    </div>
  )
}
