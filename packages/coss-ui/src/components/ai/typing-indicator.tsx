import { Dot } from "lucide-react"

export function TypingIndicator() {
  return (
    <div className="flex justify-start gap-1">
      <div className="rounded-lg bg-muted p-3">
        <div className="flex -space-x-2.5">
          <Dot className="h-5 w-5 animate-pulse" />
          <Dot className="h-5 w-5 animate-pulse delay-75" />
          <Dot className="h-5 w-5 animate-pulse delay-150" />
        </div>
      </div>
    </div>
  )
}
