import type { ReactNode } from "react"

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
  const linkClassName =
    "text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"

  function renderLink(href: string, label: string) {
    if (renderTermsLink) {
      return renderTermsLink(href, label)
    }

    return (
      <a className={linkClassName} href={href}>
        {label}
      </a>
    )
  }

  return (
    <div className="mt-auto text-center">
      <p className="font-sans text-xs text-muted-foreground">
        By signing in you agree to our{" "}
        {renderLink(termsHref, "Terms of service")} &amp;{" "}
        {renderLink(privacyHref, "Privacy policy")}
      </p>
    </div>
  )
}
