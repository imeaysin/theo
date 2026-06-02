import { Link } from "react-router-dom"
import { Alert, Button } from "@workspace/hero-ui"
import { paths } from "@/config/paths"
import { AuthCard } from "@/features/auth/components/auth-card"

export function VerifyEmailPage() {
  return (
    <AuthCard
      title="Verify your email"
      description="We sent a confirmation link to your inbox."
    >
      <Alert>
        <Alert.Indicator />
        <Alert.Content>
          <Alert.Description>
            Click the link in the email to activate your account. You can close
            this page after verifying.
          </Alert.Description>
        </Alert.Content>
      </Alert>
      <Link to={paths.auth.signIn} className="w-full">
        <Button variant="outline" fullWidth>
          Back to sign in
        </Button>
      </Link>
    </AuthCard>
  )
}
