import { signIn } from "@/lib/auth"
import { Button } from "@workspace/hero-ui"
import { paths } from "@/config/paths"

export function GoogleAuthButton() {
  async function handleGoogleSignIn() {
    await signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}${paths.dashboard}`,
    })
  }

  return (
    <Button
      type="button"
      variant="tertiary"
      fullWidth
      onPress={() => void handleGoogleSignIn()}
    >
      Continue with Google
    </Button>
  )
}
