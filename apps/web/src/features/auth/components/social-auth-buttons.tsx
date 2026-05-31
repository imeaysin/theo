import { signIn } from "@/lib/auth"
import { Button } from "@workspace/ui/components/button"
import { paths } from "@/config/paths"

const providers = [
  { id: "google" as const, label: "Continue with Google" },
  { id: "github" as const, label: "Continue with GitHub" },
]

export function SocialAuthButtons() {
  async function handleSocial(provider: "google" | "github") {
    await signIn.social({
      provider,
      callbackURL: `${window.location.origin}${paths.dashboard}`,
    })
  }

  return (
    <div className="flex flex-col gap-2">
      {providers.map((provider) => (
        <Button
          key={provider.id}
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => void handleSocial(provider.id)}
        >
          {provider.label}
        </Button>
      ))}
    </div>
  )
}
