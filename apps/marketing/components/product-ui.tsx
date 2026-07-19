"use client"

import {
  Button as SharedButton,
  buttonVariants,
} from "@workspace/ui/components/button"
import { Kbd } from "@workspace/ui/components/kbd"
import { Spinner } from "@workspace/ui/components/spinner"
import { cn } from "@workspace/ui/lib/utils"
import { productConfig } from "@workspace/config/public"
import { Webhook } from "lucide-react"
import type { CSSProperties, ReactNode } from "react"

const productLogoIcons = {
  webhook: Webhook,
} as const

type ProductButtonVariant =
  | "primary"
  | "blue"
  | "destructive"
  | "outline"
  | "white"
  | "ghost"
  | "gray"
  | "dark"
  | "solid"
  | "accent"
  | "transparent"

type ProductButtonSize = "xs" | "sm" | "md" | "lg" | "icon"

export interface ButtonProps extends Omit<
  React.ComponentProps<typeof SharedButton>,
  "variant" | "size" | "render"
> {
  variant?: ProductButtonVariant
  size?: ProductButtonSize
  href?: string
  target?: string
  icon?: ReactNode
  spinner?: boolean
  kbd?: string
}

const variantMap = {
  primary: "default",
  blue: "default",
  destructive: "destructive",
  outline: "outline",
  white: "outline",
  ghost: "ghost",
  gray: "secondary",
  dark: "default",
  solid: "default",
  accent: "default",
  transparent: "ghost",
} as const

const sizeMap = {
  xs: "xs",
  sm: "sm",
  md: "default",
  lg: "lg",
  icon: "icon",
} as const

const productVariantClass: Partial<Record<ProductButtonVariant, string>> = {
  dark: "rounded-xl border-transparent bg-foreground text-background hover:bg-foreground/90",
  blue: "rounded-xl border-transparent bg-foreground text-background hover:bg-foreground/90",
  white:
    "rounded-xl border-border bg-background text-foreground hover:bg-muted",
  primary: "rounded-xl",
  outline: "rounded-xl",
  gray: "rounded-xl",
  ghost: "rounded-xl",
}

export function Button({
  className,
  variant = "primary",
  size = "md",
  href,
  target,
  icon,
  spinner,
  kbd,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const sharedVariant = variantMap[variant]
  const classes = cn(
    buttonVariants({
      variant: sharedVariant,
      size: sizeMap[size],
    }),
    productVariantClass[variant],
    size === "lg" && "h-12 px-5 text-base",
    className
  )

  const content = (
    <>
      {spinner ? <Spinner data-icon="inline-start" /> : null}
      {icon}
      {children}
      {kbd ? <Kbd>{kbd}</Kbd> : null}
    </>
  )

  if (href) {
    return (
      <a
        {...(props as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        className={classes}
        href={href}
        target={target}
        aria-disabled={disabled || undefined}
      >
        {content}
      </a>
    )
  }

  return (
    <SharedButton
      className={classes}
      variant={sharedVariant}
      size={sizeMap[size]}
      disabled={disabled}
      {...props}
    >
      {content}
    </SharedButton>
  )
}

export function navigationMenuTriggerStyle() {
  return buttonVariants({ variant: "ghost", size: "sm" })
}

export function Logo({
  className,
  white,
  hideLogoName,
  style,
}: {
  className?: string
  showVersion?: boolean
  showBeta?: boolean
  white?: boolean
  hideLogoName?: boolean
  style?: CSSProperties
}) {
  const ProductLogoIcon = productLogoIcons[productConfig.logoIcon]

  return (
    <span
      aria-label={`${productConfig.name} logo`}
      className={cn("inline-flex items-center gap-1.5", className)}
      style={style}
    >
      <ProductLogoIcon
        aria-hidden="true"
        className={hideLogoName ? "aspect-square w-full" : "size-6 shrink-0"}
        strokeWidth={2.25}
      />
      {!hideLogoName ? (
        <span
          className={cn(
            "text-lg font-medium tracking-tight",
            white ? "text-primary-foreground" : "text-foreground"
          )}
        >
          {productConfig.name}
        </span>
      ) : null}
    </span>
  )
}
