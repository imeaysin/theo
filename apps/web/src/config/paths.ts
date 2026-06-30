export const paths = {
  home: "/",
  dashboard: "/dashboard",
  account: {
    settings: "/account/settings",
    outOfOffice: "/account/settings/out-of-office",
  },
  auth: {
    signIn: "/auth/sign-in",
    signUp: "/auth/sign-up",
    signOut: "/auth/sign-out",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    verifyEmail: "/auth/verify-email",
    twoFactor: "/auth/two-factor",
  },
} as const

export function absoluteAppUrl(path: string): string {
  if (typeof window === "undefined") return path
  return new URL(path, window.location.origin).href
}
