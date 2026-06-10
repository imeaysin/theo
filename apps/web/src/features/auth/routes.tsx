import type { RouteObject } from "react-router-dom"
import { AuthLayout } from "@/components/layouts/auth-layout"
import { GuestRoute } from "@/components/routing/guest-route"
import { paths } from "@/config/paths"

export const authRoutes: RouteObject[] = [
  {
    element: <GuestRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: paths.auth.signIn,
            lazy: async () => {
              const { SignInPage } = await import("./pages/sign-in-page")
              return { Component: SignInPage }
            },
          },
          {
            path: paths.auth.signUp,
            lazy: async () => {
              const { SignUpPage } = await import("./pages/sign-up-page")
              return { Component: SignUpPage }
            },
          },
          {
            path: paths.auth.forgotPassword,
            lazy: async () => {
              const { ForgotPasswordPage } =
                await import("./pages/forgot-password-page")
              return { Component: ForgotPasswordPage }
            },
          },
          {
            path: paths.auth.resetPassword,
            lazy: async () => {
              const { ResetPasswordPage } =
                await import("./pages/reset-password-page")
              return { Component: ResetPasswordPage }
            },
          },
          {
            path: paths.auth.verifyEmail,
            lazy: async () => {
              const { VerifyEmailPage } =
                await import("./pages/verify-email-page")
              return { Component: VerifyEmailPage }
            },
          },
        ],
      },
    ],
  },
  {
    path: paths.auth.signOut,
    lazy: async () => {
      const { SignOutPage } = await import("./pages/sign-out-page")
      return { Component: SignOutPage }
    },
  },
]
