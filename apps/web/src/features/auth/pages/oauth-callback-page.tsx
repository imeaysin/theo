import { useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Spinner } from "@workspace/ui/components/spinner"
import { paths } from "@/config/paths"
import { authClient, tokenStorage } from "@/lib/auth"

/**
 * OAuthCallbackPage
 *
 * Handles the post-OAuth redirect for social sign-in (e.g., Google).
 *
 * Why this page exists:
 * OAuth uses browser-level redirects (302). The `set-auth-token` header that
 * Better Auth sets after the OAuth flow is in the redirect response headers,
 * which browsers silently follow — so our fetch `onSuccess` interceptor never
 * fires and the bearer token is never stored.
 *
 * Solution: redirect here after OAuth, call getSession() which fires a fresh
 * XHR. Better Auth's bearer plugin after-hook injects `set-auth-token` into
 * that response. Our global `onSuccess` handler in createBearerFetchOptions
 * picks it up and persists it to localStorage. Then we navigate to dashboard.
 */
export function OAuthCallbackPage() {
  const navigate = useNavigate()
  const hasRun = useRef(false)

  useEffect(() => {
    if (hasRun.current) return
    hasRun.current = true

    async function exchangeSession() {
      // Clear any old tokens to force getSession to use the newly minted cookie!
      tokenStorage.clearAll()

      const { data, error } = await authClient.getSession()

      if (error || !data?.session) {
        // Session exchange failed — redirect to sign in
        navigate(paths.auth.signIn, { replace: true })
        return
      }

      // At this point, the global onSuccess in createBearerFetchOptions has
      // already stored the bearer and access tokens from the response headers.

      navigate(paths.dashboard, { replace: true })
    }

    void exchangeSession()
  }, [navigate])

  return (
    <div className="flex min-h-svh items-center justify-center">
      <Spinner className="size-8 text-muted-foreground" />
    </div>
  )
}
