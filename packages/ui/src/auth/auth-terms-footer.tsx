import type { ReactNode } from "react"
import { Button } from "@workspace/ui/components/button"

export interface AuthTermsFooterProps {
  termsHref?: string
  privacyHref?: string
  renderTermsLink?: (href: string, label: string) => ReactNode
}

export function AuthTermsFooter({
  termsHref = "/terms",
  privacyHref = "/policy",
  renderTermsLink,
}: AuthTermsFooterProps) {
  function renderLink(href: string, label: string) {
    if (renderTermsLink) {
      return renderTermsLink(href, label)
    }

    return (
      <Button
        className="inline h-auto p-0 text-xs text-muted-foreground"
        render={<a href={href} />}
        size="xs"
        variant="link"
      >
        {label}
      </Button>
    )
  }

  return (
    <div className="mt-auto text-center">
      <p className="text-xs text-muted-foreground">
        By signing in you agree to our{" "}
        {renderLink(termsHref, "Terms of service")} &amp;{" "}
        {renderLink(privacyHref, "Privacy policy")}
      </p>
    </div>
  )
}
