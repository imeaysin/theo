"use client"

import {
  createContext,
  useContext,
  useMemo,
  type ComponentType,
  type PropsWithChildren,
  type ReactNode,
} from "react"

export type AuthLinkProps = PropsWithChildren<{
  className?: string
  href?: string
  to?: string
}>

export type AuthLinkComponent = ComponentType<AuthLinkProps>

export type AuthNavigateOptions = {
  replace?: boolean
}

export type AuthRoutes = {
  signIn: string
  signUp: string
  signOut: string
  forgotPassword: string
  resetPassword: string
  verifyEmail: string
  twoFactor: string
  settingsAccount: string
  settingsSecurity: string
  organizationSettings: string
  organizationPeople: string
  organizationRoles: string
  defaultAuthenticated: string
}

export type AuthUiConfig = {
  routes: AuthRoutes
  navigate: (to: string, options?: AuthNavigateOptions) => void
  Link: AuthLinkComponent
  siteName: string
  absoluteAppUrl: (path: string) => string
  socialProviders: ("google" | "github")[]
  verifyEmailStorageKey: string
}

const defaultAbsoluteAppUrl = (path: string) => {
  if (typeof window === "undefined") return path
  return new URL(path, window.location.origin).href
}

const AuthUiConfigContext = createContext<AuthUiConfig | null>(null)

export type AuthUiConfigProviderProps = {
  children: ReactNode
  routes: AuthRoutes
  navigate: AuthUiConfig["navigate"]
  Link: AuthLinkComponent
  siteName: string
  absoluteAppUrl?: AuthUiConfig["absoluteAppUrl"]
  socialProviders?: AuthUiConfig["socialProviders"]
  verifyEmailStorageKey?: string
}

export function AuthUiConfigProvider({
  children,
  routes,
  navigate,
  Link,
  siteName,
  absoluteAppUrl = defaultAbsoluteAppUrl,
  socialProviders = ["google", "github"],
  verifyEmailStorageKey = "theo.auth.verify-email",
}: AuthUiConfigProviderProps) {
  const value = useMemo<AuthUiConfig>(
    () => ({
      routes,
      navigate,
      Link,
      siteName,
      absoluteAppUrl,
      socialProviders,
      verifyEmailStorageKey,
    }),
    [
      routes,
      navigate,
      Link,
      siteName,
      absoluteAppUrl,
      socialProviders,
      verifyEmailStorageKey,
    ]
  )

  return (
    <AuthUiConfigContext.Provider value={value}>
      {children}
    </AuthUiConfigContext.Provider>
  )
}

export function useAuthUiConfig(): AuthUiConfig {
  const context = useContext(AuthUiConfigContext)
  if (!context) {
    throw new Error("useAuthUiConfig must be used within AuthUiConfigProvider")
  }
  return context
}
