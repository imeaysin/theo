"use client"

import { useAuthPlugin } from "@better-auth-ui/react"
import { useSyncExternalStore, type ReactNode } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { FieldLegend, FieldSet } from "@/components/ui/field"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { themePlugin } from "@/lib/auth/theme-plugin"
import { cn } from "@/lib/utils"

export type AppearanceProps = {
  className?: string
}

type ThemeValue = "system" | "light" | "dark"

const THEME_OPTIONS: readonly ThemeValue[] = ["system", "light", "dark"]

function subscribeNoop() {
  return () => undefined
}

function useIsClient() {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false
  )
}

/**
 * Compact theme selector with SVG preview cards (coss particle style),
 * wired to the theme plugin / next-themes.
 */
export function Appearance({ className }: AppearanceProps) {
  const { useTheme, localization } = useAuthPlugin(themePlugin)
  const { theme, setTheme, themes = [] } = useTheme()
  const isClient = useIsClient()

  const themeLabels: Record<ThemeValue, string> = {
    system: localization.system,
    light: localization.light,
    dark: localization.dark,
  }

  const items = THEME_OPTIONS.filter((value) => themes.includes(value)).map(
    (value) => ({
      value,
      label: themeLabels[value],
      preview: themePreviews[value],
    })
  )

  const selectedTheme = isClient ? (theme ?? "") : ""
  const isDisabled = !isClient || !theme

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold">{localization.appearance}</h2>

      <Card className={cn(className)}>
        <CardContent>
          <FieldSet className="gap-5">
            <FieldLegend className="text-sm font-medium" variant="label">
              {localization.theme}
            </FieldLegend>

            <RadioGroup
              className="flex w-auto flex-row flex-wrap gap-6"
              value={selectedTheme}
              onValueChange={setTheme}
              disabled={isDisabled}
            >
              {items.map((item) => (
                <ThemeOption
                  key={item.value}
                  value={item.value}
                  label={item.label}
                  preview={item.preview}
                />
              ))}
            </RadioGroup>
          </FieldSet>
        </CardContent>
      </Card>
    </div>
  )
}

type ThemeOptionProps = {
  value: ThemeValue
  label: string
  preview: ReactNode
}

function ThemeOption({ value, label, preview }: ThemeOptionProps) {
  return (
    <Label className="flex w-[88px] cursor-pointer flex-col items-center gap-2.5 font-normal">
      <RadioGroupItem
        className="peer sr-only absolute size-0 border-0 p-0 after:hidden"
        value={value}
      />
      <span className="relative block h-[70px] w-[88px] shrink-0 overflow-hidden rounded-lg shadow-xs transition-[opacity,box-shadow] not-peer-data-checked:opacity-80 peer-disabled:cursor-not-allowed peer-disabled:opacity-64 peer-data-checked:ring-2 peer-data-checked:ring-primary/48 peer-data-checked:ring-offset-1 peer-data-checked:ring-offset-background">
        {preview}
      </span>
      <span className="text-sm not-peer-data-checked:text-muted-foreground/70">
        {label}
      </span>
    </Label>
  )
}

const themePreviews: Record<ThemeValue, ReactNode> = {
  dark: (
    <svg
      aria-hidden
      className="size-full"
      fill="none"
      viewBox="0 0 88 70"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path className="fill-neutral-900" d="M0 0h88v70H0z" />
      <path
        className="fill-neutral-800 shadow-sm"
        d="M10 12a4 4 0 0 1 4-4h74v62H10V12Z"
      />
      <circle className="fill-neutral-600" cx="28" cy="26" r="8" />
      <rect
        className="fill-neutral-700"
        height="4"
        rx="2"
        width="58"
        x="20"
        y="42"
      />
      <rect
        className="fill-neutral-700"
        height="4"
        rx="2"
        width="58"
        x="20"
        y="49"
      />
      <rect
        className="fill-neutral-700"
        height="4"
        rx="2"
        width="29"
        x="20"
        y="56"
      />
    </svg>
  ),
  light: (
    <svg
      aria-hidden
      className="size-full"
      fill="none"
      viewBox="0 0 88 70"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path className="fill-neutral-200" d="M0 0h88v70H0z" />
      <path
        className="fill-white shadow-sm"
        d="M10 12a4 4 0 0 1 4-4h74v62H10V12Z"
      />
      <circle className="fill-neutral-300" cx="28" cy="26" r="8" />
      <rect
        className="fill-neutral-200"
        height="4"
        rx="2"
        width="58"
        x="20"
        y="42"
      />
      <rect
        className="fill-neutral-200"
        height="4"
        rx="2"
        width="58"
        x="20"
        y="49"
      />
      <rect
        className="fill-neutral-200"
        height="4"
        rx="2"
        width="29"
        x="20"
        y="56"
      />
    </svg>
  ),
  system: (
    <svg
      aria-hidden
      className="size-full"
      fill="none"
      viewBox="0 0 88 70"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path className="fill-neutral-200" d="M0 0h44v70H0z" />
      <path className="fill-neutral-900" d="M44 0h44v70H44z" />
      <path
        className="fill-white shadow-sm"
        d="M10 12a4 4 0 0 1 4-4h30v62H10V12Z"
      />
      <circle className="fill-neutral-300" cx="28" cy="26" r="8" />
      <path
        className="fill-neutral-200"
        d="M20 44a2 2 0 0 1 2-2h22v4H22a2 2 0 0 1-2-2ZM20 51a2 2 0 0 1 2-2h22v4H22a2 2 0 0 1-2-2ZM20 58a2 2 0 0 1 2-2h22v4H22a2 2 0 0 1-2-2Z"
      />
      <path
        className="fill-neutral-800 shadow-sm"
        d="M54 12a4 4 0 0 1 4-4h30v62H54V12Z"
      />
      <circle className="fill-neutral-600" cx="72" cy="26" r="8" />
      <path
        className="fill-neutral-700"
        d="M64 44a2 2 0 0 1 2-2h22v4H66a2 2 0 0 1-2-2ZM64 51a2 2 0 0 1 2-2h22v4H66a2 2 0 0 1-2-2ZM64 58a2 2 0 0 1 2-2h22v4H66a2 2 0 0 1-2-2Z"
      />
    </svg>
  ),
}
