import { useTheme } from "@/providers/theme-provider"
import { SunFilledIcon, MoonFilledIcon, cn } from "@workspace/hero-ui"

export interface ThemeSwitchProps {
  className?: string
}

/**
 * ThemeSwitch for Vite React app
 * Uses local theme context that wraps HeroUI's useTheme hook
 *
 * Following HeroUI v3 documentation:
 * "Use HeroUI's useTheme hook when you are building a plain React app,
 * such as Vite or Create React App, and do not need next-themes."
 */
export function ThemeSwitch({ className }: ThemeSwitchProps) {
  const { resolvedTheme, setTheme, theme } = useTheme()

  const toggleTheme = () => {
    setTheme(resolvedTheme === "light" ? "dark" : "light")
  }

  // Wait for theme to be resolved before rendering
  if (!theme) {
    return <div aria-hidden className="h-6 w-6" />
  }

  const isLight = resolvedTheme === "light"

  return (
    <button
      aria-label={`Switch to ${isLight ? "dark" : "light"} mode`}
      className={cn(
        "cursor-pointer px-px transition-opacity hover:opacity-80",
        "inline-flex items-center justify-center",
        "h-auto w-auto rounded-lg border-none bg-transparent",
        className
      )}
      onClick={toggleTheme}
    >
      {isLight ? <MoonFilledIcon size={22} /> : <SunFilledIcon size={22} />}
    </button>
  )
}
