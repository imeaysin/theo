import { Link, useNavigate, useParams } from "react-router-dom"
import { useState } from "react"
import { authClient, useSession } from "@workspace/auth/client"
import { Button } from "@workspace/ui-shadcn/components/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui-shadcn/components/card"
import { Spinner } from "@workspace/ui-shadcn/components/spinner"
import {
  acceptInvitationPath,
  defaultAuthenticatedRoute,
  routes,
} from "@/config/routes"
import { withAuthRedirectQuery } from "@/routing/safe-redirect"

const INVITATION_ERROR = "Unable to accept invitation"

export function AcceptInvitationPage() {
  const { invitationId } = useParams()
  if (!invitationId) return <InvalidInvitationCard />
  return <AcceptInvitationBody invitationId={invitationId} />
}

function AcceptInvitationBody({
  invitationId,
}: {
  readonly invitationId: string
}) {
  const { data: session, isPending } = useSession()
  if (isPending) return <PendingSessionCard />
  if (!session) return <SignInRequiredCard invitationId={invitationId} />
  return <AcceptInvitationActions invitationId={invitationId} />
}

function AcceptInvitationActions({
  invitationId,
}: {
  readonly invitationId: string
}) {
  const navigate = useNavigate()
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [isAccepting, setIsAccepting] = useState(false)

  async function acceptInvitation() {
    setIsAccepting(true)
    setStatusMessage(null)
    const result = await authClient.organization.acceptInvitation({
      invitationId,
    })
    setIsAccepting(false)
    if (result.error) {
      setStatusMessage(result.error.message ?? INVITATION_ERROR)
      return
    }
    navigate(defaultAuthenticatedRoute, { replace: true })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Accept invitation</CardTitle>
        <CardDescription>
          Join the organization using the invitation sent to your email.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {statusMessage ? (
          <p className="text-sm text-destructive">{statusMessage}</p>
        ) : null}
        <Button disabled={isAccepting} onClick={() => void acceptInvitation()}>
          {isAccepting ? <Spinner data-icon="inline-start" /> : null}
          {isAccepting ? "Accepting…" : "Accept invitation"}
        </Button>
      </CardContent>
    </Card>
  )
}

function SignInRequiredCard({
  invitationId,
}: {
  readonly invitationId: string
}) {
  const redirectTarget = acceptInvitationPath(invitationId)
  return (
    <Card>
      <CardHeader>
        <CardTitle>Accept invitation</CardTitle>
        <CardDescription>Sign in to join this organization.</CardDescription>
      </CardHeader>
      <CardFooter className="flex flex-col items-stretch gap-2">
        <Button
          nativeButton={false}
          render={
            <Link
              to={withAuthRedirectQuery(routes.signIn, {
                redirect: redirectTarget,
                fallback: defaultAuthenticatedRoute,
              })}
            />
          }
        >
          Sign in
        </Button>
        <Button
          nativeButton={false}
          render={
            <Link
              to={withAuthRedirectQuery(routes.signUp, {
                redirect: redirectTarget,
                fallback: defaultAuthenticatedRoute,
              })}
            />
          }
          variant="outline"
        >
          Create account
        </Button>
      </CardFooter>
    </Card>
  )
}

function PendingSessionCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Checking session…</CardTitle>
      </CardHeader>
    </Card>
  )
}

function InvalidInvitationCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invalid invitation</CardTitle>
        <CardDescription>This invitation link is incomplete.</CardDescription>
      </CardHeader>
    </Card>
  )
}
