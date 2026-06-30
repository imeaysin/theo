import type { RouteObject } from "react-router-dom"
import { ForgotPasswordPage } from "@/features/auth/pages/forgot-password-page"
import { ResetPasswordPage } from "@/features/auth/pages/reset-password-page"
import { SignInPage } from "@/features/auth/pages/sign-in-page"
import { SignOutPage } from "@/features/auth/pages/sign-out-page"
import { SignUpPage } from "@/features/auth/pages/sign-up-page"
import { TwoFactorPage } from "@/features/auth/pages/two-factor-page"
import { VerifyEmailPage } from "@/features/auth/pages/verify-email-page"
import { routeSegments } from "@/config/routes"

const { auth } = routeSegments

export const authRoutes: RouteObject[] = [
  { path: auth.signIn, element: <SignInPage /> },
  { path: auth.signUp, element: <SignUpPage /> },
  { path: auth.signOut, element: <SignOutPage /> },
  { path: auth.forgotPassword, element: <ForgotPasswordPage /> },
  { path: auth.resetPassword, element: <ResetPasswordPage /> },
  { path: auth.verifyEmail, element: <VerifyEmailPage /> },
  { path: auth.twoFactor, element: <TwoFactorPage /> },
]
