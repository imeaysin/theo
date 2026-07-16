import "@/lib/auth/auth-plugin"
import { createAuthPlugin } from "@better-auth-ui/core"
import {
  themePlugin as coreThemePlugin,
  type ThemeLocalization,
} from "@better-auth-ui/core/plugins"

import { Appearance } from "@/features/auth/components/theme/appearance"
import { ThemeToggleItem } from "@/features/auth/components/theme/theme-toggle-item"

export type UseThemeHook = () => {
  theme?: string
  setTheme: (theme: string) => void
  themes?: string[]
}

type CommonThemeOptions = {
  localization?: Partial<ThemeLocalization>
  themes?: string[]
}

export type ThemePluginOptions = CommonThemeOptions &
  (
    | {
        useTheme: UseThemeHook
        theme?: never
        setTheme?: never
      }
    | {
        theme: string
        setTheme: (theme: string) => void
        useTheme?: never
      }
  )

export const themePlugin = createAuthPlugin(
  coreThemePlugin.id,
  ({ useTheme, ...rest }: ThemePluginOptions) => {
    function unusedSetTheme(_theme: string) {
      return
    }
    const base = coreThemePlugin({ setTheme: unusedSetTheme, ...rest })
    return {
      ...base,
      useTheme:
        useTheme ??
        (() => ({
          theme: base.theme,
          setTheme: base.setTheme,
          themes: base.themes,
        })),
      userMenuItems: [ThemeToggleItem],
      accountCards: [Appearance],
    }
  }
)
