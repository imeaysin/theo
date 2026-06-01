import { signIn } from "@/lib/auth"
import { Button } from "@workspace/ui/components/button"
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
      variant="outline"
      className="w-full"
      onClick={() => void handleGoogleSignIn()}
    >
      Continue with Google
    </Button>
  )
}
