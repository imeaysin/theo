import { createContext, useContext, type ReactNode } from "react"
import { useTheme as useHeroTheme } from "@workspace/hero-ui"

/**
 * Theme Context for Vite React App
 *
 * Wraps HeroUI's useTheme hook in a React Context to:
 * 1. Initialize theme once at app root
 * 2. Provide theme state/controls to any component that needs it
 * 3. Follow React's recommended composition pattern
 *
 * This is the React-recommended way vs using a hook-only initializer.
 */

type Theme = "light" | "dark" | "system"

interface ThemeContextValue {
  theme: Theme
  setTheme: (theme: Theme) => void
  resolvedTheme: "light" | "dark"
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)

interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
}: ThemeProviderProps) {
  const themeValue = useHeroTheme(defaultTheme) as ThemeContextValue

  return (
    <ThemeContext.Provider value={themeValue}>{children}</ThemeContext.Provider>
  )
}

/**
 * Hook to access theme from any component
 *
 * Usage:
 * ```tsx
 * const { theme, setTheme, resolvedTheme } = useTheme()
 * ```
 */
export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)

  if (context === undefined) {
    throw new Error("useTheme must be used within ThemeProvider")
  }

  return context
}
