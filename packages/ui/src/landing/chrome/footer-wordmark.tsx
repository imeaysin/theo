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
          "font-sans text-[200px] leading-none text-secondary select-none sm:text-[508px]",
          "[WebkitTextStroke:1px_hsl(var(--muted-foreground))]"
        )}
        style={{
          WebkitTextStroke: "1px hsl(var(--muted-foreground))",
          color: "hsl(var(--secondary))",
        }}
      >
        {text}
      </p>
    </div>
  )
}
