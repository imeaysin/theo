export const paths = {
  home: "/",
  dashboard: "/dashboard",
  settings: {
    root: "/settings",
    account: "/settings/account",
    security: "/settings/security",
  },
  auth: {
    signIn: "/sign-in",
    signUp: "/sign-up",
    forgotPassword: "/forgot-password",
    resetPassword: "/reset-password",
    verifyEmail: "/verify-email",
    twoFactor: "/two-factor",
    signOut: "/auth/sign-out",
  },
} as const
