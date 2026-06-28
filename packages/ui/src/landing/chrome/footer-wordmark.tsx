import { cn } from "@workspace/ui/lib/utils"

interface FooterWordmarkProps {
  text: string
  className?: string
}

export function FooterWordmark({ text, className }: FooterWordmarkProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute bottom-0 left-0 translate-y-[25%] overflow-hidden bg-background sm:left-1/2 sm:-translate-x-1/2 sm:translate-y-[40%]",
        className
      )}
    >
      <p
        className={cn(
          "text-[200px] leading-none text-secondary [-webkit-text-stroke:1px_var(--muted-foreground)] select-none sm:text-[508px]"
        )}
      >
        {text}
      </p>
    </div>
  )
}
