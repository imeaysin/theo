import { routeSegments } from "@/config/routes"
import { ForgotPasswordPage } from "@/features/auth/pages/forgot-password-page"
import { ResetPasswordPage } from "@/features/auth/pages/reset-password-page"
import { SignInPage } from "@/features/auth/pages/sign-in-page"
import { SignOutPage } from "@/features/auth/pages/sign-out-page"
import { SignUpPage } from "@/features/auth/pages/sign-up-page"
import { TwoFactorPage } from "@/features/auth/pages/two-factor-page"
import { VerifyEmailPage } from "@/features/auth/pages/verify-email-page"

export const authRoutes = [
  { path: routeSegments.auth.signIn, element: <SignInPage /> },
  { path: routeSegments.auth.signUp, element: <SignUpPage /> },
  { path: routeSegments.auth.signOut, element: <SignOutPage /> },
  { path: routeSegments.auth.forgotPassword, element: <ForgotPasswordPage /> },
  { path: routeSegments.auth.resetPassword, element: <ResetPasswordPage /> },
  { path: routeSegments.auth.verifyEmail, element: <VerifyEmailPage /> },
  { path: routeSegments.auth.twoFactor, element: <TwoFactorPage /> },
]
