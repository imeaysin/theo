import type { RouteObject } from "react-router-dom"
import { ForgotPasswordPage } from "@/features/auth/pages/forgot-password-page"
import { ResetPasswordPage } from "@/features/auth/pages/reset-password-page"
import { SignInPage } from "@/features/auth/pages/sign-in-page"
import { SignOutPage } from "@/features/auth/pages/sign-out-page"
import { SignUpPage } from "@/features/auth/pages/sign-up-page"
import { TwoFactorPage } from "@/features/auth/pages/two-factor-page"
import { VerifyEmailPage } from "@/features/auth/pages/verify-email-page"
import { paths } from "@/config/paths"

export const authRoutes: RouteObject[] = [
  { path: paths.auth.signIn, element: <SignInPage /> },
  { path: paths.auth.signUp, element: <SignUpPage /> },
  { path: paths.auth.signOut, element: <SignOutPage /> },
  { path: paths.auth.forgotPassword, element: <ForgotPasswordPage /> },
  { path: paths.auth.resetPassword, element: <ResetPasswordPage /> },
  { path: paths.auth.verifyEmail, element: <VerifyEmailPage /> },
  { path: paths.auth.twoFactor, element: <TwoFactorPage /> },
]
