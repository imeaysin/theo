import { Link } from "react-router-dom"
import { Alert, AlertDescription } from "@workspace/ui/components/alert"
import { Button } from "@workspace/ui/components/button"
import { paths } from "@/config/paths"
import { AuthCard } from "@/features/auth/components/auth-card"

export function VerifyEmailPage() {
  return (
    <AuthCard
      title="Verify your email"
      description="We sent a confirmation link to your inbox."
    >
      <Alert>
        <AlertDescription>
          Click the link in the email to activate your account. You can close
          this page after verifying.
        </AlertDescription>
      </Alert>
      <Button
        render={<Link to={paths.auth.signIn} />}
        variant="outline"
        className="w-full"
      >
        Back to sign in
      </Button>
    </AuthCard>
  )
}
