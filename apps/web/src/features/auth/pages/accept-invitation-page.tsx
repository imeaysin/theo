import { useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { AuthPageBody, AuthPageHeader } from "@workspace/ui-shadcn/auth"
import { Button } from "@workspace/ui-shadcn/components/button"
import { PageLoading } from "@workspace/ui-shadcn/components/page-loading"
import { toastManager } from "@workspace/ui-shadcn/components/toast"
import { useAcceptInvitation, useAuthSession } from "@workspace/auth/react"
import { defaultAuthenticatedRoute, routes } from "@/config/routes"
import { withAuthRedirectQuery } from "@/routing/safe-redirect"

export function AcceptInvitationPage() {
  const [searchParams] = useSearchParams()
  const invitationId = searchParams.get("id")
  const { data: session, isPending: sessionPending } = useAuthSession()
  const { mutate: acceptInvitation, isPending: isAccepting } =
    useAcceptInvitation()
  const [accepted, setAccepted] = useState(false)

  useEffect(() => {
    if (!invitationId || sessionPending || !session || accepted) return

    acceptInvitation(
      { invitationId },
      {
        onSuccess: () => {
          setAccepted(true)
          toastManager.add({
            title: "Invitation accepted",
            description: "You have joined the workspace.",
            type: "success",
          })
        },
        onError: () => {
          toastManager.add({
            title: "Could not accept invitation",
            description:
              "This invitation is invalid, expired, or already used.",
            type: "error",
          })
        },
      }
    )
  }, [acceptInvitation, accepted, invitationId, session, sessionPending])

  if (!invitationId) {
    return (
      <AuthPageBody>
        <AuthPageHeader
          description="This invitation link is missing an id. Open the link from your email again."
          title="Invalid invitation link"
        />
        <Button asChild className="w-full" size="lg" type="button">
          <Link to={routes.signIn}>Go to sign in</Link>
        </Button>
      </AuthPageBody>
    )
  }

  if (sessionPending || (session && isAccepting)) {
    return <PageLoading message="Accepting your invitation…" />
  }

  if (!session) {
    const returnPath = `${routes.acceptInvitation}?id=${invitationId}`

    return (
      <AuthPageBody
        footer={
          <p className="font-sans text-sm text-muted-foreground">
            New here?{" "}
            <Link
              className="text-foreground underline underline-offset-2 transition-colors hover:text-foreground/80"
              to={withAuthRedirectQuery(routes.signUp, {
                redirect: returnPath,
                fallback: defaultAuthenticatedRoute,
              })}
            >
              Create an account
            </Link>
          </p>
        }
      >
        <AuthPageHeader
          description="Sign in with the email address that received this invitation."
          title="Sign in to accept"
        />
        <Button asChild className="w-full" size="lg" type="button">
          <Link
            to={withAuthRedirectQuery(routes.signIn, {
              redirect: returnPath,
              fallback: defaultAuthenticatedRoute,
            })}
          >
            Sign in
          </Link>
        </Button>
      </AuthPageBody>
    )
  }

  return (
    <AuthPageBody>
      <AuthPageHeader
        description={
          accepted
            ? "You can open your workspace settings to get started."
            : "We could not accept this invitation automatically. Try again or contact your workspace admin."
        }
        title={
          accepted ? "Welcome to the workspace" : "Invitation not accepted"
        }
      />
      <Button asChild className="w-full" size="lg" type="button">
        <Link to={routes.organizationPeople}>
          {accepted ? "Open workspace" : "View workspace"}
        </Link>
      </Button>
    </AuthPageBody>
  )
}
