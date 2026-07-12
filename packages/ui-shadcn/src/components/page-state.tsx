import type * as React from "react"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
} from "@workspace/ui-shadcn/components/empty"
import { cn } from "@workspace/ui-shadcn/lib/utils"

export function PageState({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Empty>) {
  return (
    <Empty
      className={cn("min-h-[50vh] flex-1 gap-8 py-16 sm:py-24", className)}
      {...props}
    >
      {children}
    </Empty>
  )
}

export function PageStateHeader({
  className,
  children,
  ...props
}: React.ComponentProps<typeof EmptyHeader>) {
  return (
    <EmptyHeader className={cn("max-w-md", className)} {...props}>
      {children}
    </EmptyHeader>
  )
}

export function PageStateIcon({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof EmptyMedia>, "variant">) {
  return (
    <EmptyMedia className={cn("mb-0", className)} variant="icon" {...props}>
      {children}
    </EmptyMedia>
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
        "font-heading text-xl font-semibold text-foreground sm:text-2xl",
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
}: React.ComponentProps<typeof EmptyDescription>) {
  return (
    <EmptyDescription className={className} {...props}>
      {children}
    </EmptyDescription>
  )
}

export function PageStateActions({
  className,
  children,
  ...props
}: React.ComponentProps<typeof EmptyContent>) {
  return (
    <EmptyContent
      className={cn("flex-row flex-wrap justify-center gap-3", className)}
      {...props}
    >
      {children}
    </EmptyContent>
  )
}
