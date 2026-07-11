export type AuthTermsFooterProps = {
  termsHref?: string
  privacyHref?: string
}

export function AuthTermsFooter({
  termsHref = "/terms",
  privacyHref = "/policy",
}: AuthTermsFooterProps) {
  const linkClassName =
    "text-muted-foreground underline underline-offset-2 transition-colors hover:text-foreground"

  return (
    <div className="mt-auto text-center">
      <p className="text-xs text-muted-foreground">
        By signing in you agree to our{" "}
        <a
          className={linkClassName}
          href={termsHref}
          rel="noreferrer"
          target="_blank"
        >
          Terms of service
        </a>{" "}
        &amp;{" "}
        <a
          className={linkClassName}
          href={privacyHref}
          rel="noreferrer"
          target="_blank"
        >
          Privacy policy
        </a>
      </p>
    </div>
  )
}
