import { Link } from "react-router-dom"
import { Alert, Button } from "@workspace/hero-ui"
import { paths } from "@/config/paths"
import { AuthCard } from "@/features/auth/components/auth-card"

/**
 * Two-Factor Authentication Page
 *
 * This is a placeholder page for 2FA verification.
 *
 * To implement full 2FA:
 * 1. Configure better-auth with 2FA plugin
 * 2. Handle 2FA verification in sign-in flow
 * 3. Add 2FA setup in security settings
 *
 * For now, redirects to sign in.
 */
export function TwoFactorPage() {
  return (
    <AuthCard
      title="Two-factor authentication"
      description="Two-factor authentication is not yet configured."
      footer={
        <Link to={paths.auth.signIn} className="text-foreground underline">
          Back to sign in
        </Link>
      }
    >
      <Alert>
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Description>
            Please contact your administrator to enable two-factor
            authentication.
          </Alert.Description>
        </Alert.Content>
      </Alert>

      <Link to={paths.auth.signIn} className="w-full">
        <Button variant="primary" fullWidth>
          Back to sign in
        </Button>
      </Link>
    </AuthCard>
  )
}
