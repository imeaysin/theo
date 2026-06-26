import type * as React from "react"
import { cn } from "@workspace/ui/lib/utils"

export function PageState({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex min-h-[50vh] flex-1 flex-col items-center justify-center px-4 py-16 text-center sm:py-24",
        className
      )}
      {...props}
    >
      <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6">
        {children}
      </div>
    </div>
  )
}

export function PageStateIcon({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex size-14 items-center justify-center border border-border bg-secondary text-muted-foreground [&_svg]:size-6",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function PageStateTitle({
  className,
  children,
  ...props
}: React.ComponentProps<"h1">) {
  return (
    <h1
      className={cn(
        "font-serif text-2xl text-foreground sm:text-3xl",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  )
}

export function PageStateDescription({
  className,
  children,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      className={cn(
        "font-sans text-sm leading-relaxed text-muted-foreground",
        className
      )}
      {...props}
    >
      {children}
    </p>
  )
}

export function PageStateActions({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-center gap-3 pt-1",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
