import { Separator } from "@workspace/ui-shadcn/components/separator"

export function AuthDivider() {
  return (
    <div className="relative flex items-center gap-3 py-1">
      <Separator className="flex-1" />
      <span className="text-xs text-muted-foreground">or continue with</span>
      <Separator className="flex-1" />
    </div>
  )
}
