"use client"

import { Card, CardPanel } from "@workspace/ui/components/card"
import { Field, FieldItem, FieldLabel } from "@workspace/ui/components/field"
import { Fieldset, FieldsetLegend } from "@workspace/ui/components/fieldset"
import { Radio, RadioGroup } from "@workspace/ui/components/radio-group"
import { Skeleton } from "@workspace/ui/components/skeleton"
import { useTheme } from "@workspace/ui/components/theme-provider"
import * as React from "react"

const themeOptions = [
  { label: "System", value: "system" },
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
] as const

type ThemeOption = (typeof themeOptions)[number]["value"]

export type ThemeSettingsProps = {
  className?: string
}

export function ThemeSettings({ className }: ThemeSettingsProps) {
  const { theme, setTheme } = useTheme()
  const mounted = React.useSyncExternalStore(
    () => () => {
      return
    },
    () => true,
    () => false
  )

  const currentTheme = (theme ?? "system") as ThemeOption

  return (
    <div className={className}>
      <h2 className="mb-3 text-sm font-semibold">Appearance</h2>
      <Card>
        <CardPanel>
          {!mounted ? (
            <div className="flex flex-wrap gap-4">
              {themeOptions.map((item) => (
                <div
                  className="flex flex-col items-center gap-2"
                  key={item.value}
                >
                  <Skeleton className="h-16 w-20 rounded-lg" />
                  <Skeleton className="h-4 w-12" />
                </div>
              ))}
            </div>
          ) : (
            <Field
              className="gap-4"
              name="theme"
              render={(props) => <Fieldset {...props} />}
            >
              <FieldsetLegend className="sr-only">
                Choose a theme
              </FieldsetLegend>
              <RadioGroup
                className="flex-row flex-wrap gap-4"
                onValueChange={(value) => {
                  if (value) setTheme(value)
                }}
                value={currentTheme}
              >
                {themeOptions.map((item) => (
                  <FieldItem key={item.value}>
                    <FieldLabel className="cursor-pointer flex-col">
                      <Radio
                        className="peer sr-only absolute"
                        value={item.value}
                      />
                      <span className="relative block h-16 w-20 overflow-hidden rounded-lg shadow-xs transition-shadow not-peer-data-checked:opacity-80 peer-data-checked:ring-2 peer-data-checked:ring-primary/48 peer-data-checked:ring-offset-1 peer-data-checked:ring-offset-background peer-data-disabled:cursor-not-allowed peer-data-disabled:opacity-64">
                        {themePreviews[item.value]}
                      </span>
                      <span className="not-peer-data-checked:text-muted-foreground/70">
                        {item.label}
                      </span>
                    </FieldLabel>
                  </FieldItem>
                ))}
              </RadioGroup>
            </Field>
          )}
        </CardPanel>
      </Card>
    </div>
  )
}

const themePreviews = {
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
} as const satisfies Record<ThemeOption, React.ReactNode>
