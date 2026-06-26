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
        "pointer-events-none absolute inset-0 flex items-end justify-center overflow-hidden",
        className
      )}
    >
      <p
        className={cn(
          "w-full max-w-full translate-y-[42%] select-none text-center font-sans leading-none text-secondary",
          "text-[clamp(4.5rem,22vw,18rem)]",
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
