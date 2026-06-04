export const paths = {
  home: "/",
  dashboard: "/dashboard",
  settings: {
    root: "/settings",
    account: "/settings/account",
    security: "/settings/security",
  },
  auth: {
    signIn: "/auth/sign-in",
    signUp: "/auth/sign-up",
    forgotPassword: "/auth/forgot-password",
    resetPassword: "/auth/reset-password",
    verifyEmail: "/auth/verify-email",

    signOut: "/auth/sign-out",
  },
} as const
